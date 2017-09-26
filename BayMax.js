/*
A THREE.js model of Baymax (from Big Hero 6). Copyright (©) 2015 by JENNIFER CHIEN This program is released under the LICENCE INFO HERE.

Title: BayMax.js
Author: Jennifer Chien
CREATED: Nov 11, 2016
MODIFIED: Nov 17, 2016
Purpose: CS 307 Contribution Library
Creates a Baymax character from the movie Big Hero 6. 
The character created by calling the createBayMax() function 
is returned in an object container that can be scaled and 
repositioned in your scene as needed. The default 
THREE.MeshNormalMaterial() was used in coloring Baymax, although
he is normally completely white, easily changed by adjusting the 
defaultMesh variable in sceneParams.

PLACEMENT NOTE: origin is located in the bottom 1/3 of the main body segment

BOUNDING BOX FOR JUST BAYMAX
	arm to arm: 110
	head to toe: 140
	belly-button to back: 70

{minx: -55, maxx: 55,
 miny: -55, maxy: 85,
 minz: -35, maxz: 35}
*/

// <!-- ======================== Javascript code =================================== -->
//PARAMETERS, IN ADJUSTING A BAYMAX DO NOT ADJUST THESE UNLESS YOU WISH TO CHANGE THE DEFAULT MATERIAL
//CHANGING THE CONSTANTS USED IN THIS WILL CHANGE THE PROPORTIONALITY OF THE BODY PARTS OF BAYMAX
//AND MAY CAUSE HIM TO LOOK DISTORTED OR MISHAPPEN
var sceneParams = {

	//defaultMesh: new THREE.MeshNormalMaterial(),
	//defaultMesh: new THREE.MeshBasicMaterial({color: THREE.ColorKeywords.white}),
	defaultMesh: new THREE.MeshPhongMaterial({color: THREE.ColorKeywords.white, shininess: 30}),

	//finger parameters
	fingerOuterRad: 5,
	fingerThick: 1,
	fingerArc: Math.PI/4,
	fingerTipRad: 0.5,
	handRad: 4,

	//arm parameters
	shoulderRad: 2,
	bicepHeight: 10,
	elbowRad: 3,
	forearmLen: 9,

	//head parameters
	headRad: 10,
	headScale: 1.25,//(used in makeBayMax)
	eyeRad: 3.5,
	eyeSpace: 5,
	noseThick: 1.5,

	//body parameters
	bodyTopHighestPt: 38, //used in calculating the body length (from top to bottom)
	bodyBottomLowestPt:-100,
	bodyWidthTop: 35, //used to place the arms on either side of the body

	//scale the separate body parts so that they are all relatively proportional to each other
	legScale: 5.25,
	legYScale: 5.45,
	armScale: 0.23,
	armYScale: 0.19,
	handScale: 2,
	bodyScale: 1.1
};


//helper function for creating a single finger of a torus Geometry and a sphere to round off the sphere
function makeFinger(){

	//finger is built starting at where the finger joins the hand and building outward
	//all objects are positioned within the container that is returned
	var fingerContainer = new THREE.Object3D();

	//create the finger out of the torus and sphere geometry and the default mesh
	var finger = new THREE.Mesh(new THREE.TorusGeometry(sceneParams.fingerOuterRad, sceneParams.fingerThick, 10, 10, sceneParams.fingerArc), sceneParams.defaultMesh);
	var fingerTip = new THREE.Mesh(new THREE.SphereGeometry(sceneParams.fingerThick, 10, 10), sceneParams.defaultMesh);

	//add the geometries
	fingerContainer.add(finger);
	fingerContainer.add(fingerTip);

	//adjust the position of the finger and the finger tip
	fingerTip.position.y = -(sceneParams.fingerOuterRad)/20;
	fingerTip.position.x = sceneParams.fingerOuterRad;

	return fingerContainer;
}

