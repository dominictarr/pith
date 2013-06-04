var util = require('util')
  
var DAGDoc = require('./index.js').DAGDoc
var A = new DAGDoc()

var root = A.add({id:'root'})
var dag1 = A.add({id:'Robots',tags:[root.id]})
A.add({id:'Humans',tags:[root.id]})
A.add({id:'abc'})
//var dagDef = []
var p = A.add({'content':'p'})
var b = A.get(dag1.insertChildren([[0,0,{'content':'b'}]]).state.children[0])
var e = A.get(b.insertChildren([[0,0,{'content':'e'}]]).state.children[0])
A.get(e.insertChildren([[0,0,{'content':'e','children':[p.id]}]]))
var o = A.get(b.latestRev().insertChildren([[1,0,{'content':'o'}]]).state.children[1])
o.insertChildren([[0,0,{'content':'o','children':[p.id]}]])

function printDAG (rowid){
  var row  = (A.get(rowid).latestRev() && A.get(rowid).latestRev().state) || A.get(rowid).state
  var content = row.content || ""
  if(!(row.children && row.children.length > 0))
    return content
  return content + row.children.map(printDAG).join(' ' + content)
}
//console.log(util.inspect(), false, null))
console.log(printDAG(b.latestRev().id))
//console.log(util.inspect(b.latestRev().latestToJSONTree(), false, null))

var addDAGobj = {
  x : 5,
  y : 2,
  children : [
  {
    q : 2,
    d : 5,
    func: function yay (n){
      var asdf = observe('LOLOL/minilol');
      var asdf2 = observe('LOLOL');
      //asdf(12);
      //console.log(asdf(4));
      console.log(LOLOL("lololtesting"))
      asdf(jeremy)
      LOLOL("again!")
      console.log(asdf2()) 
      return n+0.5},
    children : [
    { k : 2,
      func: function LOLOL (a) {return a + "!!!" + minilol(a)},
      children:[
      { 
        func: function minilol (a){
          return a+20}
      }]
    },
    { h : 3, func: function jeremy (abc) {console.log(abc + "jeremy!")}}]},
    { func: function foldtestparent (v) {
        foldavg(foldpif(v,function(x){return x%2}),5)
          (function (){console.log(arguments[0]+" is the average")})
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
                },
                0)/n
            }
            o(function(x){favgres(average(sampleLength,pushnpop(aaoo(),sampleLength,o())))})
            return foldavgo
          }
          ,children:
          [
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
  ],
  func: function yay (y,z,v){
    foldtestparent(v)
    /*observe('foldpparent/average')(function(){console.log(arguments[0]+" is the average")})*/
    var thing = y + 5,otherthing = 322
    return z*yay(thing)
  }
}
var newDAG = A.addJSONAtom(addDAGobj)
var o = require('observable')
var v = o()
v(0)
setInterval(function () {
  v(v() + 1)
}, 300)
console.log(util.inspect(newDAG.func(3,2,v),false,null))
