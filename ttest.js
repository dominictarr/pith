var util = require('util')
var DAGDoc = require('./index.js').DAGDoc
var xdiff = require('xdiff')

var A = new DAGDoc()

var addDAGobj = {
  func: function foldtestparent (v) {
    foldavg(foldpif(v,function(x){return x%2}),5)
      (function (){console.log(arguments[0]+" is the average of the following squares:\n["+observe('foldavg/fpoaold')()+"]")})
    fib(v)(function(){console.log(arguments[0]+" is next in the fib sequence")})
  },
  children:[
    {
      func: function foldp (o){
        var foldpoldo = observe('foldpold')
          foldpoldo(0)
          o(function(x){return foldpold(x+foldpoldo())})
          return foldpoldo		
      },	
      children:[
      {
        func: function foldpold (x) {return x}
      }
      ]
    },
    {
      func: function foldpif (o,ifFunc){
        var foldpoldo = observe('foldpold')
          foldpoldo(0)
          o(function(x){return foldpold((ifFunc(x)?x:0)+foldpoldo())})
          return foldpoldo		
      },	
      children:[
      {
        func: function foldpold (x) {return x}
      }
      ]
    },
    {
      func: function fib (o){
        var foldpoldo = observe('foldpold')
          var foldpold2o = observe('foldpold2')
          foldpoldo(0)
          foldpold2o(1)
          var z	
          o(function(x){return foldpold(foldpoldo()+(z = foldpold2o(),foldpold2o(foldpoldo()),z))})
          return foldpoldo
      },	
      children:[
      {
        func: function foldpold (x) {return x}
      },
      {
        func: function foldpold2 (x) {return x}
      }
      ]
    },
    {	
      func: function foldavg (o,sampleLength){
        var aaoo = observe('fpoaold')
        var foldavgo = observe('favgres')
        function pushnpop (arr,lim,pushee){
            arr.push(pushee)
              if(arr.length == lim + 1)
                arr.shift()
                  return arr
        }
        aaoo([])
        function average (n,p){
          return p.reduce(
            function(previousValue, currentValue, index, array){
              return previousValue + currentValue;
            },0)/(p.length < n ? p.length : n)
        }
        o(function(x){favgres(average(sampleLength,pushnpop(aaoo(),sampleLength,o())))})
        return foldavgo
      },
      children:[
        {
          func: function fpoaold (x){return x}
        },
        {
          func: function favgres (x){return x}
        }
      ]
    }
  ]
    
}
var newDAG = A.addJSONAtom(addDAGobj)
var o = require('observable')
var v = o()
v(1)
setInterval(function () {if(v()>20)return;v(v() + 1)}, 500)
newDAG.func(v)


var giantmonad = {
  func: function (){},
  l:1,
  children:[
    {
      l:21,
      func: function (){},
      children:[
        {
          func: function (){},
          l:30
        }
      ]
    },
    {
      l:22,
      func: function (){},
      children:[
        {
          func: function (){}
          ,l:31
        },
        {
          func: function (){},l:32
        }
      ]
    }
  ]
}

var gmproc = {
  _noStrict: true,
  func: function(tree,dagdoc){
    var rooto = o()
//    rooto([[],tree])
    function recurse (subtree,parento,parentncbo,diffroot){
      var diffpos
      if(diffroot && diffroot.state.children)//getDiffPos
      {
        var counter = 0
        diffroot.state.children.some(function(id,index){return (counter++,id != subtree.state.children)})
        diffpos = counter
      }
      console.log("new " + subtree.id)
      var reto = o()//diffroot ? parento()[0][diffpos] : o()
      var ncbo = o() //diffroot ? ??
      ncbo(false)
      reto([[],subtree])
      var thechildren = diffroot ? diffroot.state.children : subtree.state.children //should bring this logic together with what's below somehow, sometime!
      if(!(subtree.state.children && subtree.state.children.length)) return reto
      reto([thechildren
        .map(function(id,index){
            var child = dagdoc.get(id)
            child.revved.on('add',function(row){//as is, not necessarily the most recent rev, hmm

              return
            })
            return recurse(dagdoc.get(id),reto,ncbo)
       }),subtree])
       return reto
        
    }
    var ncbo  
    return (rooto(recurse(tree,rooto,(ncbo = o(),ncbo(true),ncbo))()),rooto)
  }
}

//var B = new DAGDoc() -- bug with multiple DAGDocs??? oh dear!

var rootstate = []//thislevel, childobjs
function drawRecurse(sig){
//  if(!sig[0].length) return
  console.log(sig[1].id)
  console.log(sig[0])
  console.log(sig[0].map(function(o){return o()[1].id}))//state)
  sig[0].map(function(o){drawRecurse(o())})
  //console.log(sig[1][0])
}
var gm = A.addJSONAtom(giantmonad)
var gmsig = A.addJSONAtom(gmproc).func(gm,A)
gmsig(function(){console.log("-------");drawRecurse(arguments[0])})
//gmsig(function(){console.log(A.get(arguments[0]))})
var thing = A.get(A.get(gm.state.children[1]).state.children[0]).insertChildren([[0,0,{a:6}]]).insertChildren([[0,0,{b:6}]])
//console.log(gm.revved._array.splice(-1)[0].state.children[1] + "affffff")
//A.get(gm.revved._array.splice(-1)[0].state.children[0]).insertChildren([[0,0,{asf:4}]])
//console.log(gm.revved._array.splice(-1)[0].insertChildren([[0,0,{dddd:223}]]))
//gmsig(function(){console.log("-------result");drawRecurse(arguments[0])})
//console.log(A.get("21").state.b)
//console.log(A.rows)


//ADD a .children()[3] operator
//revs aren't inserting correctly