//CODE WRITTEN BY KATERINE KJEER --------------------------------------
//http://cs.wellesley.edu/~cs307/threejs/contrib/kkjeer_TubeRadialGeometry.js
//MODIFIED BY JENNIFER CHIEN
function createTube (x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3, rad0, rad1, rad2, rad3) {
  var bezierCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(x0, y0, z0), 
    new THREE.Vector3(x1, y1, z1),
    new THREE.Vector3(x2, y2, z2),
    new THREE.Vector3(x3, y3, z3)
  );

  var radii = [rad0, rad1, rad2, rad3];

  var geom = new THREE.TubeRadialGeometry(bezierCurve, 32, radii, 16, false);
  var mat = sceneParams.defaultMesh;
  mat.side = THREE.DoubleSide;
  var tube = new THREE.Mesh(geom, mat);

  return tube;
}
//END OF CODE WRITTEN BY KATERHINE KJEER --------------------------------

//----------------------------------------------------------------------------------------

//makes BayMax's right arm (since the left and right arm are not simply clones of one another) and returns a container with the right arm (not including the hand)
function makeRightArm(){

	//create a container to return with the arm in
	var armContainer = new THREE.Object3D();

	//create the top half of the arm using the createTube function
	var bicep = createTube(-20, 100, 0, //point0
						    49, 100, 10, //point1
						    29, 49, -5, //point2
						    43, -43, 0, //point3
						    30, 30, 39, 34); //radii
	armContainer.add(bicep);
	bicep.position.y = 100;

	//create the bottom half of the arm using the createTube function
	var forearm = createTube(48, 66, 0, //point0
							 57, 19, 0, //point1
							 57, -46, 0, //point2
							 57, -75, 0, //point3
							 34, 39, 38, 30); //radii
	armContainer.add(forearm);
	forearm.scale.y = 1;
	forearm.position.set(-6, -7, 0);

	//return a container with the two arm segments attached to each other in a natural way
	return armContainer;

}

//function used to create the right hand, uses the makeFinger() helper functions
function makeRightHand(){

	//create the container to hold and return the hand(sphere) and four fingers
	var handContainer = new THREE.Object3D();

	//create the hand out of a sphere geometry
 	var hand = new THREE.Mesh(new THREE.SphereGeometry(sceneParams.handRad, 10, 10), sceneParams.defaultMesh);
	handContainer.add(hand);
	handContainer.position.y = -sceneParams.forearmLen + sceneParams.handRad;

	//create the four fingers and rotate them around the hand to separate them
	var finger1 = makeFinger();
	handContainer.add(finger1);
	finger1.position.y = -sceneParams.handRad;
	finger1.rotation.y = -Math.PI * 5/6;
	var finger2 = makeFinger();
	handContainer.add(finger2);
	finger2.position.y = -sceneParams.handRad;
	finger2.rotation.y = -Math.PI * 1/2;
	var finger3 = makeFinger();
	handContainer.add(finger3);
	finger3.position.y = -sceneParams.handRad;
	finger3.rotation.y = -Math.PI * 1/3;
	var finger4 = makeFinger();
	handContainer.add(finger4);
	finger4.position.y = -sceneParams.handRad;
	finger4.rotation.y = -Math.PI * (1/2-1/3);

	//scale the hand to match the body
	handContainer.scale.set(sceneParams.handScale, sceneParams.handScale, sceneParams.handScale);
	handContainer.position.set(47,-20,0);

	return handContainer;
}

//----------------------------------------------------------------------------------------

//make BayMax's left arm by cloning the right arm and rotating it
function makeLeftArm(){

	var armContainer = new THREE.Object3D();

	var leftArm = makeRightArm();
	armContainer.add(leftArm);
	leftArm.rotation.y = Math.PI;

	return armContainer;

}

