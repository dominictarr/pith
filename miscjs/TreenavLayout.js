//will need to accept [data,node,a,[%s]==1,z]


//(function() {

module.exports = function(){
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

    d3_layout_treeNav = function() {
        var theLocalRoot = null;

        function position(node, x, dx, dy, y) { //added parameter y
            var d3children = node.d3children;
//            targetPosition = new THREE.Vector3();
            zoffset = 10000; //actual offset    
//            targetPosition.set(-zoffset, 0, 0)
//            targetScale = new THREE.Vector3();
//            targetScale.set(1, 1, 1)
//            targetRotation = new THREE.Vector3();
//            targetRotation.set(0, 0, 0)
            node.localDepth = null;

            if (node.target) {
                targetPosition = node.target.position;
                node.target.position.x = -10000
                node.target.position.z = 10000
            }
/*            node.target = {
                "position": targetPosition,
                "rotation": targetRotation,
                "scale": targetScale,
                "visible": false
            };*/
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
        var hierarchy = d3_layout_hierarchy2(),
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
        d3_rebindfunc(object, hierarchy, "sort", "d3children", "value");
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

    return d3_layout_treeNav
}()//})();
