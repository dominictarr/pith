var pith = require('./index.js')
var h = require('hyperscript')
var o = require('observable') //or subsume into pith.o
var THREE = require('css3drenderer')
//var d3 = require('d3')
var d3 = {layout:{},rebind:d3_rebindfunc}
function d3_rebindfunc (target, source) {
  function d3_rebind (target, source, method) {
    return function() {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    }
  }
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
  return target;
}

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

//will need to accept [data,node,a,[%s]==1,z]


(function() {
    d3_layout_treeNav = function() {
        var theLocalRoot = null;

        function position(node, x, dx, dy, y) { //added parameter y
            var d3children = node.d3children;
            node.x = x;
            node.y = y + dy; //changed
            node.dx = dx;
            node.dy = dy * .5;
            targetPosition = new THREE.Vector3();
            zoffset = 10000; //actual offset    
            targetPosition.set(-zoffset, 0, 0)
            targetScale = new THREE.Vector3();
            targetScale.set(1, 1, 1)
            targetRotation = new THREE.Vector3();
            targetRotation.set(0, 0, 0)
            node.localDepth = null;

            if (node.target) {
                targetPosition = node.target.position;
                node.target.position.x = -10000
                node.target.position.z = 10000
            }
            node.target = {
                "position": targetPosition,
                "rotation": targetRotation,
                "scale": targetScale,
                "visible": false
            };
            node.activeLocal = false;

            if ((!theLocalRoot) && (node == params.localRoot))
                theLocalRoot = node;
            if (theLocalRoot && (node.d3parent.activeLocal || node == theLocalRoot)) {
                node.activeLocal = true;
                tempdepth = node.localDepth = node.depth - params.localRoot.depth;
                radFOV = params.fov * Math.PI / 180;
                xoffset = 0 //-params.visWidth/2
                //yoffset needs to be calculated OUTSIDE OF THIS RECURSION.. ie. down the bottom ;D
                yoffset = 0
                if (node.object) //subsequent to initial traverse
                {
                    c = params.oldCamObj
                    s = params.newSelObj
                    sd3p = s.d3parent
                    cd3p = c.d3parent
                    schildn = sd3p.d3children.indexOf(s)

                    if (c.d3parent.d3children.length > 1) {
                        yoffset = (c.object.position.y /*-cd3p.children[0].object.position.y*/ ) - ((cd3p.d3children[1].object.position.y - cd3p.d3children[0].object.position.y) * schildn) // - params.oldLocalRoot.position.y// theLocalRoot.object.position.y                    
                    } else if (c.d3parent.d3children.length == 1) {
                        yoffset = c.object.position.y - c.backupyinterval * schildn
                    } else
                        yoffset = theLocalRoot.object.position.y
                }
                prevXDist = 0;
                for (i = 0; i < tempdepth * 2 + 1; i++) {
                    prevXDist += params.xdist[i];
                }
                actualWidth = params.xdist[tempdepth * 2 + 1] // * params.visWidth;

                if (tempdepth * 2 + 1 > params.xdist.length) {
                    prevXDist *= 1.5 //arbitrary
                    actualWidth = 0.0001 //this ultimately needs to be in ADDITION to toggling visibility
                    //need to handle these values in a different way!!!
                }
                node.target.scale.x = node.target.scale.y = actualWidth / params.nodeWidth;
                zDynOffset = -params.visWidth / Math.tan(radFOV / 2);
                //      ...i don't want to be calculating all these values all of the time, because they're always the same, it's as if i need a global calculation bit, and then have parents store the calcs for their children
                x = prevXDist + 0.5 * actualWidth + xoffset;
                node.actualWidth = actualWidth

                if (tempdepth < 1) {
                    node.target.position.x = -10000
                    node.target.position.y = 0
                } else if (tempdepth == 1) {
                    node.target.position.x = x
                    miniHeight = params.nodeHeight * (actualWidth / params.nodeWidth);
                    node.target.position.y = -node.d3parent.d3children.indexOf(node) * (miniHeight + params.depth1pxYGap)
                    node.backupyinterval = -1 * (miniHeight + params.depth1pxYGap) //definitely needs moving outta here!!!
                    node.target.position.z = zDynOffset + 0.001 * node.d3parent.d3children.indexOf(node)
                    node.zDepthSubRange = params.zDepthRange
                    node.target.visible = true

                } else if (tempdepth > 1 && (tempdepth * 2 + 1) < params.xdist.length) {
                    node.target.visible = true
                    node.target.position.x = x
                    depth2YHeightMultiplier = 1
                    maxTotalDepth2Height = node.d3parent.target.scale.y * params.nodeHeight // * (actualWidth / params.nodeWidth);//*depth2YHeightMultiplier;       //isn't as big as it perhaps ought to be! (...needs investigating) 
                    miniHeight = params.nodeHeight * (actualWidth / params.nodeWidth);
                    if (!node.d3parent.childLayoutCalculated) {
                        function calcFlatYHeight() { //depth2
                            //could plus the margins, mayhaps
                            return node.d3parent.d3children.length * miniHeight //params.nodeHeight;
                        }

                        if (calcFlatYHeight() > maxTotalDepth2Height)
                            node.d3parent.childrenAreStacked = true;
                        else
                            node.d3parent.childrenAreStacked = false;
                        node.d3parent.childLayoutCalculated = true;
                    }
                    offsetYToDepth1 = (node.d3parent.target.position.y - yoffset) - maxTotalDepth2Height / 2
                    //need to use increment indexOf number rather than do actual indexOf lookups
                    function calcStackedYZ() {
                        retYZ = {
                            "y": null,
                            "z": null,
                            "zrange": null
                        }
                        //to find the OPPOSITE // Math.tan(Math.PI/2 - prevAngle)*z

                        leftOverYDiv = (maxTotalDepth2Height - miniHeight) / (node.d3parent.d3children.length + 1)
                        retYZ.y = offsetYToDepth1 + leftOverYDiv * ((node.d3parent.d3children.length - (node.d3parent.d3children.indexOf(node)))) + miniHeight / 2 //- maxTotalDepth2Height/2//+ miniHeight/2
                        node.d3parent.crappyYHackNeedToMoveThisLogicToTheParentleftOverYDiv = leftOverYDiv
                        node.d3parent.crappyYHackNeedToMoveThisLogicToTheParentminiHeight = miniHeight / 2
                        retYZ.z = (node.d3parent.target.position.z - zDynOffset - zoffset) - (node.d3parent.zDepthSubRange / params.zDepthFactor) * (node.d3parent.d3children.length - node.d3parent.d3children.indexOf(node)) / node.d3parent.d3children.length + zDynOffset
                        retYZ.zrange = node.d3parent.zDepthSubRange / (1 - params.zDepthFactor)
                        return retYZ;
                    }

                    function calcFlatYZ() {
                        retYZ = {
                            "y": null,
                            "z": null,
                            "zrange": null
                        }

                        leftOverYGapDiv = (maxTotalDepth2Height - miniHeight * (node.d3parent.d3children.length)) / (node.d3parent.d3children.length + 1)
                        retYZ.y = offsetYToDepth1 + (miniHeight + leftOverYGapDiv) * ((node.d3parent.d3children.length - node.d3parent.d3children.indexOf(node))) - miniHeight / 2
                        retYZ.z = (node.d3parent.target.position.z - zDynOffset - zoffset) - node.d3parent.zDepthSubRange / params.zDepthFactor + zDynOffset
                        retYZ.zrange = node.d3parent.zDepthSubRange / (1 - params.zDepthFactor)
                        return retYZ;
                    }
                    yz = node.d3parent.childrenAreStacked ? calcStackedYZ() : calcFlatYZ();
                    node.target.position.y = yz.y //+ node.d3parent.d3children.indexOf(node)*50;
                    node.target.position.z = yz.z;
                    node.zDepthSubRange = yz.zrange;
                    // need function to see if the flat layout (based on number of children) is less than params.depth1pxHeight*params.depth2YHeightMultiplier
                    //if so, then compute flat layout with depth1pxYGap at top and bottom and even distribution in between
                    //if not, then generate the stacking with *minimal* increments in z

                } else //beyond max local depth
                {

                    node.activeLocal = false;
                    node.target.position.x = node.d3parent.target.position.x //0//10000
                    node.target.position.y = node.d3parent.target.position.y
                    node.target.position.z = node.d3parent.target.position.z - zoffset + 1000

                    //TODO - no idea how this really works still
                }

                node.target.position.y += yoffset
                node.target.position.z += zoffset + 0.001 * (Math.random() + 1)
            } //end of if(~ this a local node ~)
            else {}

            if (d3children && (n = d3children.length)) {
                var i = -1,
                    n, c, d;
                dx = node.value ? node.dx / node.value : 0; //fixed
                while (++i < n) {
                    position(c = d3children[i], x, d = (node.dx / n) /*d = c.value * dx*/ , dy / 2, node.y); //changed
                    x += d;
                }
            }
        }

        function depth(node) {
            var d3children = node.d3children,
                d = 0;
            if (d3children && (n = d3children.length)) {
                var i = -1,
                    n;
                while (++i < n) d = Math.max(d, depth(d3children[i]));
            }
            return 1 + d;
        }

        function treeNav(d, i) {
            theLocalRoot = null;
            var nodes = hierarchy.call(this, d, i);
            position(nodes[0], 0, size[0], size[1] / 2, 0); //added init parameter for y, and changed init start size, could use an user-configurable parameter that runs through
            return nodes;
        }
        var hierarchy = d3.layout.hierarchy2(),
            size = [1, 1];
        treeNav.size = function(x) {
            if (!arguments.length) return size;
            size = x;
            return treeNav;
        };
        treeNav.params = function(x) {
            if (!arguments.length) return params;
            params = x;
            return treeNav;
        };
        return d3_layout_hierarchyRebind(treeNav, hierarchy);
    };




    function d3_layout_hierarchyRebind(object, hierarchy) {
        d3.rebind(object, hierarchy, "sort", "d3children", "value");
        object.links = d3_layout_hierarchyLinks;
        object.nodes = function(d) {
            d3_layout_hierarchyInline = true;
            return (object.nodes = object)(d);
        };
        return object;
    }

    function d3_layout_hierarchyLinks(nodes) {
        return d3.merge(nodes.map(function(parent) {
            return (parent.d3children || []).map(function(child) {
                return {
                    source: parent,
                    target: child
                };
            });
        }));
    }

    d3_layout_hierarchy2 = function() {
        function recurse(data, depth, nodes) {
            //i wonder what .call options mean....?!
            var childs = d3children.call(hierarchy, data, depth),
                node = d3_layout_hierarchyInline ? data : {
                    data: data
                };
            node.depth = depth;
            nodes.push(node);
            node.d3children = [];
            if (childs && (n = childs.length)) {
                var i = -1,
                    n, c = node.d3children = [],
                    v = 0,
                    j = depth + 1,
                    d;
                while (++i < n) {
                    d = recurse(childs[i], j, nodes);
                    d.d3parent = node; //d3parent avoids namespace conflict
                    c.push(d);
                    v += d.value;
                }
                if (sort) c.sort(sort);
                if (value) node.value = v;
            } else if (value) {
                node.value = +value.call(hierarchy, data, depth) || 0;
            }
            return node;
        }

        function revalue(node, depth) {
            var d3children = node.d3children,
                v = 0;
            if (d3children && (n = d3children.length)) {
                var i = -1,
                    n, j = depth + 1;
                while (++i < n) v += revalue(d3children[i], j);
            } else if (value) {
                v = +value.call(hierarchy, d3_layout_hierarchyInline ? node : node.data, depth) || 0;
            }
            if (value) node.value = v;
            return v;
        }

        function hierarchy(d) {
            var nodes = [];
            recurse(d, 0, nodes);
            return nodes;
        }
        var sort = d3_layout_hierarchySort,
            d3children = d3_layout_hierarchyd3children,
            value = d3_layout_hierarchyValue;

        //i'm really unsure of how these factor in...
        hierarchy.sort = function(x) {
            if (!arguments.length) return sort;
            sort = x;
            return hierarchy;
        };
        hierarchy.d3children = function(x) {
            if (!arguments.length) return d3children;
            d3children = x;
            return hierarchy;
        };
        hierarchy.value = function(x) {
            if (!arguments.length) return value;
            value = x;
            return hierarchy;
        };
        hierarchy.revalue = function(root) {
            revalue(root, 0);
            return root;
        };
        return hierarchy;
    };


    function inPresentPath(leafNode, checkNode) {
        function recurCheck(node) {
            if (node.d3parent === node) //root
                return false
            if (node === checkNode)
                return true
            return recurCheck(node.d3parent)
        }
        return recurCheck(leafNode);
    }

    function d3_layout_hierarchyd3children(d) {

        //should do something here with d.d3parent.depth to tame recursion (visually, at least) - perhaps a second method for propagating updates?


        //if nodeView (do that), if d3children.length == 0, if d3children.link, if d3children.tags
        //make sure whatever it is isn't already a .d3child (or there will be loops)

        if (d.graftGhost != null)
            return [];

        if (d.ghostType !== undefined && d.children == false) //not sure which is best way of working out if it's a Ghost... perhaps I should use OO
        {
            if (d.skipGhost && !inPresentPath(d, d.node))
                d = d.node;
            else
                return [];
        }

        switch (d.nodeView) {
            case 1: //tags
                return d.tags;
                break;

            case 2: //tagged
                return d.tagged;
                break;

            case 3: //link
                return [d.link];
                break;

            default: //case 0 = children//these are in order - not certain whether this order is the best, mind
                if (d.children.length > 0)
                    return d.children;
                else if (d.tags && d.tags.length > 0)
                    return d.tags;
                else if (d.tagged && d.tagged.length > 0)
                    return d.tagged;
                else if (d.link)
                    return [d.link];
                else
                    return d.children;
                break;
        }

        return [];
    }

    function d3_layout_hierarchyValue(d) {
        return d.value;
    }

    function d3_layout_hierarchySort(a, b) {
        return b.value - a.value;
    }

    function d3_layout_hierarchyLinks(nodes) {
        return d3.merge(nodes.map(function(parent) {
            return (parent.d3children || []).map(function(child) {
                return {
                    source: parent,
                    target: child
                };
            });
        }));
    }
    var d3_layout_hierarchyInline = false;

})();



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

    d3.layout.treeNav = d3_layout_treeNav;
    d3.layout.hierarchy2 = d3_layout_hierarchy2;
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
    treeNav = d3.layout.treeNav()
        .value(function(d) {
            return 1
        })
        .sort(function(d) {
            return d
        }) //can lose the function(d) i think :)
    .params(treeNavParams);
    kernel.root.d3parent = kernel.root.parent;
    thedata = treeNav.nodes(kernel.root)

    thisIsNotForDOM = document.createElement('div');
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