//necessary because (if you look at your hands) hands are asymetric, but the code is very similar to that of makeRightHand()
function makeLeftHand(){

	//create the container to hold and return the hand(sphere) and four fingers
	var handContainer = new THREE.Object3D();

	//create the hand out of a sphere geometry
 	var hand = new THREE.Mesh(new THREE.SphereGeometry(sceneParams.handRad, 10, 10), sceneParams.defaultMesh);
	handContainer.add(hand);
	handContainer.position.y = -sceneParams.forearmLen + sceneParams.handRad;

	//create the four fingers and rotate them around the hand to separate them
	var finger1 = makeFinger();
	handContainer.add(finger1);
	finger1.position.y = -sceneParams.handRad;
	finger1.rotation.y = -Math.PI * 1/6;
	var finger2 = makeFinger();
	handContainer.add(finger2);
	finger2.position.y = -sceneParams.handRad;
	finger2.rotation.y = -Math.PI * 1/2;
	var finger3 = makeFinger();
	handContainer.add(finger3);
	finger3.position.y = -sceneParams.handRad;
	finger3.rotation.y = -Math.PI * 2/3;
	var finger4 = makeFinger();
	handContainer.add(finger4);
	finger4.position.y = -sceneParams.handRad;
	finger4.rotation.y = (Math.PI) - (Math.PI * (1/2-2/3));

	//scale the hand to match the body
	handContainer.scale.set(sceneParams.handScale, sceneParams.handScale, sceneParams.handScale);
	handContainer.position.set(-47,-20,0);

	return handContainer;

}

//----------------------------------------------------------------------------------------

//makes BayMax's leg, left and right are not differentiated so this function can be called twice in creating BayMax's two legs
function makeLeg(x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3, rad0, rad1, rad2, rad3){
	var tube = createTube(x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3, rad0, rad1, rad2, rad3);
	tube.scale.set(0.25, 0.25, 0.25); //scale it down
	tube.rotation.set(0, 0, Math.PI);
	return tube;
}

//----------------------------------------------------------------------------------------

//makes BayMax's head out of a scaled sphere, the eyes made of black spheres, nosebridge made of a black rectangle
function makeHead(){

	//creates a container to hold all the head features
	var headContainer = new THREE.Object3D();

	//create the scaled sphere to form a non-normal sphere and add it to the container
	var head = new THREE.Mesh(new THREE.SphereGeometry(sceneParams.headRad, 20, 20), sceneParams.defaultMesh);
	head.scale.set(1.7, 1.2, 1.5);
	headContainer.add(head);

	//create a right eye out of a black sphere
	var rightEye = new THREE.Mesh(new THREE.SphereGeometry(sceneParams.eyeRad, 10, 10), new THREE.MeshBasicMaterial({color: THREE.ColorKeywords.black}));
	headContainer.add(rightEye);
	rightEye.position.set(sceneParams.eyeSpace, sceneParams.noseThick/2, sceneParams.headRad * 1.2);

	//create the left eye by cloning the right eye
	var leftEye = rightEye.clone();
	headContainer.add(leftEye);
	leftEye.position.set(-sceneParams.eyeSpace, sceneParams.noseThick/2, sceneParams.headRad * 1.2);

	//create a rectangle that is the nosebridge
	var noseBridge = new THREE.Shape();
	noseBridge.moveTo(0, 0, 0);
	noseBridge.lineTo(sceneParams.eyeSpace, 0, 0);
	noseBridge.lineTo(sceneParams.eyeSpace, sceneParams.noseThick, 0);
	noseBridge.lineTo(-sceneParams.eyeSpace, sceneParams.noseThick, 0);
	noseBridge.lineTo(-sceneParams.eyeSpace, 0, 0);

	var noseGeom = new THREE.ShapeGeometry(noseBridge);
	var noseMat = new THREE.MeshBasicMaterial({color: 0x000000});
	var nose = new THREE.Mesh(noseGeom, noseMat); //create a mesh with the nose mat and geom

	headContainer.add(nose);
	nose.position.z = sceneParams.headRad * 1.5;

	return headContainer; //return the head container with the head, eyes, and nosebridge
}

//----------------------------------------------------------------------------------------

