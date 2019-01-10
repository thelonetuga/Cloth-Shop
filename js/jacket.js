"use strict";

/*import * as THREE from "js/three";*/

let camera;
let scene;
let renderer;
let controls;
let clock;
let mixer;
let clipes;
let cQuaternion;

init();
animate();

function init() {
  let axes;
  let loader;

  clipes = [];

  scene = new THREE.Scene();
  let container = document.getElementById("container");
  console.log($(container).width(), $(container).height());
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  console.log(cQuaternion);

  /* camera.rotation.x = -0.2709125931542197;
  camera.rotation.y = 0.022898195735745287;
  camera.rotation.z = 0.006359123509105542;
  camera.position.x = -0.25449088706444156;
  camera.position.y = 2.3883640065182763;
  camera.position.z = 4.388287524717485;*/

  camera.rotation.x = -0.3342786257355676;
  camera.rotation.y = -0.09721436885663409;
  camera.rotation.z = -0.033697850248518686;
  camera.position.x = -1.0149765517543652;
  camera.position.y = 2.2210741065477464;
  camera.position.z = 4.915826918820327;

  /*camera.lookAt(0, 0, 0);
    /*camera.position.copy(cPosition);*/
  /*camera.rotation.copy(cRotation);
    camera.updateProjectionMatrix();*/

  renderer = new THREE.WebGLRenderer({
    canvas: canvasss,
    precision: "highp",
    powerPreference: "high-performance",
    antialias: true,
    alpha: true,
    depth: true,
    premultipliedAlpha: true
  });
  renderer.setSize($(container).width(), $(container).width());
  renderer.shadowMap.enabled = true;
  scene.add(camera);
  /*document.body.style.overflow = "hidden";*/

  /*axes = new THREE.AxesHelper();
    scene.add(axes);*/

  clock = new THREE.Clock();
  mixer = new THREE.AnimationMixer(scene);

  loader = new THREE.GLTFLoader();
  loader.load("../models/Jacket.gltf", function(gltf) {
    scene.add(gltf.scene);

    scene.traverse(function(x) {
      if (x.isMesh) {
        x.castShadow = true;
        x.receiveShadow = true;
        //x.position.x = -2;
        // x.position.y = -6;
        // x.position.z = 2;
        // x.position.y = -6;
        x.scale.set(4, 4, 4);
        //console.log(x);
      }
    });
    clipes.push(THREE.AnimationClip.findByName(gltf.animations, "KeyAction"));
    clipes.forEach(clipe => {
      mixer.clipAction(clipe).play();
      mixer.clipAction(clipe).paused = false;
      mixer.clipAction(clipe).timeScale = 1;
    });
  });

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  /*controls.target.set(3, 0, -3);
    controls.update();*/

  let ambientLight = new THREE.AmbientLight("white", 0.4);
  scene.add(ambientLight);
  let luzPonto1 = new THREE.PointLight("white");
  luzPonto1.position.set(5, 3, 5);
  luzPonto1.castShadow = true;
  scene.add(luzPonto1);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  mixer.update(clock.getDelta());
}
