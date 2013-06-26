var pith = require('./index.js')
var h = require('hyperscript')
var o = require('observable') //or subsume into pith.o
var THREE = require('css3drenderer')
var d3treeNav = require("./miscjs/TreenavLayout.js")
var TWEEN = require('tween')
var DAGDoc = pith.DAGDoc
var key = require('keymaster')
var beautify = require('js-beautify').js_beautify
var createEditor = require('javascript-editor')
//:%!xclip -sel clip
//u
//being able to get information customers is important, without taking advantage of confidentiality challenge)
var A = new DAGDoc()
window.A = A
window.selObj = selObj
var ioo = o()
ioo(function(x){console.log(x)})
A.on('add',ioo)
var testTree = A.addJSONAtom({
  title:"asfasfdasf243243d",
  children:[
    {
      title:"aaasaaaadsaada",
      func: function (x) {
            x = 11(x)
    x = 12(x)
        return x*x
      },
    children:[{title:"me2",children:[],func:function(a,b){return a*2+b}},{title:"me",children:[],func:function(a,b){return a+b}},{title:"too",children:[],func:function(abc){return abc}}]
 
    }
  ]
})

/*var helpers = A.addJSONAtom({

})

var entry = A.addJSONAtom({
    func: function(inputs, window, dd) {
        console.log(window)
    }
})*/

var inputs = {}

//entry.func(inputs, window, A)


//  //no scrolling!   //It's much nicer to just resize the textarea to fit
//  // beefy zui.js --live --open --debug=false -- --fast --noparse=three.min.js
//  beefy zui2.js --live --open --debug=false -- --fast --noparse=three.min.js & cd ../ReMapmessingwith; crud-file-server 
//
//  var flipcounter = require('flip-counter');
//
//  var div = document.createElement('div');
//  div.className = 'flip-counter';
//
//  var counter = flipcounter(div, {
//      value: 3
//      })

var zen




var zen2

//i need a fullscreen page sliding thing, just like those presentation libraries, with text view and markdown text edit (and then RTE) - i'm appealing to developers first!!!
//with those really simple indicators along the sides
//and you can trivially upload attachments and reference them

//UI needs to indicate change, but not automatically reprocess!
//trigger check changes before using the kernel, and don't modify a changed node without reprocessing first

var exports = {};

exports.init = function() {}

exports.on_dom_ready = function(cb) {
    kernel = acorn.use('master');
    kernel.loadTree("max", false, function(err, response) {
        init()
        animate()
        return //window.init()
    });
}


var camera, scene, renderer;
var geometry, material, mesh;

var controls;

var objects = [];
var targets = {
    helix: [],
    grid: [],
    remap: [],
    remap0: [],
    remap1: [],
    remap2: []
};

//      var selObj = null;
var currobject = null;
var camObj = {
    "object": {
        "position": {
            "x": 0,
            "y": 0,
            "z": 0
        }
    },
    "target": {
        "position": {
            "x": 0,
            "y": 0,
            "z": 0
        }
    }
}

var asdf;

var c1w;
var columnWidths = [];

var anim; //only the camera animation TWEEN

var currroot;

var treeNav;

var treeNavParams;

var inTransition = false;
var onTransitionEnd = function() {};

var tweeningCamera = true;

function winnerHeight() {
    return window.innerHeight;

}

function winnerWidth() {
    return window.innerWidth // - 50;

}