//make BayMax's body of a two specialTubes using the createTube() function twice
function makeBody(){
	var bodyContainer = new THREE.Object3D();

	//body is composed of two overlapping tube objects
	var bodyTop = new createTube(0, 29, 0, //point0
								 0, sceneParams.bodyTopHighestPt, 0, //point1
								 0, -30, 0, //point2
								 0, -40, 0, //point3
								 //radii
								 0, sceneParams.bodyWidthTop, 35, 37); //use bodyWidthTop so that the top and bottom part of the body fit together smoothly
	bodyContainer.add(bodyTop);
	bodyTop.position.y = 30;
	bodyTop.scale.set(0.8, 0.7, 0.8);

	var bodyBottom = new createTube(0, -10, 0, //point0
									0, -3, 0,  //point1
									0, -65, 0, //point2
									0, sceneParams.bodyBottomLowestPt, 0, //point3
									//radii
									0, 41, 35, sceneParams.bodyWidthTop); //use bodyWidthTop so that the top and bottom part of the body fit together smoothly
	bodyBottom.rotation.z = Math.PI;
	bodyContainer.add(bodyBottom);
	bodyBottom.position.y = -30;
	bodyBottom.scale.set(0.8, 0.7, 0.8);

	return bodyContainer;

}

//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------

//use the helper functions like makeLeftArm() and makeLeg() to build the entire baymax and returns a complete character to be added to the scene
function makeBayMax(){

	//creates a container to hold all the objects (and ultimately the entire BayMax to be returned)
	var baymaxContainer = new THREE.Object3D();


	//ARMS
	//will contain both right and left arms and hands
	var armContainer = new THREE.Object3D();

	//create rightArm: scale and position set so it is not within the body
	var rightArm = makeRightArm();
	armContainer.add(rightArm);
	rightArm.position.x = sceneParams.bodyWidthTop;
	rightArm.scale.set(sceneParams.armScale, sceneParams.armYScale, sceneParams.armScale);

	//add the right hand to the armContainer
	var rightHand = makeRightHand();
	armContainer.add(rightHand);
	
	//create leftArm: scale and position set so it is not within the body
	var leftArm = makeLeftArm();
	armContainer.add(leftArm);
	leftArm.position.x = -sceneParams.bodyWidthTop;
	leftArm.scale.set(sceneParams.armScale, sceneParams.armYScale, sceneParams.armScale);
	baymaxContainer.add(armContainer);

	//add the left hand to the armContainer
	var leftHand = makeLeftHand();
	armContainer.add(leftHand);


	//LEGS
	var legsContainer = new THREE.Object3D();
	var leftLeg = makeLeg(0, -25, 0, //point0
						  0, -5.5, 0, //point1
						  0, 12.5, 0, //point2
						  0, 0, 0,  //point3
						  13, 11, 6, 0); //radii

	legsContainer.add(leftLeg);
	leftLeg.position.set(13/5, 0, 0); //reposition the leg so it is not in the center of the body

	var rightLeg = leftLeg.clone();
	legsContainer.add(rightLeg)
	rightLeg.position.x = -13/5; //reposition the leg so it is not overlapping with the right leg
	//scale the legs to be proportional to the rest of BayMax
	legsContainer.scale.set(sceneParams.legScale, sceneParams.legYScale, sceneParams.legScale);
	//shift the legs down so that they are not inside the body
	legsContainer.position.y = -50;

	baymaxContainer.add(legsContainer);



	//HEAD
	var head = makeHead();
	//scale the head so it is proportional to the rest of BayMax
	head.scale.set(sceneParams.headScale, sceneParams.headScale, sceneParams.headScale);
	baymaxContainer.add(head);
	head.position.set(0, 69, 0); //reposition the head so it sits on top of the body
	
	//BODY
	var body = makeBody();
	baymaxContainer.add(body);
	//scale the body so it is proportional to the rest of BayMax
	body.scale.set(sceneParams.bodyScale, sceneParams.bodyScale, sceneParams.bodyScale);

	return baymaxContainer;

}



