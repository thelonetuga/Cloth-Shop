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
  let cPosition = new THREE.Vector3(
    -1.799065584953647,
    0.19784399751744292,
    4.535197649362167
  );
  let cRotation = new THREE.Euler(
    -0.1050856119770399,
    -0.08331580366530747,
    -0.008777274893087297,
    "XYZ"
  );
  console.log(cQuaternion);

  camera.rotation.x = -0.2934582188044254;
  camera.rotation.y = -0.04009912508635147;
  camera.rotation.z = -0.012113428977186659;
  camera.position.x = -0.5186538915990595;
  camera.position.y = 2.763109340576216e-16;
  camera.position.z = 4.48259460477179;
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
  loader.load("../models/Skirt_anim rotation.gltf", function(gltf) {
    scene.add(gltf.scene);

    scene.traverse(function(x) {
      if (x.isMesh) {
        x.castShadow = true;
        x.receiveShadow = true;
        /*x.position.x = -2;
        x.position.y = -6;
        x.position.z = 2;
        x.position.y = -6;*/
        x.scale.set(7, 7, 7);
        //console.log(x);
      }
    });
    clipes.push(THREE.AnimationClip.findByName(gltf.animations, "KeyAction"));
    let plane = scene.getObjectByName("Plane");
    clipes.forEach(clipe => {
      mixer.clipAction(clipe).setLoop(THREE.LoopPingPong);
      mixer.clipAction(clipe).play();
      mixer.clipAction(clipe).paused = false;
      mixer.clipAction(clipe).timeScale = 1;
    });
    clipes.push(THREE.AnimationClip.findByName(gltf.animations, "Rotate"));
  });

  document.getElementById("btn_play").addEventListener("click", function() {
    let clipe = clipes.find(clipe => clipe.name === "Rotate");
    mixer.clipAction(clipe).setLoop(THREE.LoopPingPong);
    mixer.clipAction(clipe).play();
    mixer.clipAction(clipe).paused = false;
    mixer.clipAction(clipe).timeScale = 1;
  });

  document.getElementById("btn_pause").addEventListener("click", function() {
    let clipe = clipes.find(clipe => clipe.name === "Rotate");
    mixer.clipAction(clipe).paused = !mixer.clipAction(clipe).paused;
  });

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
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
