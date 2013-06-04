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
//var newDAG = A.addJSONAtom(addDAGobj)
var o = require('observable')
var v = o()
v(1)
setInterval(function () {if(v()>20)return;v(v() + 1)}, 500)
//newDAG.func(v)


var giantmonad = {
  func: function (){},
  l:1,
  children:[
    {
      l:21,
      func: function (){}
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
//    rooto([tree.id])
    function recurse (subtree,parento){
      var reto = o()
      reto([[],[]])
      console.log("new" + subtree.id)
      return subtree.state.children ?
        (reto([subtree.state.children
          .map(function(id){
            var child = dagdoc.get(id)
            child.revved.once('add',function(row){//as is, not necessarily the most recent rev, hmm
              var news = subtree.insertChildren([[subtree.state.children.indexOf(id),1,row.id]])
              //need to recurse again!!
              var pos = subtree.state.children.indexOf(id)
              console.log(subtree.state.children)
              console.log(pos + " " + row.id + " " + id)
              console.log("child " + id + " of parent " +subtree.id + " replaced by " +news.id)
//              console.log(subtree.state.children)
              var revoo = parento()[0].slice() //possibly don't need to slice()
              var revoc = parento()[1].slice()//subtree.state.children.slice()

              parento([(revoo.splice(pos,1,recurse(news,parento)),revoo),/*could use parento again to make consistent*/(revoc.splice(pos,1,row.id),revoc)])
              //console.log(parento())
              //subtree.insertChildren([[subtree.state.children.indexOf(id),1,row.id]])
            })
            return child
          })
          .map(function(){return recurse(arguments[0],reto)}),subtree.state.children]), reto)
        : reto
    }
    return (rooto([[recurse(tree,rooto)],[tree.id]]),rooto)
  }
}

//var B = new DAGDoc() -- bug with multiple DAGDocs??? oh dear!

var rootstate = []//thislevel, childobjs
function drawRecurse(sig){
  if(!sig[0].length) return
  //console.log(sig)
  console.log(sig[1])
  sig[0].map(function(o){drawRecurse(o())})
  //console.log(sig[1][0])
}
var gm = A.addJSONAtom(giantmonad)
var gmsig = A.addJSONAtom(gmproc).func(gm,A)
gmsig(function(){console.log("-------");drawRecurse(arguments[0])})
//gmsig(function(){console.log(A.get(arguments[0]))})
A.get(A.get(gm.state.children[1]).state.children[0]).insertChildren([[0,0,{a:6}]])//.insertChildren([[0,0,{b:6}]])
//console.log(A.rows)
