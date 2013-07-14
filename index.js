var crdt  = require('crdt')
var clone = require('clone')
var between = require('between')
var o = require('observable').signal
var detective = require('detective')
var util = require('util')
var extend = require("xtend")
var deepMerge = require("deep-merge")
require('sha-lite')
var hashLib = function(str){return str.sha256()}
var hash = function(obj){obj.id = ""+ hashLib(JSON.stringify(obj)+(obj.func/*&&typeoffunc*/?obj.func.toString():''));/*console.log("vvv");console.log(obj);*/return obj}
//below hashes for testing
var fakehashcounter = 10
var hash = function(obj){obj.id = ""+fakehashcounter++;return obj}
var hash = function(obj){obj.id = ""+ hashLib(JSON.stringify(obj)+Math.random()+(obj.func/*&&typeoffunc*/?obj.func.toString():''));/*console.log("vvv");console.log(obj);*/return obj}

function createId () {//should probably do something cleverer e.g. timestamp+atomicRootId+uuid
  return [1,1,1].map(function () {
    return Math.random().toString(16).substring(2).toUpperCase()
  }).join('')
}

function sort (array) {
  return array.sort(function (a, b) {
    return between.strord(a.get('_sort'), b.get('_sort'))
  })
}

function createSort () { 
  var date = new Date()
  return date.getTime()
}

