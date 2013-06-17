var pith = require('./index.js')
var h = require('hyperscript')
var o = require('observable') //or subsume into pith.o
var THREE = require('css3drenderer')
var d3 = require('d3')
var TWEEN = require('tween')
var DAGDoc = pith.DAGDoc
var key = require('keymaster')
//:%!xclip -sel clip
//u

var A = new DAGDoc()

var helpers = A.addJSONAtom({

})

var entry = A.addJSONAtom({
    func: function(inputs, window, dd) {
        console.log(window)
    }
})

var inputs = {}

entry.func(inputs, window, A)
//  //no scrolling!   //It's much nicer to just resize the textarea to fit
//  // beefy zui.js --live --open --debug=false -- --fast --noparse=three.min.js

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
                // node.target.position.y = node.target.position.y + (node.target.position.y - params.cameraY)*6;


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
                /*angleA = params.xdist[tempdepth*2+1]/params.visWidth * radFOV;
                                                                                      gapAngleA = params.xdist[tempdepth*2]/params.visWidth * radFOV;*/


                xoffset = 0 //-params.visWidth/2
                //console.log(xoffset)

                //yoffset needs to be calculated OUTSIDE OF THIS RECURSION.. ie. down the bottom ;D
                yoffset = 0
                if (node.object) //subsequent to initial traverse
                {
                    //if(!params.backingUp/* && params.ghostObj == null*/)
                    /*{
                                                                                                                                            if(params.newSelObj == params.localRoot.children[0])
                                                                                                                                                                yoffset = theLocalRoot.object.position.y//this is the current / stale position, the new target isn't calculated yet
                                                                                                                                                                                else //using .last
                                                                                                                                                                                                {
                                                                                                                                                                                                                    childpos = params.localRoot.children.indexOf(params.newSelObj)
                                                                                                                                                                                                                                        console.log(childpos)
                                                                                                                                                                                                                                                            if(childpos > 0)
                                                                                                                                                                                                                                                                                    yoffset = theLocalRoot.object.position.y// + theLocalRoot.crappyYHackNeedToMoveThisLogicToTheParentleftOverYDiv*childpos + node.d3parent.crappyYHackNeedToMoveThisLogicToTheParentminiHeight
                                                                                                                                                                                                                                                                                                        else //it's not a direct nav using .last ...probably a random click on somewhere nested deep
                                                                                                                                                                                                                                                                                                                                yoffset = theLocalRoot.object.position.y
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                        else if(params.backingUp)//to compensate for going backwards
                                                                                                                                                                                                                                                                                                                                                                                    {*/
                    c = params.oldCamObj
                    s = params.newSelObj
                    sd3p = s.d3parent
                    cd3p = c.d3parent
                    schildn = sd3p.d3children.indexOf(s)

                    if (c.d3parent.d3children.length > 1) {
                        //dear GOD this took a while!
                        //yoffset = (c.object.position.y-cd3p.children[0].object.position.y) - ((cd3p.children[1].object.position.y-cd3p.children[0].object.position.y)*schildn)// - params.oldLocalRoot.position.y// theLocalRoot.object.position.y
                        yoffset = (c.object.position.y /*-cd3p.children[0].object.position.y*/ ) - ((cd3p.d3children[1].object.position.y - cd3p.d3children[0].object.position.y) * schildn) // - params.oldLocalRoot.position.y// theLocalRoot.object.position.y                    
                        //console.log((c.object.position.y-cd3p.children[0].object.position.y) + " " + ((cd3p.children[1].object.position.y-cd3p.children[0].object.position.y)*schildn))
                    } else if (c.d3parent.d3children.length == 1) {
                        yoffset = c.object.position.y - c.backupyinterval * schildn
                        //console.log(params.oldCamObj.object.position.y + " " + params.oldCamObj.object.position.y)
                    } else
                        yoffset = theLocalRoot.object.position.y
                        // else stay 0 !                    
                        //}
                        /*else if(params.ghostObj != null)
                                                                                                                                                                                                {
                                                                                                                                                                                                                //console.log(params.ghostObj.object.position.y )
                                                                                                                                                                                                                                
                                                                                                                                                                                                                                yoffset = params.ghostObj.object.position.y             
                                                                                                                                                                                                                                            }  */


                    //else
                    //    console.log("this should NEVER be happening")          
                }
                prevXDist = 0;
                for (i = 0; i < tempdepth * 2 + 1; i++) {
                    prevXDist += params.xdist[i];
                }
                actualWidth = params.xdist[tempdepth * 2 + 1] // * params.visWidth;

                if (tempdepth * 2 + 1 > params.xdist.length) {
                    prevXDist *= 1.5 //arbitrary
                    //xoffset = 10000000
                    actualWidth = 0.0001 //this ultimately needs to be in ADDITION to toggling visibility
                    //zoffset = 100000000
                    //need to handle these values in a different way!!!
                }
                //console.log(prevXDist)


                /*prevAngle = prevXDist / params.visWidth * radFOV + (Math.PI-radFOV)/2
                                                                                                                                        
                                                                                                                                        if(tempdepth) //>0
                                                                                                                                                    hyp = params.nodeWidth / Math.sin(angleA) * Math.sin(prevAngle + gapAngleA)
                                                                                                                                                              else //0
                                                                                                                                                                          hyp = params.nodeWidth*0.3 / Math.sin(angleA) * Math.sin(prevAngle + gapAngleA)//0.3 is arbitrary

                                                                                                                                                                                    z = -Math.cos((prevAngle + gapAngleA + angleA)-Math.PI/2) * hyp;
                                                                                                                                                                                              x = Math.sin((prevAngle + gapAngleA + angleA)-Math.PI/2) * hyp - params.nodeWidth/2;*/

                //actualWidth = params.xdist[tempdepth*2+1]// * params.visWidth;
                node.target.scale.x = node.target.scale.y = actualWidth / params.nodeWidth;
                zDynOffset = -params.visWidth / Math.tan(radFOV / 2);
                //      ...i don't want to be calculating all these values all of the time, because they're always the same, it's as if i need a global calculation bit, and then have parents store the calcs for their children
                //z = tempdepth * 5 + zDynOffset;
                x = prevXDist + 0.5 * actualWidth + xoffset;

                node.actualWidth = actualWidth


                //depth1pxHeight = 1000/1.618//params.xdist[3] / 1.618       //* 2;//hack


                if (tempdepth < 1) {
                    node.target.position.x = -10000
                    node.target.position.y = 0
                    //node.target.position.z = 0
                } else if (tempdepth == 1) {
                    node.target.position.x = x
                    //node.target.position.y = (-0.5*(node.parent.d3children.length-1) + node.parent.d3children.indexOf(node))*1000//need to increment number through recursion            
                    //node.target.position.y = -node.d3parent.d3children.indexOf(node)*(params.nodeHeight+params.depth1pxYGap)
                    miniHeight = params.nodeHeight * (actualWidth / params.nodeWidth);
                    node.target.position.y = -node.d3parent.d3children.indexOf(node) * (miniHeight + params.depth1pxYGap)
                    node.backupyinterval = -1 * (miniHeight + params.depth1pxYGap) //definitely needs moving outta here!!!
                    node.target.position.z = zDynOffset + 0.001 * node.d3parent.d3children.indexOf(node)
                    node.zDepthSubRange = params.zDepthRange
                    node.target.visible = true

                } else if (tempdepth > 1 && (tempdepth * 2 + 1) < params.xdist.length) {
                    node.target.visible = true
                    node.target.position.x = x
                    //depth2YHeightMultiplier = z / (node.d3parent.target.position.z-zoffset);
                    depth2YHeightMultiplier = 1
                    maxTotalDepth2Height = node.d3parent.target.scale.y * params.nodeHeight // * (actualWidth / params.nodeWidth);//*depth2YHeightMultiplier;       //isn't as big as it perhaps ought to be! (...needs investigating) 
                    miniHeight = params.nodeHeight * (actualWidth / params.nodeWidth);
                    if (!node.d3parent.childLayoutCalculated) {

                        function calcFlatYHeight() { //depth2
                            //params.xdist[5] / 1.618 

                            //could plus the margins, mayhaps
                            return node.d3parent.d3children.length * miniHeight //params.nodeHeight;
                        };


                        if (calcFlatYHeight() > maxTotalDepth2Height)
                            node.d3parent.childrenAreStacked = true;
                        else
                            node.d3parent.childrenAreStacked = false;
                        //console.log(calcFlatYHeight() + " " + maxTotalDepth2Height)
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

                        //offsetYToDepth1 = node.d3parent.target.position.y*depth2YHeightMultiplier - maxTotalDepth2Height/2//params.nodeHeight*(node.d3parent.d3children.length)/2
                        //leftOverYDiv = (maxTotalDepth2Height - params.nodeHeight)/(node.d3parent.d3children.length)
                        leftOverYDiv = (maxTotalDepth2Height - miniHeight) / (node.d3parent.d3children.length + 1)
                        retYZ.y = offsetYToDepth1 + leftOverYDiv * ((node.d3parent.d3children.length - (node.d3parent.d3children.indexOf(node)))) + miniHeight / 2 //- maxTotalDepth2Height/2//+ miniHeight/2
                        node.d3parent.crappyYHackNeedToMoveThisLogicToTheParentleftOverYDiv = leftOverYDiv
                        node.d3parent.crappyYHackNeedToMoveThisLogicToTheParentminiHeight = miniHeight / 2
                        //console.log(offsetYToDepth1 + " " + leftOverYDiv + " " + maxTotalDepth2Height)
                        //retYZ.z = z - (node.d3parent.d3children.length - node.d3parent.d3children.indexOf(node))*5//-5000 //need to wedge depth into allocated divisions by parent z depth range
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

                        //offsetYToDepth1 = node.d3parent.target.position.y*depth2YHeightMultiplier - maxTotalDepth2Height/2//1.4  //HACK! should be /2 //- params.nodeHeight*(node.d3parent.d3children.length)/2      
                        leftOverYGapDiv = (maxTotalDepth2Height - miniHeight * (node.d3parent.d3children.length)) / (node.d3parent.d3children.length + 1)
                        //console.log(offsetYToDepth1 + " " + leftOverYGapDiv + " " + maxTotalDepth2Height)
                        retYZ.y = offsetYToDepth1 + (miniHeight + leftOverYGapDiv) * ((node.d3parent.d3children.length - node.d3parent.d3children.indexOf(node))) - miniHeight / 2
                        //retYZ.z = z - node.d3parent.d3children.indexOf(node)*5
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

                //node.target.position.x += xoffset

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

//var opts = $.extend({}, defaults, opts); a neat way of processing function options // have a "default" object within the function 
//all functions have an arguments array, can only use length though    
/*define('js/app',[
        'jquery',
            'underscore',
                'handlebars',
                    'couchr',
                        'garden-app-support',
                            'hbt!templates/test',
                                'hbt!templates/all_doc',
                                    'js/acorn',
                                        'd3',
                                            'keymaster'
                                            ],
                                            function($, _, handlebars, couchr, garden, greeting_t, list_t, acorn, d3, keymaster){*/
var exports = {};

/**
 * This is where you will put things you can do before the dom is loaded.
 */
exports.init = function() {}

/**
 * This that occur after the dom has loaded.
 */
exports.on_dom_ready = function(cb) {
    /*acorn.init({
                                                                                  "author":"jeremy",
                                                                                              "activervsID":"ReMapOne"
                                                                                                      });*/
    kernel = acorn.use('master');
    kernel.loadTree("max", false, function(err, response) {
        init()
        animate()
        return //window.init()
    });
    /*garden.get_garden_ctx(function(err, garden_ctx){
                                                                                                  $('.main').append(greeting_t(garden_ctx));
                                                                                                          });

                                                                                                                  couchr.get('_db/_all_docs', function (err, resp) {
                                                                                                                              $('.main').append(list_t(resp));
                                                                                                                                      });*/

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

    scene = new THREE.Scene();
    globalDuration = 200 //or 0 for massively responsive design ;)

    //can add canvas rendered behind!!! view-source:http://mrdoob.github.com/three.js/examples/css3d_sandbox.html
    /*geometry = new THREE.CubeGeometry( 2000, 2000, 2000 );
                                                                                                                                                                                                                                                                                                                                material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe: true, wireframeLinewidth: 100 } );

                                                                                                                                                                                                                                                                                                                                        mesh = new THREE.Mesh( geometry, material );
                                                                                                                                                                                                                                                                                                                                                scene.add( mesh );*/


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
    //d3.select(thisIsNotForDOM).attr("id","thisIsNotForDOM").attr("style","display:none;");
    //document.getElementsByTagName('body')[0].appendChild(thisIsNotForDOM);


    //need this code to evaluate every transform2
    //d3.select(thisIsNotForDOM).selectAll("div").each(function(d,i){return; var togglevisibilityhere;})

    //need this code to evaluate every yslide
    //d3.select(thisIsNotForDOM).selectAll("div").each(function(d,i){return; var ifvisibleandforeachdepth,slide accordingly to context;})


    function IORedraw() {
        //need this code in an IO redraw function
        asdf = d3.select(thisIsNotForDOM).selectAll("div").data(thedata = treeNav.nodes(kernel.root) /*thedata*/ , function(d) {
            return d.id
        })
        asdf.enter()
            .append("div")
            .attr("id", function(d) {
                return "gid" + d.id;
            })
            .attr("class", function(d, i) {
                return "element" + (d.isGhost ? " ghost" + d.ghostType : "")
            })
            .attr("style", function(d, i) {
                thedata[i].element = this; //this stuff shouldn't really be *here* but oh well
                var object = new THREE.CSS3DObject(this);
                //object.__dirtyPosition = true;
                object.position.x = Math.random() * 4000 - 2000;
                object.position.y = Math.random() * 4000 - 2000;
                object.position.z = Math.random() * 4000 - 2000;
                object.owningNode = thedata[i];

                //or object.scale.set(1,1,1)
                object.scale.x = 1
                object.scale.y = 1
                object.scale.z = 1
                thedata[i].object = object;
                scene.add(object);

                objects.push(object);

                console.log("new entry")
                ////height = d.dx * ky * 0.95;
                //width = kx/10//d.dy * kx;
                //return 'width:'+ width  +'px;'+//tempwidth=... return tempwidth > 0 ? tempwidth : 0;// 'background-color:rgba(0,127,127,' + /*( Math.random() * 0.5 + 0.25 )  '0.25' + ');' +
                //    'height:'+ width / 1.618 +'px;'+
                return 'overflow:hidden;text-align:left;position:absolute;'; //absolute?!?! christ that's silly
            })
            .on("click", function(d) {
                click(d);
                //reflow(d)//.d3parent);    
            })
            .call(generateNodeHTML)
        asdf.transition().call(function(d, i) {
            console.log(d);
        });
        asdf.exit().call(function(d, i) {
            return;
        }).remove();
    }
    IORedraw();


    function generateNodeHTML(selection) {

        selection
            .append("div")
            .attr("class", "symbol")
            .html(function(d, i) {
                return thedata[i].doc.title;
            })
        return
        selection
            .append("div")
            .attr("class", "details")
            .html(function(d, i) {
                return thedata[i].id;
            });

        //put in a template to add controls on the nodes//not controls, just info!!!
        //info bar along the bottom

    }


    // helix

    /*var vector = new THREE.Vector3();

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    for ( var i = 0, l = objects.length; i < l; i ++ ) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              var object = objects[ i ];

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        var phi = i * 0.175 + Math.PI;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  var object = new THREE.Object3D();

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            object.position.x = 1100 * Math.sin( phi );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      object.position.y = - ( i * 8 ) + 450;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                object.position.z = 1100 * Math.cos( phi );

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          vector.copy( object.position );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    vector.x *= 2;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              vector.z *= 2;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        object.lookAt( vector );

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  targets.helix.push( object );

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  // grid

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          for ( var i = 0; i < objects.length; i ++ ) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    var object = objects[ i ];

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              var object = new THREE.Object3D();

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        object.position.x = ( ( i % 5 ) * 400 ) - 800;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      targets.grid.push( object );

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              }*/


    //

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(winnerWidth(), winnerHeight());
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = 1;
    //document.getElementById('container').appendChild(renderer.domElement);
    document.body.appendChild(h('div#container'));
    document.getElementById('container').appendChild(renderer.domElement);

    //

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.addEventListener('change', render);


    var button = document.getElementById('helix');
    button.addEventListener('click', function(event) {

        //transform( targets.helix, 2000 );

    }, false);

    var button = document.getElementById('grid');
    button.addEventListener('click', function(event) {

        //transform( targets.grid, 2000 );

    }, false);

    navmodeon = true

    function keyboardInit() {
        key('d, right', function() {
            if (navmodeon) {
                if (selObj.d3children && selObj.d3children.length > 0) {
                    //$('#sidebar').css("display", "none");
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

            /*kernel.addNode(selObj,{"title":"forever and always"},0,function(retObj){
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          thedata = treeNav.nodes(kernel.root)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      IORedraw();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          //click(retObj);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          })  */
        });

    }
    keyboardInit();
    //transform( targets.helix, 500 );

    transform2(0);
    //

    window.addEventListener('resize', onWindowResize, false);
    render();
}

function click(d, backingUp, ghostObj) { //neither backingUp or ghostObj are being used :D

    //this is an efficiency to consider....
    /*if(selObj.d3parent == d.d3parent && !(somekindofloadghostorsomethingstaticjusttookplace))
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              selObj = d;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            console.log("asdfasdf")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                else
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          {*/
    //if(d.d3parent == selObj.d3parent || d.d3parent == selObj)
    //    tweeningCamera = true;

    selObj.d3parent.last = selObj;
    selObj = d;
    /*if(ghostObj)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              reflow(ghostObj.d3parent, false, ghostObj);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            else if(backingUp)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    reflow(selObj.d3parent, backingUp); 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        else*/
    reflow(selObj.d3parent); //d3ext uses newSelObj (which could equally be passed as a parameter here, to work out the heading right offset (relevant for .last) - not anymore!
    //}
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
    /*node = ghost.node;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            if(ghost.ghostType === undefined)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                return callback(-1) // error - though i don't think this code works
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                t = ghost.ghostType;//(ghost == ghost.node.graftGhost) ? 0 : ghost.ghostType;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                t2 = (ghost.ghostParent == node.parent) ? 0 : t;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                t3 = (node.graftParent == node.parent) ? 0 : t;        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                if(t < 3)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ghostindex = ghost.ghostParent[t2==0?'children':(t2==1?'tags':'tagged')].indexOf(ghost);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        realparent = node.graftParent ? node.graftParent : node.parent;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            realindex = realparent[t3==0?'children':(t3==1?'tags':'tagged')].indexOf(node);    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ghost = ghost.ghostParent[t2==0?'children':(t2==1?'tags':'tagged')].splice(ghostindex,1)[0];
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    console.log(ghost)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        node = realparent[t3==0?'children':(t3==1?'tags':'tagged')].splice(realindex,1)[0];
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            console.log(node)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                node.graftGhost = ghost;            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    node.graftParent = ghost.ghostParent;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ghost.ghostParent[t2==0?'children':(t2==1?'tags':'tagged')].splice(ghostindex,0,node)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ghost.ghostParent = realparent;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                realparent[t3==0?'children':(t3==1?'tags':'tagged')].splice(realindex,0,ghost);        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                else if(t == 3)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                return callback(ghost.node);*/
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
            /*if(objects[ i ].owningNode.element.style.display == "none")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              someDuration = 0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      displayToggle = "none";*/

            if (objects[i].owningNode.element.style.visibility == "hidden")
                someDuration = 0
            displayToggle = "hidden" //"none";

            /*if( objects[ i ].visible == false)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      someDuration = 0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              displayToggle = false*/
        }



        var object = objects[i];

        //objects[ i ].owningNode.element.style.display = displayToggle;


        //var target = targets[ i ];
        var target = object.owningNode.target;
        //var someDuration = Math.random() * duration + duration;

        //                    object.visible = target.visible;// (would ideally like to run this after the onComplete below, needs binding or something though
        //object.visible is NOT implemented in CSS3DRenderer... or something

        //object.position = target.position  


        //if(!target.visible)
        //  object.parent.__removeObject(object)
        //if object.visible || target.visible




        /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          node = object.owningNode
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        function theSamePosition (pos1, pos2)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    if((pos1.x == pos2.x) && (pos1.y == pos2.y) && (pos1.z == pos2.z))
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                return true;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        return false;                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                //move object.positions to old target values to compensate for unfinished transitions!!
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    if(!theSamePosition(node.object.position,node.target.position)) //or inTransition??
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        {   
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                node.object.position = node.target.position.clone();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        //node.object.position.x = node.target.position.x
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                //node.object.position.y = node.target.position.y
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        //node.object.position.z = node.target.position.z      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                node.object.scale = node.target.scale.clone();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        node.object.rotation = node.target.rotation.clone();                                                  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            }*/


        //if(!objects[ i ].owningNode.activeLocal)
        //     continue;
        if (displayToggle == "visible")
            object.owningNode.element.style.visibility = displayToggle;

        tweenfunc = TWEEN.Easing.Exponential.InOut
        object.owningNode.scaleobj = { //properties can't start with numbers!!!!
            transform: object.owningNode.element.style.transform,
            owningNode: object.owningNode
        }
        /*new TWEEN.Tween( false)//object.owningNode.scaleobj )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      .to( {}, someDuration )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  .onUpdate(function(scaleobj,blah){
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  //someDuration        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  console.log(blah)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  n = scaleobj.transform.split("(")[1].split(",")[0]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  scaleobj.owningNode.element.style.transform = "scale("+n+","+n+")"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                .start();*/

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
/*    function transform( targets, duration ) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    TWEEN.removeAll();

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            for ( var i = 0; i < objects.length; i ++ ) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      var object = objects[ i ];
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                var target = targets[ i ];

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          new TWEEN.Tween( object.position )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  .easing( TWEEN.Easing.Exponential.InOut )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              .start();

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        new TWEEN.Tween( object.rotation )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                .easing( TWEEN.Easing.Exponential.InOut )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            .start();

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            new TWEEN.Tween( this )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      .to( {}, duration * 2 )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                .onUpdate( render )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          .onComplete( function(){ selObj = kernel.root;render();} )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    .start();

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          }*/

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
            /*camera.position.x = selObj.object.position.x
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                camera.position.y = selObj.object.position.y
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            camera.position.z = 1200
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        camera.rotation.x -= camera.rotation.x;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    camera.rotation.y -= camera.rotation.y;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                camera.rotation.z -= camera.rotation.z;//*/


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
                //camera.rotation.x -= camera.rotation.x;
                //camera.rotation.y -= camera.rotation.y;
                //camera.rotation.z -= camera.rotation.z;
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



            /*if(tweeningCamera)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            anim.start();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    tweeningCamera = false;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }*/
            /*if(inTransition)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            onTransitionEnd = anim.start;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    else
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            anim.start();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                //*/


            //selObj = null;


            /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     There are a number of nice options with tween  Using the elastic easing is pretty crazy on a camera, haha

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         var position = new THREE.Vector3(0,0*CNspacing+350,600);
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     }


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */
        }
        ////camera.lookAt(currobject);

        //adjustYScales();
        //if(!inTransition)
        //    clipY();
        renderer.render(scene, camera);

    }




//return exports;
//});



/**

   * @author Eberhard Graether / http://egraether.com/

    */



THREE.TrackballControls = function ( object, domElement ) {



    var _this = this;

      var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM: 4, TOUCH_PAN: 5 };



        this.object = object;

          this.domElement = ( domElement !== undefined ) ? domElement : document;



            // API



            this.enabled = true;



              this.screen = { width: 0, height: 0, offsetLeft: 0, offsetTop: 0 };

                this.radius = ( this.screen.width + this.screen.height ) / 4;



                  this.rotateSpeed = 1.0;

                    this.zoomSpeed = 1.2;

                      this.panSpeed = 0.3;



                        this.noRotate = false;

                          this.noZoom = false;

                            this.noPan = false;



                              this.staticMoving = false;

                                this.dynamicDampingFactor = 0.2;



                                  this.minDistance = 0;

                                    this.maxDistance = Infinity;



                                      this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];



                                        // internals



                                        this.target = new THREE.Vector3();



                                          var lastPosition = new THREE.Vector3();



                                            var _state = STATE.NONE,

                                                  _prevState = STATE.NONE,



                                                    _eye = new THREE.Vector3(),



                                                      _rotateStart = new THREE.Vector3(),

                                                        _rotateEnd = new THREE.Vector3(),



                                                          _zoomStart = new THREE.Vector2(),

                                                            _zoomEnd = new THREE.Vector2(),



                                                              _touchZoomDistanceStart = 0,

                                                                _touchZoomDistanceEnd = 0,



                                                                  _panStart = new THREE.Vector2(),

                                                                    _panEnd = new THREE.Vector2();



                                              // for reset



                                              this.target0 = this.target.clone();

                                                this.position0 = this.object.position.clone();

                                                  this.up0 = this.object.up.clone();



                                                    // events



                                                    var changeEvent = { type: 'change' };





                                                      // methods



                                                      this.handleResize = function () {



                                                            this.screen.width = window.innerWidth;

                                                                this.screen.height = window.innerHeight;



                                                                    this.screen.offsetLeft = 0;

                                                                        this.screen.offsetTop = 0;



                                                                            this.radius = ( this.screen.width + this.screen.height ) / 4;



                                                                              };



                                                        this.handleEvent = function ( event ) {



                                                              if ( typeof this[ event.type ] == 'function' ) {



                                                                      this[ event.type ]( event );



                                                                          }



                                                                };



                                                          this.getMouseOnScreen = function ( clientX, clientY ) {



                                                                return new THREE.Vector2(

                                                                          ( clientX - _this.screen.offsetLeft ) / _this.radius * 0.5,

                                                                                ( clientY - _this.screen.offsetTop ) / _this.radius * 0.5

                                                                                    );



                                                                  };



                                                            this.getMouseProjectionOnBall = function ( clientX, clientY ) {



                                                                  var mouseOnBall = new THREE.Vector3(

                                                                            ( clientX - _this.screen.width * 0.5 - _this.screen.offsetLeft ) / _this.radius,

                                                                                  ( _this.screen.height * 0.5 + _this.screen.offsetTop - clientY ) / _this.radius,

                                                                                        0.0

                                                                                            );



                                                                      var length = mouseOnBall.length();



                                                                          if ( length > 1.0 ) {



                                                                                  mouseOnBall.normalize();



                                                                                      } else {



                                                                                              mouseOnBall.z = Math.sqrt( 1.0 - length * length );



                                                                                                  }



                                                                              _eye.copy( _this.object.position ).sub( _this.target );



                                                                                  var projection = _this.object.up.clone().setLength( mouseOnBall.y );

                                                                                      projection.add( _this.object.up.clone().cross( _eye ).setLength( mouseOnBall.x ) );

                                                                                          projection.add( _eye.setLength( mouseOnBall.z ) );



                                                                                              return projection;



                                                                                                };



                                                              this.rotateCamera = function () {



                                                                    var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );



                                                                        if ( angle ) {



                                                                                var axis = ( new THREE.Vector3() ).crossVectors( _rotateStart, _rotateEnd ).normalize(),

                                                                                            quaternion = new THREE.Quaternion();



                                                                                      angle *= _this.rotateSpeed;



                                                                                            quaternion.setFromAxisAngle( axis, -angle );



                                                                                                  _eye.applyQuaternion( quaternion );

                                                                                                        _this.object.up.applyQuaternion( quaternion );



                                                                                                              _rotateEnd.applyQuaternion( quaternion );



                                                                                                                    if ( _this.staticMoving ) {



                                                                                                                              _rotateStart.copy( _rotateEnd );



                                                                                                                                    } else {



                                                                                                                                              quaternion.setFromAxisAngle( axis, angle * ( _this.dynamicDampingFactor - 1.0 ) );

                                                                                                                                                      _rotateStart.applyQuaternion( quaternion );



                                                                                                                                                            }



                                                                                                                        }



                                                                          };



                                                                this.zoomCamera = function () {



                                                                      if ( _state === STATE.TOUCH_ZOOM ) {



                                                                              var factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;

                                                                                    _touchZoomDistanceStart = _touchZoomDistanceEnd;

                                                                                          _eye.multiplyScalar( factor );



                                                                                              } else {



                                                                                                      var factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;



                                                                                                            if ( factor !== 1.0 && factor > 0.0 ) {



                                                                                                                      _eye.multiplyScalar( factor );



                                                                                                                              if ( _this.staticMoving ) {



                                                                                                                                          _zoomStart.copy( _zoomEnd );



                                                                                                                                                  } else {



                                                                                                                                                              _zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;



                                                                                                                                                                      }



                                                                                                                                    }



                                                                                                                }



                                                                        };



                                                                  this.panCamera = function () {



                                                                        var mouseChange = _panEnd.clone().sub( _panStart );



                                                                            if ( mouseChange.lengthSq() ) {



                                                                                    mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );



                                                                                          var pan = _eye.clone().cross( _this.object.up ).setLength( mouseChange.x );

                                                                                                pan.add( _this.object.up.clone().setLength( mouseChange.y ) );



                                                                                                      _this.object.position.add( pan );

                                                                                                            _this.target.add( pan );



                                                                                                                  if ( _this.staticMoving ) {



                                                                                                                            _panStart = _panEnd;



                                                                                                                                  } else {



                                                                                                                                            _panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( _this.dynamicDampingFactor ) );



                                                                                                                                                  }



                                                                                                                      }



                                                                              };



                                                                    this.checkDistances = function () {



                                                                          if ( !_this.noZoom || !_this.noPan ) {



                                                                                  if ( _this.object.position.lengthSq() > _this.maxDistance * _this.maxDistance ) {



                                                                                            _this.object.position.setLength( _this.maxDistance );



                                                                                                  }



                                                                                        if ( _eye.lengthSq() < _this.minDistance * _this.minDistance ) {



                                                                                                  _this.object.position.addVectors( _this.target, _eye.setLength( _this.minDistance ) );



                                                                                                        }



                                                                                            }



                                                                            };



                                                                      this.update = function () {



                                                                            _eye.subVectors( _this.object.position, _this.target );



                                                                                if ( !_this.noRotate ) {



                                                                                        _this.rotateCamera();



                                                                                            }



                                                                                    if ( !_this.noZoom ) {



                                                                                            _this.zoomCamera();



                                                                                                }



                                                                                        if ( !_this.noPan ) {



                                                                                                _this.panCamera();



                                                                                                    }



                                                                                            _this.object.position.addVectors( _this.target, _eye );



                                                                                                _this.checkDistances();



                                                                                                    _this.object.lookAt( _this.target );



                                                                                                        if ( lastPosition.distanceToSquared( _this.object.position ) > 0 ) {



                                                                                                                _this.dispatchEvent( changeEvent );



                                                                                                                      lastPosition.copy( _this.object.position );



                                                                                                                          }



                                                                                                          };



                                                                        this.reset = function () {



                                                                              _state = STATE.NONE;

                                                                                  _prevState = STATE.NONE;



                                                                                      _this.target.copy( _this.target0 );

                                                                                          _this.object.position.copy( _this.position0 );

                                                                                              _this.object.up.copy( _this.up0 );



                                                                                                  _eye.subVectors( _this.object.position, _this.target );



                                                                                                      _this.object.lookAt( _this.target );



                                                                                                          _this.dispatchEvent( changeEvent );



                                                                                                              lastPosition.copy( _this.object.position );



                                                                                                                };



                                                                          // listeners



                                                                          function keydown( event ) {



                                                                                if ( _this.enabled === false ) return;



                                                                                    window.removeEventListener( 'keydown', keydown );



                                                                                        _prevState = _state;



                                                                                            if ( _state !== STATE.NONE ) {



                                                                                                    return;



                                                                                                        } else if ( event.keyCode === _this.keys[ STATE.ROTATE ] && !_this.noRotate ) {



                                                                                                                _state = STATE.ROTATE;



                                                                                                                    } else if ( event.keyCode === _this.keys[ STATE.ZOOM ] && !_this.noZoom ) {



                                                                                                                            _state = STATE.ZOOM;



                                                                                                                                } else if ( event.keyCode === _this.keys[ STATE.PAN ] && !_this.noPan ) {



                                                                                                                                        _state = STATE.PAN;



                                                                                                                                            }



                                                                                              }



                                                                            function keyup( event ) {



                                                                                  if ( _this.enabled === false ) return;



                                                                                      _state = _prevState;



                                                                                          window.addEventListener( 'keydown', keydown, false );



                                                                                            }



                                                                              function mousedown( event ) {



                                                                                    if ( _this.enabled === false ) return;



                                                                                        event.preventDefault();

                                                                                            event.stopPropagation();



                                                                                                if ( _state === STATE.NONE ) {



                                                                                                        _state = event.button;



                                                                                                            }



                                                                                                    if ( _state === STATE.ROTATE && !_this.noRotate ) {



                                                                                                            _rotateStart = _rotateEnd = _this.getMouseProjectionOnBall( event.clientX, event.clientY );



                                                                                                                } else if ( _state === STATE.ZOOM && !_this.noZoom ) {



                                                                                                                        _zoomStart = _zoomEnd = _this.getMouseOnScreen( event.clientX, event.clientY );



                                                                                                                            } else if ( _state === STATE.PAN && !_this.noPan ) {



                                                                                                                                    _panStart = _panEnd = _this.getMouseOnScreen( event.clientX, event.clientY );



                                                                                                                                        }



                                                                                                        document.addEventListener( 'mousemove', mousemove, false );

                                                                                                            document.addEventListener( 'mouseup', mouseup, false );



                                                                                                              }



                                                                                function mousemove( event ) {



                                                                                      if ( _this.enabled === false ) return;



                                                                                          event.preventDefault();

                                                                                              event.stopPropagation();



                                                                                                  if ( _state === STATE.ROTATE && !_this.noRotate ) {



                                                                                                          _rotateEnd = _this.getMouseProjectionOnBall( event.clientX, event.clientY );



                                                                                                              } else if ( _state === STATE.ZOOM && !_this.noZoom ) {



                                                                                                                      _zoomEnd = _this.getMouseOnScreen( event.clientX, event.clientY );



                                                                                                                          } else if ( _state === STATE.PAN && !_this.noPan ) {



                                                                                                                                  _panEnd = _this.getMouseOnScreen( event.clientX, event.clientY );



                                                                                                                                      }



                                                                                                    }



                                                                                  function mouseup( event ) {



                                                                                        if ( _this.enabled === false ) return;



                                                                                            event.preventDefault();

                                                                                                event.stopPropagation();



                                                                                                    _state = STATE.NONE;



                                                                                                        document.removeEventListener( 'mousemove', mousemove );

                                                                                                            document.removeEventListener( 'mouseup', mouseup );



                                                                                                              }



                                                                                    function mousewheel( event ) {



                                                                                          if ( _this.enabled === false ) return;



                                                                                              event.preventDefault();

                                                                                                  event.stopPropagation();



                                                                                                      var delta = 0;



                                                                                                          if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9



                                                                                                                  delta = event.wheelDelta / 40;



                                                                                                                      } else if ( event.detail ) { // Firefox



                                                                                                                              delta = - event.detail / 3;



                                                                                                                                  }



                                                                                                              _zoomStart.y += delta * 0.01;



                                                                                                                }



                                                                                      function touchstart( event ) {



                                                                                            if ( _this.enabled === false ) return;



                                                                                                switch ( event.touches.length ) {



                                                                                                        case 1:

                                                                                                                  _state = STATE.TOUCH_ROTATE;

                                                                                                                          _rotateStart = _rotateEnd = _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

                                                                                                                                  break;



                                                                                                                                        case 2:

                                                                                                                                          _state = STATE.TOUCH_ZOOM;

                                                                                                                                                  var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;

                                                                                                                                                          var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

                                                                                                                                                                  _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );

                                                                                                                                                                          break;



                                                                                                                                                                                case 3:

                                                                                                                                                                                  _state = STATE.TOUCH_PAN;

                                                                                                                                                                                          _panStart = _panEnd = _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

                                                                                                                                                                                                  break;



                                                                                                                                                                                                        default:

                                                                                                                                                                                                          _state = STATE.NONE;



                                                                                                                                                                                                              }



                                                                                                  }



                                                                                        function touchmove( event ) {



                                                                                              if ( _this.enabled === false ) return;



                                                                                                  event.preventDefault();

                                                                                                      event.stopPropagation();



                                                                                                          switch ( event.touches.length ) {



                                                                                                                  case 1:

                                                                                                                            _rotateEnd = _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

                                                                                                                                    break;



                                                                                                                                          case 2:

                                                                                                                                            var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;

                                                                                                                                                    var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

                                                                                                                                                            _touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy )

                                                                                                                                                                      break;



                                                                                                                                                                  case 3:

                                                                                                                                                                    _panEnd = _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

                                                                                                                                                                            break;



                                                                                                                                                                                  default:

                                                                                                                                                                                    _state = STATE.NONE;



                                                                                                                                                                                        }



                                                                                                            }



                                                                                          function touchend( event ) {



                                                                                                if ( _this.enabled === false ) return;



                                                                                                    switch ( event.touches.length ) {



                                                                                                            case 1:

                                                                                                                      _rotateStart = _rotateEnd = _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

                                                                                                                              break;



                                                                                                                                    case 2:

                                                                                                                                      _touchZoomDistanceStart = _touchZoomDistanceEnd = 0;

                                                                                                                                              break;



                                                                                                                                                    case 3:

                                                                                                                                                      _panStart = _panEnd = _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

                                                                                                                                                              break;



                                                                                                                                                                  }



                                                                                                        _state = STATE.NONE;



                                                                                                          }



                                                                                            this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );



                                                                                              this.domElement.addEventListener( 'mousedown', mousedown, false );



                                                                                                this.domElement.addEventListener( 'mousewheel', mousewheel, false );

                                                                                                  this.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox



                                                                                                    this.domElement.addEventListener( 'touchstart', touchstart, false );

                                                                                                      this.domElement.addEventListener( 'touchend', touchend, false );

                                                                                                        this.domElement.addEventListener( 'touchmove', touchmove, false );



                                                                                                          window.addEventListener( 'keydown', keydown, false );

                                                                                                            window.addEventListener( 'keyup', keyup, false );



                                                                                                              this.handleResize();



};



THREE.TrackballControls.prototype = Object.create( THREE.EventDispatcher.prototype );

var selObj
document.body.appendChild(h('button#helix'))
document.body.appendChild(h('button#grid'))
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
kernel.loadTemp("max", false, function(err, response) {
        init()
        animate()
        return //window.init()
});
//init()