function init() {
    kx = 1000;
    ky = 1000;
    fov = 50;
    fovratio = winnerWidth() / winnerHeight();
    camera = new THREE.PerspectiveCamera( /*75*/ fov, fovratio, 1, 50000);
    camera.position.z = 10000 //2*kx;
    lookeyHere = new THREE.Vector3();
    lookeyHere.x = 0;
    lookeyHere.y = 0;
    lookeyHere.z = 10000 //1000;
    camera.lookAt(lookeyHere);
    //can add canvas rendered behind!!! view-source:http://mrdoob.github.com/three.js/examples/css3d_sandbox.html


    scene = new THREE.Scene();
    globalDuration = 200 //or 0 for massively responsive design ;)

    currobject = kernel.root.children[0]; //scene.position; //this needs thinking about
    selObj = kernel.root.children[0];
    currrroot = kernel.root;

    columnProportions = [-0.06, //gap then angle
        0.801, //0.000000001,//
        0.101,
        0.5,
        0.1,
        0.3,
        0.05,
        0.05,
        0.05,
        0.025,
        0.04,
        0.0125 /*  */
        //gotta keep those numbers DECREASING!

        //need to build a function to handle this!!!!
    ]

    for (i = 0; i < columnProportions.length; i++)
        columnWidths[i] = winnerWidth() * columnProportions[i];

    c1w = columnWidths[2];

    treeNavParams = {
        "nodeWidth": 200, //kx,//kx = width ~ need to clean up !
        "nodeHeight": 123.6, //kx / 1.618,//kx = width ~ need to clean up !
        "fov": fov * fovratio, //this is a hack, i think
        "visWidth": winnerWidth(),
        "localRoot": currrroot, //.children[1], //within d3ext i need to add a flag on currrroot, and recursively apply to establish "active" localdepth
        "xdist": columnWidths,
        "depth1pxYGap": 120, //100,
        "cameraY": 0,
        "backingUp": false,
        "oldLocalRoot": null,
        "zDepthRange": 1,
        "zDepthFactor": 0.3,
        "ghostObj": null
    };
    //visibility cutoff, and fading ought to be derived from the scale values imo, and calculate in the app not the transform
    treeNav = d3treeNav()
        .value(function(d) {
            return 1
        })
        .sort(function(d) {
            return d
        }) //can lose the function(d) i think :)
    .params(treeNavParams);
    kernel.root.d3parent = kernel.root.parent;
    Object.keys(kernel.docIDToNode).forEach(function(key){
      var t = {
        "position": new THREE.Vector3,
        "rotation": new THREE.Vector3,
        "scale": new THREE.Vector3,
        "visible": false
      }
      kernel.docIDToNode[key].target = t
      t.position.set(-10000, 0, 0)
      t.scale.set(1, 1, 1)
      t.rotation.set(0, 0, 0)
    })
    thedata = treeNav.nodes(kernel.root)

//    thisIsNotForDOM = document.createElement('div');
    //need this code to evaluate every transform2
    //d3.select(thisIsNotForDOM).selectAll("div").each(function(d,i){return; var togglevisibilityhere;})

    //need this code to evaluate every yslide
    //d3.select(thisIsNotForDOM).selectAll("div").each(function(d,i){return; var ifvisibleandforeachdepth,slide accordingly to context;})

//uaw raynos/class-list
    function IORedraw() {
      //console.log(treeNav.nodes(kernel.root))
      treeNav.nodes(kernel.root).forEach(function(row,i){
        var rowClick = (function(){return function(){click(row)}}())
        var newEl = h('div.element' + (row.isGhost ? ".ghost" + row.ghostType : "")+"#gid"+row.id,generateHTML(row),
          {style:
            {
             "overflow":"hidden",
            "text-align":"left",
            "position":"absolute" 
            },
        onclick: function (e){
          rowClick()
        }})
        var newObj = new THREE.CSS3DObject(newEl)
        row.element = newEl
        row.object = newObj 
        newObj.position.x = Math.random() * 4000 - 2000;
        newObj.position.y = Math.random() * 4000 - 2000;
        newObj.position.z = Math.random() * 4000 - 2000;
        newObj.owningNode = thedata[i];
        scene.add(newObj)
        objects.push(newObj)

//        createEditor({container: document.querySelector('#editorid'+row.id)})

                                                            
      })
    }
//    IORedraw();
    ioo(IORedraw)    
    function generateHTML (row){
      return h('div.symbol#ngid'+row.id,
              h('div.symboltitle',row.id),
              row.doc.func && beautify(row.doc.func.toString(),{indent_size:2}),
              h('div#editorid'+row.id)
          )
      //somewhere else Object.keys(kernel.docIDToNode).forEach(function(rowid){createEditor({container: document.querySelector('#editorid'+rowid)})})
    }

        //^put in a template to add controls on the nodes//not controls, just info!!!
        //info bar along the bottom

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(winnerWidth(), winnerHeight());
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = 1;
    document.body.appendChild(h('div#container'));
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.addEventListener('change', render);

    navmodeon = true

    function keyboardInit() {
        key('d, right', function() {
            if (navmodeon) {
                if (selObj.d3children && selObj.d3children.length > 0) {
                    console.log(selObj)
                    selObj.last && selObj.last != selObj ? click(selObj.last) : click(selObj.d3children[0]); //selObj.vischildren ? acorninit(selObj.vischildren[0],false,kernel.subtrees[selObj.vischildren[0].db]) : null;                
                    //possibly need to think about whether .last has any implications when messin around with ghosts
                }
            }
        });
        key('w, up', function() {
            navmodeon ? click(selObj.d3parent.d3children[((selObj.d3parent.d3children.indexOf(selObj) - 1) + selObj.d3parent.d3children.length) % selObj.d3parent.d3children.length]) : null;
        });
        key('s, down', function() {
            navmodeon ? click(selObj.d3parent.d3children[((selObj.d3parent.d3children.indexOf(selObj) + 1) + selObj.d3parent.d3children.length) % selObj.d3parent.d3children.length]) : null;
        });
        key('a, left', function() {
            if (navmodeon && selObj.d3parent.d3parent != selObj.d3parent) {
                click(selObj.d3parent, true);
            }
        });
        key('space', function() {
            if (selObj.isGhost)
            //kernel.loadGhost(selObj,function(realnode){
                loadGhost(selObj, function(realnode) {
                    //remember in future, only click should modify selObj!
                    //there should be another function, like transform2 but with 0 duration (a setter, in reality), that i can call directly here, that preloads new coordinates using another flag with d3ext so that transitions are smoother! then only render after the second transforming function
                    if (realnode != -1) //not error
                        click(realnode);
                })
            else
                resetNode(selObj, function(selObj) {
                    if (selObj != -1) //not error
                        click(selObj);
                });
            return;

            /*kernel.addNode(selObj,{"title":"forever and always"},0,function(retObj){IORedraw();click(retObj);})  */
        });

    }
    keyboardInit();
    transform2(0);

    window.addEventListener('resize', onWindowResize, false);
    render();
}

