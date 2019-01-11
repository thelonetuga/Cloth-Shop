"use strict";

/*import * as THREE from "js/three";*/

let camera;
let scene;
let renderer;
let controls;
let clock;
let mixer;
let clipes;
let clipesRotacao;
let cQuaternion;

init();
animate();

function init() {
  let axes;
  let loader;
  var acaoMover = null;

  clipes = [];
  clipesRotacao = [];

  scene = new THREE.Scene();
  let container = document.getElementById("container");
  console.log($(container).width(), $(container).height());
  camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);

  camera.rotation.x = -0.3993032695657877;
  camera.rotation.y = 0.0022075378297279832;
  camera.rotation.z = 0.0009315185389924363;

  camera.position.x = 0.013486243587948504;
  camera.position.y = 2.3751014441331466;
  camera.position.z = 5.62857344526669;

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

  axes = new THREE.AxesHelper();
  //scene.add(axes);

  var grelha = new THREE.GridHelper();
  //scene.add(grelha);

  clock = new THREE.Clock();
  mixer = new THREE.AnimationMixer(scene);

  loader = new THREE.GLTFLoader();
  loader.load("../models/Jacket_anim_rotation.gltf", function(gltf) {
    scene.add(gltf.scene);
    scene.traverse(function(x) {
      if (x.isMesh) {
        gltf.scene.position.set(0, -1.3, 0);
        x.castShadow = true;
        x.receiveShadow = true;
        x.scale.set(7, 7, 7);
        //console.log(x);
      }
    });
    clipes.push(THREE.AnimationClip.findByName(gltf.animations, "KeyAction"));
    clipes.forEach(clipe => {
      mixer.clipAction(clipe).play();
      mixer.clipAction(clipe).paused = false;
      mixer.clipAction(clipe).timeScale = 1;
    });

    clipesRotacao.push(
      THREE.AnimationClip.findByName(gltf.animations, "rotacao")
    );
    clipesRotacao.forEach(clipe => {
      //mixer.clipAction(clipe).play();
      mixer.clipAction(clipe).paused = false;
      mixer.clipAction(clipe).timeScale = 1;
      acaoMover = mixer.clipAction(clipe);
    });
  });

  document.getElementById("buttonPlay").onclick = function() {
    acaoMover.play();
  };

  document.getElementById("buttonPause").onclick = function() {
    acaoMover.paused = !acaoMover.paused;
  };

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  /*controls.target.set(3, 0, -3);
    controls.update();*/

  let ambientLight = new THREE.AmbientLight("white", 1);
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
