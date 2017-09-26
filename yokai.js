/*
A THREE.js model of Yokai (from Big Hero 6). Copyright (©) 2015 by JENNIFER CHIEN This program is released under the LICENCE INFO HERE.

Title: yokai.js
Author: Jennifer Chien
CREATED: Dec 1, 2016
MODIFIED:
Purpose: CS 307 Contribution Library
Creates the Yokai (villain) character from the movie Big Hero 6. 
(he kind of looks like no-face from spirited away)
The character created by calling the createYokai() function 
is returned in an object container that can be scaled and 
repositioned in your scene as needed. The default 
THREE.MeshPhongMaterial() was used in coloring Yokai, although
he is normally completely black, easily changed by adjusting the 
defaultMesh variable in jcYokaiParams.

PLACEMENT NOTE: BY DEFAULT YOKAI IS FACING TO THE LEFT

BOUNDING BOX FOR YOKAI
	LEFT TO RIGHT: 26 (at the bottom), 14 at the top
	TOP TO BOTTOM: 39, -60
	FRONT TO BACK: 26 (at the bottom), 14 at the top

*/

//<!-- ======================== Javascript code =================================== -->

var jcYokaiParams = {

	//defaultMesh: new THREE.MeshNormalMaterial(),
	blackMesh: new THREE.MeshPhongMaterial({color: THREE.ColorKeywords.black, shininess: 5}),

	faceMaskRad: 14

};

//MODIFIED BY JENNIFER CHIEN -- parameterized the inputs, takes in the mesh
	//original code: http://cs.wellesley.edu/~cs307/threejs/contrib/kkjeer_TubeRadialGeometry.js
	function createTubewMat (x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3, rad0, rad1, rad2, rad3, material) {
	  var bezierCurve = new THREE.CubicBezierCurve3(
	    new THREE.Vector3(x0, y0, z0), 
	    new THREE.Vector3(x1, y1, z1),
	    new THREE.Vector3(x2, y2, z2),
	    new THREE.Vector3(x3, y3, z3)
	  );

	  var radii = [rad0, rad1, rad2, rad3];

	  var geom = new THREE.TubeRadialGeometry(bezierCurve, 32, radii, 16, false);
	  var mat = material;
	  mat.side = THREE.DoubleSide;
	  var tube = new THREE.Mesh(geom, mat);

	  return tube;
	};
//END OF CODE WRITTEN BY KATERHINE KJEER --------------------------------


//function used to create yokai, container with the object is returned at the end of the function
function makeYokai(){

	console.log("making yokai...");

	var yokaiContainer = new THREE.Object3D();

	//use the modified Katherine Kjeer code
	var body = createTubewMat(0, 18, 0, //point0
						  0, 39, 0, //point1
						  0, -40, -23, //point2
						  0, -60, -28, //point3
						  0, 14, 19, 26,
						  jcYokaiParams.blackMesh); //radii
	body.position.y = 59; //raise the body so it is just barely intersects with the floor
	body.rotation.x = -Math.PI/6;
	yokaiContainer.add(body);


	var faceMask;

	//load the texture for the image for the mask, map it onto a sphere that intersects with the tubeRadialGeometry
	TW.loadTexture(
		'yokaiMask.png',
		function(texture){
			var geom = new THREE.SphereGeometry(jcYokaiParams.faceMaskRad, 100, 100);
			var mat = new THREE.MeshPhongMaterial({
					color: THREE.ColorKeywords.white,
					shininess: 5,
					map: texture
				});
			//map the texture onto the sphere
			faceMask = new THREE.Mesh(geom, mat);
			//scale the sphere so it is more ovular
			faceMask.scale.set(0.9, 1.3, 0.9);
			//add the scaled sphere to the container and then reposition it
			yokaiContainer.add(faceMask);
			faceMask.position.set(0, 58, -15);
			faceMask.rotation.y = Math.PI/2;

			yokaiContainer.add(faceMask);
			render();
		});
	
	//by default for the purposes of our scene, yokai is returned facing to the left
	yokaiContainer.rotation.y = Math.PI/2;

	return yokaiContainer;

}




//<!-- ======================== end of Javascript code =================================== -->