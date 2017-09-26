/*
A THREE.js model of Yokai (from Big Hero 6). Copyright (©) 2015 by JENNIFER CHIEN This program is released under the LICENCE INFO HERE.

Title: yokai.js
Author: Jennifer Chien
CREATED: Dec 1, 2016
MODIFIED:
Purpose: CS 307 Contribution Library
Creates a microbot object from the movie Big Hero 6. 
The object is created by calling the createMicrobot() function and 
is returned as an object container that can be scaled and 
repositioned in your scene as needed. The function takes in a mesh
material to map onto the object's surface so it can be
changed as desired, although in the movie it has a black/metalic.

BOUNDING BOX FOR JUST MICROBOT
	LEFT TO RIGHT: 3 + 2 - 0.5 + 3.5 + 2 - 0.5 + 3.5 = 13
	TOP TO BOTTOM: 3
	FRONT TO BACK: 3

*/

//<!-- ======================== Javascript code =================================== -->

//holds all the dimensions of the microbot so can be easily adjusted as needed
jcMcbotParams = {

	centerRad: 1.5,

	//lengthp1 and lengthp2 together account for half the length of the side part of the microbot 
	//(not including the center sphere)
	lengthp1: 2,
	lengthp2: 3.5, 

	overlapMargin: 0.5, //used so that the cylinder being attached to the sphere is overlapping

	touchCenterRad: 1,
	tipRad: 0.5

}

//function creates and returns the microbot object in a container
function createMicrobot(mesh){

	console.log("making a microbot...");

	//container will hold the entire object and be returned at the end of this function
	var microbotContainer = new THREE.Object3D();

	//start by building the center ball of the microbot -- the origin is located at the center
	var center = new THREE.Mesh(new THREE.SphereGeometry(jcMcbotParams.centerRad, 10, 10), mesh);
	center.position.y += jcMcbotParams.centerRad;
	microbotContainer.add(center);

	//create the right side of the microbot and add it to the container named rSide1
	var rSide1 = new THREE.Object3D();

	//create cylinder 1 (building out from the center sphere)
	var rPart1 = new THREE.Mesh(new THREE.CylinderGeometry(jcMcbotParams.touchCenterRad, jcMcbotParams.centerRad, jcMcbotParams.lengthp1, 6, 6), mesh);
	rPart1.rotation.z = Math.PI/2;
	rPart1.position.set(jcMcbotParams.centerRad + (jcMcbotParams.lengthp1/2) - jcMcbotParams.overlapMargin, jcMcbotParams.centerRad, 0);
	rSide1.add(rPart1);

	//create the second cylinder, building the pointed outer part of the microbot
	var rPart2 = new THREE.Mesh(new THREE.CylinderGeometry(jcMcbotParams.centerRad, jcMcbotParams.tipRad, jcMcbotParams.lengthp2, 6, 6), mesh);
	rPart2.rotation.z = Math.PI/2;
	rPart2.position.set(jcMcbotParams.centerRad + jcMcbotParams.lengthp1 - jcMcbotParams.overlapMargin + jcMcbotParams.lengthp2/2, jcMcbotParams.centerRad, 0);
	rSide1.add(rPart2);

	microbotContainer.add(rSide1);

	//then clone the right side and rotate it about the center to create the left side
	var rSide2 = rSide1.clone();
	rSide2.rotation.y = Math.PI;

	microbotContainer.add(rSide2);

	return microbotContainer;
}





//<!-- ======================== end of Javascript code =================================== -->