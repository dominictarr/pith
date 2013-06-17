var pith = require('./index.js')
var h = require('hyperscript')
var o = require('observable') //or subsume into pith.o
var t = require('css3drenderer')
var DAGDoc = pith.DAGDoc

var A = new DAGDoc()

var helpers = A.addJSONAtom({

})

var entry = A.addJSONAtom({
  func: function(inputs, window, dd){
    console.log(window)
  }
})

var inputs = {}

entry.func(inputs, window, A)
window.document.body.appendChild(h('div#page','asfadfasdjdjdaddf'))
var renderer = new t.CSS3DRenderer()
var scene = new t.Scene()
var camera = new t.PerspectiveCamera( 75, 1, 1, 50000 )
renderer.setSize( 50,50)//winnerWidth(), winnerHeight() );
renderer.domElement.style.position = 'fixed'
renderer.domElement.style.top = 1
document.body.appendChild( renderer.domElement )

renderer.render(scene, camera)

//  //no scrolling!   //It's much nicer to just resize the textarea to fit
// beefy zui.js --live --open --debug=false -- --fast --noparse=three.min.js