function click(d, backingUp, ghostObj) { //neither backingUp or ghostObj are being used :D

    //this is an efficiency to consider....
    /*if(selObj.d3parent == d.d3parent && !(somekindofloadghostorsomethingstaticjusttookplace))
     * selObj = d;
      else*/
    
    //if(d.d3parent == selObj.d3parent || d.d3parent == selObj)
    //    tweeningCamera = true;

    selObj.d3parent.last = selObj;
    selObj = d;
    reflow(selObj.d3parent); //d3ext uses newSelObj (which could equally be passed as a parameter here, to work out the heading right offset (relevant for .last) - not anymore!
    render();
}

function reflow(d, backingUp, ghostObj) { ///so where I use Obj ... i probably mean node ;)
    treeNavParams.oldCamObj = camObj //camObj is the snap position, not the current cameraY     //selObj//camObj//treeNavParams.localRoot
    treeNavParams.newSelObj = selObj
    treeNavParams.localRoot = d //.d3parent;
    treeNavParams.cameraY = camera.position.y;
    treeNavParams.backingUp = backingUp;
    treeNavParams.ghostObj = ghostObj ? ghostObj : null;

    treeNav.nodes(kernel.root);
    //treeNav.nodes(d); - interesting! will need to think seriously about this
    transform2(globalDuration * 2);
}

function inPresentPath(leafNode, checkNode) {
    function recurCheck(node) {
        if (node === checkNode)
            return true
        if (node.d3parent === node) //root
            return false
        return recurCheck(node.d3parent)
    }
    return recurCheck(leafNode);
}

function loadGhost(ghost, callback) {
    if (ghost.ghostType === undefined)
        return callback(-1) // error - though i don't think this code works
    if (inPresentPath(ghost, ghost.node))
        return callback(-1)

    node = ghost.node;
    if (node.graftGhost)
        node.graftGhost.skipGhost = false;
    node.graftGhost = ghost;

    ghost.skipGhost = true;
    return callback(ghost);
};

function resetNode(node, callback) { //regarding Ghosts! these need grouping

    //if(ghost.ghostType === undefined)
    //    return callback(-1) // error - though i don't think this code works
    if (node.graftGhost) {
        ghost = node.graftGhost;
        ghost.skipGhost = false;
        node.graftGhost = null;
        return callback(node);
    } else
        return callback(-1);
};


