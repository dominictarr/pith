//i need a fullscreen page sliding thing, just like those presentation libraries, with text view and markdown text edit (and then RTE) - i'm appealing to developers first!!!
//with those really simple indicators along the sides
//and you can trivially upload attachments and reference them

//UI needs to indicate change, but not automatically reprocess!
//trigger check changes before using the kernel, and don't modify a changed node without reprocessing first

//var opts = $.extend({}, defaults, opts); a neat way of processing function options // have a "default" object within the function 
//all functions have an arguments array, can only use length though    
define('js/app',[
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
function($, _, handlebars, couchr, garden, greeting_t, list_t, acorn, d3, keymaster){
    var exports = {};

    /**
     * This is where you will put things you can do before the dom is loaded.
     */
    exports.init = function() {
    }

    /**
     * This that occur after the dom has loaded.
     */
    exports.on_dom_ready = function(cb){
        /*acorn.init({
            "author":"jeremy",
            "activervsID":"ReMapOne"
        });*/
        kernel = acorn.use('master');
        kernel.loadTree("max",false,function(err, response){
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
			var targets = { helix: [], grid: [], remap: [], remap0: [], remap1: [], remap2: [] };
			
//			var selObj = null;
			var currobject = null;
			var camObj = {"object":{"position":{"x":0,"y":0,"z":0}},"target":{"position":{"x":0,"y":0,"z":0}}}
			
			var asdf;
			
			var c1w;
			var columnWidths = [];
			
			var anim; //only the camera animation TWEEN
			
			var currroot;
			
		    var treeNav;
		    
		    var treeNavParams;
			
			var inTransition = false;
			var onTransitionEnd = function (){};
			
			var tweeningCamera = true;

            function winnerHeight(){
                return window.innerHeight;
            
            }
            function winnerWidth(){
                return window.innerWidth// - 50;
            
            }


			function init() {
				kx = 1000;
				ky = 1000;
				fov = 50;
				fovratio = winnerWidth() / winnerHeight();
				camera = new THREE.PerspectiveCamera( /*75*/fov, fovratio, 1, 50000 );	
				camera.position.z = 10000//2*kx;
				lookeyHere = new THREE.Vector3();
				lookeyHere.x = 0;
				lookeyHere.y = 0;
				lookeyHere.z = 10000//1000;
				camera.lookAt(lookeyHere);

				scene = new THREE.Scene();
				globalDuration = 200 //or 0 for massively responsive design ;)
				
				//can add canvas rendered behind!!! view-source:http://mrdoob.github.com/three.js/examples/css3d_sandbox.html
				/*geometry = new THREE.CubeGeometry( 2000, 2000, 2000 );
				material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe: true, wireframeLinewidth: 100 } );

				mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );*/
				
				
				currobject = kernel.root.children[0];//scene.position; //this needs thinking about
				selObj = kernel.root.children[0];

				currrroot = kernel.root;



                columnProportions = [   -0.06,//gap then angle
                                0.801,//0.000000001,//
                                0.101,
                                0.5,
                                0.1,
                                0.3,
                                0.05,
                                0.05,
                                0.05,
                                0.025,
                                0.04,
                                0.0125  /*  */                            
                                //gotta keep those numbers DECREASING!
                                
                                //need to build a function to handle this!!!!
                ]

                for(i = 0; i < columnProportions.length; i++)
                    columnWidths[i] = winnerWidth()*columnProportions[i];                    

                c1w = columnWidths[2];
               
                d3.layout.treeNav = d3_layout_treeNav;
                d3.layout.hierarchy2 = d3_layout_hierarchy2;
                treeNavParams = {
                    "nodeWidth":200,//kx,//kx = width ~ need to clean up !
                    "nodeHeight":123.6,//kx / 1.618,//kx = width ~ need to clean up !
                    "fov": fov*fovratio,//this is a hack, i think
                    "visWidth":winnerWidth(),
                    "localRoot":currrroot,//.children[1], //within d3ext i need to add a flag on currrroot, and recursively apply to establish "active" localdepth
                    "xdist":columnWidths,
                    "depth1pxYGap" : 120,//100,
                    "cameraY":0,
                    "backingUp":false,
                    "oldLocalRoot":null,
                    "zDepthRange": 1,
                    "zDepthFactor":0.3,
                    "ghostObj":null
                };
                //visibility cutoff, and fading ought to be derived from the scale values imo, and calculate in the app not the transform
                treeNav = d3.layout.treeNav()
                    .value(function(d) { return 1})
                    .sort(function(d) { return d})//can lose the function(d) i think :)
                    .params(treeNavParams);
				kernel.root.d3parent = kernel.root.parent;
				thedata = treeNav.nodes(kernel.root)

				thisIsNotForDOM = document.createElement( 'div' );
				//d3.select(thisIsNotForDOM).attr("id","thisIsNotForDOM").attr("style","display:none;");
				//document.getElementsByTagName('body')[0].appendChild(thisIsNotForDOM);
				
				
				//need this code to evaluate every transform2
				//d3.select(thisIsNotForDOM).selectAll("div").each(function(d,i){return; var togglevisibilityhere;})
				
				//need this code to evaluate every yslide
				//d3.select(thisIsNotForDOM).selectAll("div").each(function(d,i){return; var ifvisibleandforeachdepth,slide accordingly to context;})
				
				
				function IORedraw (){
				    //need this code in an IO redraw function
				    asdf = d3.select(thisIsNotForDOM).selectAll("div").data(thedata = treeNav.nodes(kernel.root)/*thedata*/, function (d) { return d.id })
	                asdf.enter()
                                .append("div")
                                    .attr("id", function(d) { return "gid" + d.id; })
                                    .attr("class", function(d,i) {
                                            return "element" + (d.isGhost? " ghost" + d.ghostType : "")
                                        })
                                    .attr("style", function(d,i) {
                                                        thedata[ i ].element = this; //this stuff shouldn't really be *here* but oh well
                                                        var object = new THREE.CSS3DObject( this );
                                                        //object.__dirtyPosition = true;
					                                    object.position.x = Math.random() * 4000 - 2000;
					                                    object.position.y = Math.random() * 4000 - 2000;
					                                    object.position.z = Math.random() * 4000 - 2000;
					                                    object.owningNode = thedata[ i ];
					                                    
					                                    //or object.scale.set(1,1,1)
					                                    object.scale.x = 1
					                                    object.scale.y = 1					                                
					                                    object.scale.z = 1					                                
					                                    thedata[ i ].object = object;
					                                    scene.add( object );

					                                    objects.push( object );
                                                                                                            
                                                        console.log("new entry")
                                                        ////height = d.dx * ky * 0.95;
                                                        //width = kx/10//d.dy * kx;
                                                        //return 'width:'+ width  +'px;'+//tempwidth=... return tempwidth > 0 ? tempwidth : 0;// 'background-color:rgba(0,127,127,' + /*( Math.random() * 0.5 + 0.25 )  '0.25' + ');' +
                                                        //    'height:'+ width / 1.618 +'px;'+
                                                        return    'overflow:hidden;text-align:left;position:absolute;'; //absolute?!?! christ that's silly
                                    })
                                    .on("click", function(d){ 
                                        click(d);
                                        //reflow(d)//.d3parent);    
                                    })
                                    .call(generateNodeHTML)
                    asdf.transition().call(function(d,i){console.log(d);});
                    asdf.exit().call(function(d,i){return;}).remove();
               }
               IORedraw();

                                                          
                function generateNodeHTML (selection){

                    selection
                        .append("div")
                            .attr("class", "symbol")
                            .html(function(d,i){ return thedata[ i ].doc.title;})
                    return
                    selection
                        .append("div")
                            .attr("class", "details")
                            .html(function(d,i){ return thedata[ i ].id;}); 
                            
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
				renderer.setSize( winnerWidth(), winnerHeight() );
				renderer.domElement.style.position = 'fixed';
				renderer.domElement.style.top = 1;
				document.getElementById( 'container' ).appendChild( renderer.domElement );

				//

				controls = new THREE.TrackballControls( camera, renderer.domElement );
				controls.rotateSpeed = 0.5;
				controls.addEventListener( 'change', render );


				var button = document.getElementById( 'helix' );
				button.addEventListener( 'click', function ( event ) {

					//transform( targets.helix, 2000 );

				}, false );

				var button = document.getElementById( 'grid' );
				button.addEventListener( 'click', function ( event ) {

					//transform( targets.grid, 2000 );

				}, false );

                navmodeon = true
                function keyboardInit(){
                    key('d, right', function(){
                        if(navmodeon) 
                        {
                            if(selObj.d3children && selObj.d3children.length > 0)
					        {
					            $('#sidebar').css("display", "none");
					            selObj.last && selObj.last!=selObj?click(selObj.last):click(selObj.d3children[0]);//selObj.vischildren ? acorninit(selObj.vischildren[0],false,kernel.subtrees[selObj.vischildren[0].db]) : null;                
					            //possibly need to think about whether .last has any implications when messin around with ghosts
					        }
                        }
                    });
                    key('w, up', function(){ 
                        navmodeon ? click(selObj.d3parent.d3children[((selObj.d3parent.d3children.indexOf(selObj)-1)+selObj.d3parent.d3children.length)%selObj.d3parent.d3children.length]) : null;             
                    });
                    key('s, down', function(){ 
			            navmodeon ? click(selObj.d3parent.d3children[((selObj.d3parent.d3children.indexOf(selObj)+1)+selObj.d3parent.d3children.length)%selObj.d3parent.d3children.length]) : null;
			        });
			        key('a, left', function(){
				        if(navmodeon && selObj.d3parent.d3parent != selObj.d3parent)
				        {
				            click(selObj.d3parent, true);				            			    
				        }
				    });
				    key('space', function(){
                        if(selObj.isGhost)
				            //kernel.loadGhost(selObj,function(realnode){
				            loadGhost(selObj,function(realnode){
				                //remember in future, only click should modify selObj!
				                //there should be another function, like transform2 but with 0 duration (a setter, in reality), that i can call directly here, that preloads new coordinates using another flag with d3ext so that transitions are smoother! then only render after the second transforming function
				                if(realnode != -1) //not error
				                    click(realnode);
				            })
				        else
				            resetNode(selObj,function(selObj){
				                if(selObj != -1) //not error
    				                click(selObj);
				            });
				        return;
				    
				        /*kernel.addNode(selObj,{"title":"forever and always"},0,function(retObj){
                            thedata = treeNav.nodes(kernel.root)
                            IORedraw();
				            //click(retObj);
				        })	*/	            			    
				    });
				    
                }
                keyboardInit();
				//transform( targets.helix, 500 );

                transform2(0);
				//

				window.addEventListener( 'resize', onWindowResize, false );
                render();
			}
			function click(d,backingUp,ghostObj){//neither backingUp or ghostObj are being used :D

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
                        reflow(selObj.d3parent);   //d3ext uses newSelObj (which could equally be passed as a parameter here, to work out the heading right offset (relevant for .last) - not anymore!
                //}
                render();
            }
			function reflow(d,backingUp, ghostObj){  		///so where I use Obj ... i probably mean node ;)
			    treeNavParams.oldCamObj = camObj//camObj is the snap position, not the current cameraY     //selObj//camObj//treeNavParams.localRoot
			    treeNavParams.newSelObj = selObj	       
                treeNavParams.localRoot = d//.d3parent;
                treeNavParams.cameraY = camera.position.y;
                treeNavParams.backingUp = backingUp;
                treeNavParams.ghostObj = ghostObj ? ghostObj : null;
                    
                treeNav.nodes(kernel.root);
                //treeNav.nodes(d); - interesting! will need to think seriously about this
                transform2(globalDuration*2);
            }
            
              function inPresentPath(leafNode, checkNode){
                function recurCheck(node){  
                    if(node === checkNode)
                        return true
                    if(node.d3parent === node) //root
                        return false                        
                    return recurCheck(node.d3parent)
                }
                 return recurCheck(leafNode);
              }
            function loadGhost (ghost, callback) {
                if(ghost.ghostType === undefined)
                    return callback(-1) // error - though i don't think this code works
                if(inPresentPath(ghost, ghost.node))
                    return callback(-1)
                
                node = ghost.node;
                if(node.graftGhost)
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
            
            function resetNode (node, callback) { //regarding Ghosts! these need grouping
 
                //if(ghost.ghostType === undefined)
                //    return callback(-1) // error - though i don't think this code works
                if(node.graftGhost)
                {
                    ghost = node.graftGhost;
                    ghost.skipGhost = false;
                    node.graftGhost = null;
                    return callback(node);
                }
                else
                    return callback(-1);
            };             


            function transform2(duration){

				inTransition = true;

                
                function boundFunction (displayToggle){  
                    //this.owningNode.element.style.display = displayToggle;
                    //this.visible = true//displayToggle;
                    this.owningNode.element.style.visibility = displayToggle;
                    //console.log(this.visible + " " + displayToggle)
                }
                
 				TWEEN.removeAll();
 				//could apply all these tweens and keep a reference to remove them without affecting the camera
				for ( var i = 0; i < objects.length; i ++ ) { //need to use a returned d3selection here, rather than iterating blindly
		            someDuration = duration;
		            if(objects[ i ].owningNode.activeLocal)
		            {
		                displayToggle = "visible"//"block";
		                //displayToggle = true
		            }
                    else
                    {
                        /*if(objects[ i ].owningNode.element.style.display == "none")
                            someDuration = 0
                        displayToggle = "none";*/
                        
                        if(objects[ i ].owningNode.element.style.visibility == "hidden")
                            someDuration = 0
                        displayToggle = "hidden"//"none";
                        
                        /*if( objects[ i ].visible == false)
                            someDuration = 0
                        displayToggle = false*/
                    }
                


				    var object = objects[ i ];
				    
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
		               if(displayToggle == "visible")
		                object.owningNode.element.style.visibility = displayToggle;
				
				        tweenfunc = TWEEN.Easing.Exponential.InOut
                        object.owningNode.scaleobj = { //properties can't start with numbers!!!!
                            transform : object.owningNode.element.style.transform,
                            owningNode : object.owningNode 
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

				        new TWEEN.Tween( object.position )
					        .to( { x: target.position.x, y: target.position.y, z: target.position.z }, someDuration )
					        .easing( tweenfunc )
				            .onComplete(  boundFunction.bind(object,displayToggle) )
					        .start();

				        new TWEEN.Tween( object.rotation )
					        .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, someDuration )
					        .easing( tweenfunc )
					        .start();

				        new TWEEN.Tween( object.scale )
					        .to( { x: target.scale.x, y: target.scale.y, z: target.scale.z }, someDuration )
					        .easing( tweenfunc )
					        .start();
					    //if !target.visible
					        //make invisible at the end of the other transitions
					    //else if !object.visible && target.visible
					        //make visible at the end of the other transitions						   
                    //else no tweens !
		        	
		        	//need to tween opacities, of object itself AND the div content / toggle div content visibility					
                
				}

				new TWEEN.Tween( this )
					.to( {}, duration * 2 )
					.onUpdate( render )
					.onComplete( function(){ /*selObj = kernel.root;*/
					    inTransition = false;
					    //console.log(onTransitionEnd)
					    onTransitionEnd();
					    onTransitionEnd = function(){};
					    render();
					})
					.start();           

                //to exmplore at some point....
                //// after tweenHead, do tweenBack
                //tweenHead.chain(tweenBack);
                // And after tweenBack, do tweenHead, so it is cycling
                //tweenBack.chain(tweenHead);            
            }
            
            function adjustYScales(){
                return;
                var depth2 = asdf.filter(function(d,i) {
                  return d.localDepth == 2;
                });
                depth2.each(function(d,i) {

                    d.object.position.y = d.target.position.y - camera.position.y*((d.target.position.z - 10000)/(d.d3parent.target.position.z - 10000))*0.73   //  *0.68 //hack!
                })

                var depth0 = asdf.filter(function(d,i) { //this will return all of them, of course
                  return d.localDepth == 0; //maybe use currroot or something
                });
                
                depth0.each(function(d,i) {
                    nodeHeight = (kx / 1.618);
                    depth1pxYGap = 200; 
                    d1TotalHeight = d.d3children.length*(nodeHeight+depth1pxYGap);
                    //^ what am i going to do about these??
                    d.object.position.y = camera.position.y - ((camera.position.y+d1TotalHeight/2)/(d1TotalHeight/2))* nodeHeight //d.target.position.y - camera.position.y*((d.target.position.z - 10000)/(d.d3parent.target.position.z - 10000))     *0.68 //hack!
                })
                
            }
            
            function selectOnScroll(){
            
                //            .attr("class", "element")
            }
            

            function clipY(){
                return;
                if(camera.position.y > currrroot.children[0].object.position.y)
                {
                    camera.position.y = currrroot.children[0].object.position.y
                    //camera.lookAt(currrroot.children[0].object.position); 
                }
                else if(camera.position.y < currrroot.children[currrroot.children.length-1].object.position.y)
                {
                    camera.position.y = currrroot.children[currrroot.children.length-1].object.position.y
                    //camera.lookAt(currrroot.children[currrroot.children.length-1].object.position);                     
                }
            }
	/*		function transform( targets, duration ) {

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

				renderer.setSize( winnerWidth(), winnerHeight() );

			}

			function animate() {

				requestAnimationFrame( animate );
				TWEEN.update();
				controls.update();

			}
      var pparams = []
			function render() {
			    function theSamePosition (pos1, pos2)
			    {
			        if((pos1.x == pos2.x) && (pos1.y == pos2.y) && (pos1.z == pos2.z))
			            return true;
                    return false;			            			        
			    }
			    
			    //i think something needs doing below about that annoying overshoot transitioning when backingUp
			    if(camObj != selObj && !theSamePosition(camObj.target.position, selObj.target.position) )//&& (selObj != camObj.d3parent) )//&& camObj.d3parent && !theSamePosition(selObj.target.position, camObj.d3parent.object.position))//&& (selObj != camObj.d3parent))
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
				    
				    currobject = selObj;//scene.position );

    				currobjectpos = currobject.target.position;			    				    
    				        				
				    currobject.element.classList.remove("element")
				    currobject.element.classList.add("element-selected")
                    //probably need to do some string manipulation... i'm sure there's a lib for this!
                    
                    //selObj = null;
                    function lerp (a,b,f)
                    {
                        ret = new THREE.Vector3();
                        ret.x = a.x + f * (b.x - a.x);
                        ret.y = a.y + f * (b.y - a.y);
                        ret.z = a.z + f * (b.z - a.z);
                        return ret;
                    }


                    onCameraAnimUpdate = function ()
                    {
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

                    onCameraAnimComplete = function ()
                    {
                        //createControlsForCamera();
                        controls.target = endLookAt;
                        anim.stop()
                        anim = null
                        //inTransition 
                    }


				    newPos = new THREE.Vector3();
				    newPos.x = currobjectpos.x +winnerWidth()/2 - (winnerWidth()*0.5)/2//- currobject.actualWidth/2//camera.position.x
				    newPos.y = currobjectpos.y
				    //console.log(newPos.y);
				    newPos.z = camera.position.z//currobject.z + 2000//currobject.z + selObj.dy*(kx*2*3)				    				    
				    newLookAtPos = newPos.clone()
				    //newLookAtPos.y = camera.position.y
				    newLookAtPos.z = 0
				    startPos = camera.position.clone();
                    startLookAt = controls.target;
                    endPos = newPos;
                    endLookAt = newLookAtPos//currobjectpos.clone();

                    param = pparams[pparams.push({t: 0})-1];


                    //TWEEN.Easing.Sinusoidal.InOut
                    
                    if(anim)
                        anim.stop()//TWEEN.remove(anim)
                    
                    var oldanim = anim

                    anim = new TWEEN.Tween(param).to({t: 1.0}, globalDuration ).easing(TWEEN.Easing.Linear.None ); //if url param has anim=true then use tween 500

                    anim.onUpdate(onCameraAnimUpdate);//Util.bind(this, 
                    anim.onComplete(onCameraAnimComplete);
                    console.log(oldanim)
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
				renderer.render( scene, camera );

			}




    return exports;
});