module.exports = (function () {
  crdt.prototype._oldAdd = clone(crdt.prototype.add)
  crdt.DAGDoc = function () {

    // I NEED TO CREATE A CLEAN TIMESEQ THING THAT ISN'T HORRIBLE!!!!!!!!!!!!!!!!!!!
    var TimeSeq = clone(crdt.Seq)   
    function _set(self, key, val, type) {
      var id = typeof key === 'string' && key + ':' + val //key should never be a string with TimeSeq
      if(id && self.sets[id]) {
        return self.sets[id]
      }
      var set = new type(self, key, val, "createReal")
      set.insert = function(obj, before, after){
        function toKey (key) {
          return (
            'string' === typeof key ? key
              :  key instanceof crdt.Row ? key.get()._sort
              :  key                ? key._sort
              : null
          )
        }
        
        before = toKey(this.get(before) || '!')
        after  = toKey(this.get(after)  || '~')
        
        //must get id from the doc,
        //because may be moving this item into this set.
        if('string' === typeof obj)
          obj = doc.rows[obj]
        
        var r, changes
        //if(obj instanceof crdt.Row) {
        /*  console.log("Error: time cannot be modified")
        } else {*/
          //obj._sort = _sort
        //  if (key) {
        //    obj[key] = val
        //  }
          //r = doc.set somethin'
        //}
        sort(this._array)
        return obj
      }
      if (id) {
        dagdoc.sets[id] = set
      }
      return set
    }
    
    var dagdoc = new crdt.Doc()

    crdt.Row.prototype._updateChildrenArr = function (childIDs, newid) {
      var newParent = clone(this.state)
      newParent.children = clone(childIDs)
      //newParent.id = newid || createId()
      if(!newParent.revs) newParent.revs = [] //age-old array vs obj question :/
      newParent.revs.splice(-1, 0, this.id)
//?//      newParent._sort = createSort()
      //newParent = hash(newParent)
      return dagdoc.add(newParent)      
    }

    crdt.Row.prototype.insertChildren = function (splices,doNotRecordParent) { //not a real splice until it accepts more than one insertion.....
      var children = (this.state.children && this.state.children.slice()) || []
      //var newParentId = createId()
      var self = this
      splices.map(function(splice){
        //if(!doNotRecordParent) splice[2].parent = newParentId
        var child = (typeof splice[2] === 'string' ? {id:splice[2]} : dagdoc.add(splice[2]))
        children.splice(splice[0],splice[1],child.id)
      })
      return this._updateChildrenArr(children)//, newParentId)
    }

    crdt.Row.prototype.latestRev = function(){
      if(!this.revved) return this
      return this.revved._array.filter(function(revverId){
        return dagdoc.get(revverId)}).sort(function(t1,t2){return t1._sort > t2._sort}).pop() || this
    }

    crdt.Row.prototype.children = function (){
      return this.state.children && this.state.children.map(function(child){
        return dagdoc.rows[child]//.state
      })
    }

    crdt.Row.prototype.parent = function (){
      return this.state.parent && dagdoc.rows[this.state.parent]
    }

    crdt.Row.prototype.toJSONTree = function (){
      var row  = this.state
      if(!row.children || row.children.length === 0)
        return row
      var ret = clone(row)
      ret.children = ret.children.map(
          function(childId){return dagdoc.get(childId).toJSONTree()}
      )
      return ret
    }

    crdt.Row.prototype.latestToJSONTree = function (){
      var row  = this.state
      if(!row.children || row.children.length === 0)
        return row
      var ret = clone(row)
      ret.children = ret.children.map(
          function(childId){return dagdoc.get(childId).latestRev().toJSONTree()}
      )
      return ret
    }
    
    crdt.Row.prototype.init = function (oPaths){
      var row = this
      if(!row.state.func){
        console.log("init called on row without func: " + row.id)
        return      
      }

      //TODO: if DAG is not complete and present, err/return

      var retOs = {}
      var newOPaths = {}
      var oId = createId()
      var retfunc
      var childNameToId = {}
      
      function funcName (func){
        return func.toString().substr(9,func.toString().indexOf('(')-9)
      }

      function pathsToHashTree (paths){
        var prep = paths.map(function(path){return path.split('/')})
        function transformm (pathArrs){
          var pathObj = {}
          pathArrs.map(function(pathArr){
            var prevObj = pathObj 
            pathArr.map(function(id){
              return prevObj = prevObj[id] = prevObj[id] || {}//true 
            })
          })
          return pathObj
        }
        return transformm(prep)
      }

      if(row.state.children) row.state.children.map(function(childId){
          var temp = dagdoc.get(childId).state
          if (temp.func /*typeof function*/) 
            childNameToId[funcName(temp.func)]=childId
        })

      retfunc = eval("lolwut = (function(z){"
        +(row.state._noStrict?'':"'use strict';")
        + 'return ' 
        + row.state.func.toString().substr(0,row.state.func.toString().indexOf('{')+1)
        + "function observe (path){ return "
            + (function(){
              var pathStrings = detective("var myfunc = " + row.state.func.toString()
                                    ,{word:'observe'})
                                  .filter(function(elem, pos, self) {
                                      return self.indexOf(elem) == pos
                                    })
              var newOPaths = pathsToHashTree(pathStrings)
              var pathTree = deepMerge(function(t,s,k){return s})(oPaths,newOPaths)
              
              Object.keys(pathTree)
                .map(function(childName){
                  var childId = childNameToId[childName]
                  var childOPaths = {}
                  if(!row.state.children || childId == undefined){
                    console.log("error, observable path isn't within the children DAG")
                    return ""
                  }
                  retOs[childName] = dagdoc.get(childId).init(pathTree[childName])
                })
              return pathStrings.map(function(pathString){
                  function getO (pathArr, retOs){
                    if(pathArr.length == 1)
                      return retOs
                    else
                      return getO(pathArr.splice(1),retOs[pathArr[0]][1])
                  }
                  var oThing = getO(pathString.split('/'), retOs)
                  return retString = "path == '" 
                    + pathString + "' ? dagdoc.get('" 
                    + oThing[pathString.split('/')[pathString.split('/').length-1]][2]//Object.keys(oThing)[0]][2] 
                    + "').o['" + oThing[pathString.split('/')[pathString.split('/').length-1]][0] + "'][0]:"//Object.keys(oThing)[0]][0] + "'][0]:"
                }).join("")}())
            + "function(){console.log(path + 'thisshouldnthappenever')}};"
        + (row.state.children ? row.state.children
            .map(function(childId){
              var child = dagdoc.get(childId).state
              if(!child || !child.func) return
              return 'var '
                + funcName(child.func) + '='
                + (retOs[funcName(child.func)] ? 
                    "dagdoc.get('"+child.id+"').o['" 
                      + retOs[funcName(child.func)][0] 
                      + "'][1];" 
                    : "dagdoc.get('"+child.id+ "').func;")
            }).join('') : '')
        + row.state.func.toString().substr(row.state.func.toString().indexOf('{')+1)
        +'}())')

      if(!oPaths){
        row._func = retfunc
        row.func = retfunc
        return {}
      }

      else {
        row.o = row.o || {}
        var newO = o()
        row.o[oId] = [
          newO, 
          function(){ 
            var res = retfunc.apply(row,arguments)
            newO(res)//if(newO != res) newO(res)
            //could make this more efficient / better / worse by comparing arguments with stored arguments and avoid computation entirely
            return res
          }
        ]
        return [oId,retOs,row.id] //retOs needs to be stripped down still, me thinks
      }
    }

    //some kind of deep-is in conjunction with JSONTree stuff?

    //For concise inline DAG definitions -- WIP
    //crdt.prototype.addParent = function (obj,children,dagDef,dagDefIndex) {
    //  obj.children = children
    //  var newParent = this.add(obj)
    //  if(dagDef) dagDef[dagDefIndex] = newParent
    //  return newParent.id
    //}

    crdt.prototype.add = function (initial){
      var filter //basically ruling out the key,value approach from now (unless the solution's simple!)
//?//      initial._sort = initial._sort || createSort() 
      hash(initial)
      var newRow = dagdoc._oldAdd(initial)
      newRow.tagged = dagdoc.createTimeSeq(filter = function (state) { 
          return state.tags && state.tags.some(function(tag){return tag === newRow.state.id})
      },newRow)
      newRow.revved = dagdoc.createTimeSeq(filter = function (state) { 
          return state.revs && state.revs.some(function(rev){return rev === newRow.state.id})
      },newRow)
      //what follows should be in seq, ideally
      for(var id in dagdoc.rows) {
        var row = dagdoc.get(id)
        /*if (key && row.get(key) === value) {
          add(row)
        } else*/ if (filter && filter(row.state)) {
            //dagdoc.add(row.state)
            newRow.tagged._array.push(row)
            newRow.tagged.rows[row.id]  = row
        }
      }
      sort(newRow.tagged._array)
      
      if(initial.func)// == typeof function)
        newRow.func = function (){
          return newRow.init() && newRow.func.apply(newRow,arguments)
        }
      dagdoc.emit('createReal', newRow)
      return newRow
    }
    
    crdt.prototype.createTimeSeq = function (key, val) {
      if(key === '__proto__')
        throw new Error('__proto__ is invalid key')
      return _set(dagdoc, key, val, TimeSeq)
    }

    crdt.prototype.addJSONAtom = function (DAGobj, parentId) {
      var root = DAGobj
      var map
      /*if(!root.id)
        root.id = createId()*/
  /*    var insertedIds = {}
      function insertIds (obj){
        if(obj.id){
          if(insertedIds[obj.id]) return //some sort of error
        }
        else
          obj.id = createId()

        insertedIds[obj.id] = obj.id
        obj.parent = this.id
        //obj.root = root.id
        if(!obj.tags)
          obj.tags = []
        //obj.tags.push(root.id)

        if(!obj.children || (obj.children && obj.children.length == 0))
            return {id:obj.id}
        return {id: obj.id, children:obj.children.map(insertIds, obj)}
      }

      root._map = DAGobj.children.map(function(child){
        var thechildren = insertIds.call(DAGobj,child)
        return thechildren})//{id: child.id, children:[thechildren]}})
*/
      function addRows (obj) {
        if(!obj.children || (obj.children && obj.children.length == 0)){
          return dagdoc.add(obj)
          return
        }
        obj.children.map(addRows)
        obj.children = obj.children.map(function(child){ return child.id})
        return dagdoc.add(obj)
      }
      
      return addRows(root) 
    }
    
    crdt.prototype.checkAtom = function (rowId) {
      function checkChildren (rowObj){
        return dagdoc.get(rowObj.id)
            && (rowObj.children && rowObj.children.length == 0
                ? rowObj.children.every(checkChildren) : true)
      }
      var row = dagdoc.get(rowId)
      var themap = row.state._map || dagdoc.get(row.state.root).state._map
      return row ? themap.every(checkChildren) : false
    }  

    crdt.prototype.countAtomMap = function (rowId) {
      function countChildren (acc,rowObj){
        return  acc + 1 + (rowObj.children && rowObj.children.length > 0
                  ? rowObj.children.reduce(countChildren,0) : 0)
      }
      var row = dagdoc.get(rowId)
      var themap = row.state._map || dagdoc.get(row.state.root).state._map
      return row ? themap.reduce(countChildren,1) : false
    }
    //event emitter on DAG completely recieved or something?
    return dagdoc
  }

  crdt.prototype.isPartOfDAGAtom = function (rowId) {
    return dagdoc.get(rowId).state.root ? true : false
  }

  
  crdt.prototype.addEdgeDag = function (){}
  return crdt
}())