function transform2(duration) {

    inTransition = true;


    function boundFunction(displayToggle) {
        //this.owningNode.element.style.display = displayToggle;
        //this.visible = true//displayToggle;
        this.owningNode.element.style.visibility = displayToggle;
        //console.log(this.visible + " " + displayToggle)
    }

    TWEEN.removeAll();
    //could apply all these tweens and keep a reference to remove them without affecting the camera
    for (var i = 0; i < objects.length; i++) { //need to use a returned d3selection here, rather than iterating blindly
        someDuration = duration;
        if (objects[i].owningNode.activeLocal) {
            displayToggle = "visible" //"block";
            //displayToggle = true
        } else {

            if (objects[i].owningNode.element.style.visibility == "hidden")
                someDuration = 0
            displayToggle = "hidden" //"none";
        }

        var object = objects[i];

        var target = object.owningNode.target;

        //                    object.visible = target.visible;// (would ideally like to run this after the onComplete below, needs binding or something though
        //object.visible is NOT implemented in CSS3DRenderer... or something

        //if(!target.visible)
        //  object.parent.__removeObject(object)
        //if object.visible || target.visible

        if (displayToggle == "visible")
            object.owningNode.element.style.visibility = displayToggle;

        tweenfunc = TWEEN.Easing.Exponential.InOut
        object.owningNode.scaleobj = { //properties can't start with numbers!!!!
            transform: object.owningNode.element.style.transform,
            owningNode: object.owningNode
        }

        new TWEEN.Tween(object.position)
            .to({
                x: target.position.x,
                y: target.position.y,
                z: target.position.z
            }, someDuration)
            .easing(tweenfunc)
            .onComplete(boundFunction.bind(object, displayToggle))
            .start();

        new TWEEN.Tween(object.rotation)
            .to({
                x: target.rotation.x,
                y: target.rotation.y,
                z: target.rotation.z
            }, someDuration)
            .easing(tweenfunc)
            .start();

        new TWEEN.Tween(object.scale)
            .to({
                x: target.scale.x,
                y: target.scale.y,
                z: target.scale.z
            }, someDuration)
            .easing(tweenfunc)
            .start();
        //if !target.visible
        //make invisible at the end of the other transitions
        //else if !object.visible && target.visible
        //make visible at the end of the other transitions               
        //else no tweens !

        //need to tween opacities, of object itself AND the div content / toggle div content visibility         

    }

    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .onComplete(function() { /*selObj = kernel.root;*/
            inTransition = false;
            //console.log(onTransitionEnd)
            onTransitionEnd();
            onTransitionEnd = function() {};
            render();
        })
        .start();

    //to exmplore at some point....
    //// after tweenHead, do tweenBack
    //tweenHead.chain(tweenBack);
    // And after tweenBack, do tweenHead, so it is cycling
    //tweenBack.chain(tweenHead);            
}

function adjustYScales() {
    return;
    var depth2 = asdf.filter(function(d, i) {
        return d.localDepth == 2;
    });
    depth2.each(function(d, i) {

        d.object.position.y = d.target.position.y - camera.position.y * ((d.target.position.z - 10000) / (d.d3parent.target.position.z - 10000)) * 0.73 //  *0.68 //hack!
    })

    var depth0 = asdf.filter(function(d, i) { //this will return all of them, of course
        return d.localDepth == 0; //maybe use currroot or something
    });

    depth0.each(function(d, i) {
        nodeHeight = (kx / 1.618);
        depth1pxYGap = 200;
        d1TotalHeight = d.d3children.length * (nodeHeight + depth1pxYGap);
        //^ what am i going to do about these??
        d.object.position.y = camera.position.y - ((camera.position.y + d1TotalHeight / 2) / (d1TotalHeight / 2)) * nodeHeight //d.target.position.y - camera.position.y*((d.target.position.z - 10000)/(d.d3parent.target.position.z - 10000))     *0.68 //hack!
    })

}

function selectOnScroll() {

    //            .attr("class", "element")
}


function clipY() {
    return;
    if (camera.position.y > currrroot.children[0].object.position.y) {
        camera.position.y = currrroot.children[0].object.position.y
        //camera.lookAt(currrroot.children[0].object.position); 
    } else if (camera.position.y < currrroot.children[currrroot.children.length - 1].object.position.y) {
        camera.position.y = currrroot.children[currrroot.children.length - 1].object.position.y
        //camera.lookAt(currrroot.children[currrroot.children.length-1].object.position);                     
    }
}

function onWindowResize() {

    camera.aspect = winnerWidth() / winnerHeight();
    camera.updateProjectionMatrix();

    renderer.setSize(winnerWidth(), winnerHeight());

}

function animate() {

    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();

}
var pparams = []

    function render() {
        function theSamePosition(pos1, pos2) {
            if ((pos1.x == pos2.x) && (pos1.y == pos2.y) && (pos1.z == pos2.z))
                return true;
            return false;
        }

        //i think something needs doing below about that annoying overshoot transitioning when backingUp
        if (camObj != selObj && !theSamePosition(camObj.target.position, selObj.target.position)) //&& (selObj != camObj.d3parent) )//&& camObj.d3parent && !theSamePosition(selObj.target.position, camObj.d3parent.object.position))//&& (selObj != camObj.d3parent))
        {
            //if inTransition, jump the camera //and also jump the nodes up above somehow?
            //ORRRRR accelerate the old transition and make the two equal the default duration !!
            var param
            camObj = selObj;


            //currobject.element.className = "element"
            currobject.element.classList.remove("element-selected")
            currobject.element.classList.add("element")

            currobject = selObj; //scene.position );

            currobjectpos = currobject.target.position;

            currobject.element.classList.remove("element")
            currobject.element.classList.add("element-selected")
            //probably need to do some string manipulation... i'm sure there's a lib for this!

            //selObj = null;

            function lerp(a, b, f) {
                ret = new THREE.Vector3();
                ret.x = a.x + f * (b.x - a.x);
                ret.y = a.y + f * (b.y - a.y);
                ret.z = a.z + f * (b.z - a.z);
                return ret;
            }


            onCameraAnimUpdate = function() {
                var currentPos = lerp(startPos, endPos, param.t);
                var currentLookAt = lerp(startLookAt, endLookAt, param.t);
                camera.position.set(currentPos.x, currentPos.y, currentPos.z);
                currentLookAt = currentPos.clone() //otherwise the camera tilts... but leaving behaviour in for now... for inspiration!!
                currentLookAt.z = 0;
                camera.lookAt(currentLookAt);
                //startLookAt = currentLookAt.clone();
                render();
            }

            onCameraAnimComplete = function() {
                //createControlsForCamera();
                controls.target = endLookAt;
                anim.stop()
                anim = null
                //inTransition 
            }


            newPos = new THREE.Vector3();
            newPos.x = currobjectpos.x + winnerWidth() / 2 - (winnerWidth() * 0.5) / 2 //- currobject.actualWidth/2//camera.position.x
            newPos.y = currobjectpos.y
            //console.log(newPos.y);
            newPos.z = camera.position.z //currobject.z + 2000//currobject.z + selObj.dy*(kx*2*3)                        
            newLookAtPos = newPos.clone()
            //newLookAtPos.y = camera.position.y
            newLookAtPos.z = 0
            startPos = camera.position.clone();
            startLookAt = controls.target;
            endPos = newPos;
            endLookAt = newLookAtPos //currobjectpos.clone();

            param = pparams[pparams.push({
                t: 0
            }) - 1];


            //TWEEN.Easing.Sinusoidal.InOut

            if (anim)
                anim.stop() //TWEEN.remove(anim)

            var oldanim = anim

            anim = new TWEEN.Tween(param).to({
                t: 1.0
            }, globalDuration).easing(TWEEN.Easing.Linear.None); //if url param has anim=true then use tween 500

            anim.onUpdate(onCameraAnimUpdate); //Util.bind(this, 
            anim.onComplete(onCameraAnimComplete);
            //console.log(oldanim)
            //oldanim ?
            //  oldanim.chain(anim):
            //console.log(oldanim)}
            anim.start()

            /*if(tweeningCamera){
              anim.start()
              tweeningCamera = false
            }
            /*if(inTransition){
              onTransitionEnd = anim.start
            }
            else
              anim.start()*/

            //selObj = null;


/*There are a number of nice options with tween  Using the elastic easing is pretty crazy on a camera, haha
var target = new THREE.Vector3(0,0*CNspacing,0);
function tweenCamera(position, target){
new TWEEN.Tween( camera.position ).to( {
x: position.x,
y: position.y,
z: position.z}, 600 )
.easing( TWEEN.Easing.Sinusoidal.EaseInOut).start();
new TWEEN.Tween( controls.target ).to( {
x: target.x,
y: target.y,
z: target.z}, 600 )
.easing( TWEEN.Easing.Sinusoidal.EaseInOut).start();
*/
        }
        ////camera.lookAt(currobject);

        //adjustYScales();
        //if(!inTransition)
        //    clipY();
        renderer.render(scene, camera);

    }



require('./miscjs/TC.js')(THREE,window)
var selObj
var elementz = document.createElement('link');
elementz.type = 'text/css';
elementz.rel = 'stylesheet';
elementz.href = 'http://localhost:8080/css/app.css'
var elementz2 = document.createElement('link');
elementz2.type = 'text/css';
elementz2.rel = 'stylesheet';
elementz2.href = 'http://localhost:8080/css/app2.css'
document.body.appendChild(elementz)
acorn = require('./miscjs/acorn.js')()
kernel = acorn.use('asdf')
kernel.loadDoc && kernel.loadDoc(A, false, function(err, response) {
    init()
    animate()
    return //window.init()
});
kernel.loadDoc || kernel.loadTemp("max", false, function(err, response) {
    init()
    animate()
    return //window.init()
});

//init()
