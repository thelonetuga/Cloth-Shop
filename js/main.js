"use strict";

/*import * as THREE from "js/three";*/

let camera;
let scene;
let renderer;
let controls;
let clock;
let mixer;
let clipes;
let texture;

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
  loader.load("./models/New_Skirt.gltf", function(gltf) {
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
        if (x.name === "Cylinder") {
          x.material.color = new THREE.Color(1, 1, 1);
          texture = x.material.clone();
        }
      }
    });
    clipes.push(THREE.AnimationClip.findByName(gltf.animations, "KeyAction"));

    clipes.forEach(clipe => {
      mixer.clipAction(clipe).setLoop(THREE.LoopPingPong);
      mixer.clipAction(clipe).play();
      mixer.clipAction(clipe).paused = false;
      mixer.clipAction(clipe).timeScale = 1;
    });
    clipes.push(THREE.AnimationClip.findByName(gltf.animations, "Rotation"));
  });

  /*document.getElementById("btn_play").addEventListener("click", function() {
    let clipe = clipes.find(clipe => clipe.name === "Rotation");
    mixer.clipAction(clipe).setLoop(THREE.LoopPingPong);
    mixer.clipAction(clipe).play();
    mixer.clipAction(clipe).paused = false;
    mixer.clipAction(clipe).timeScale = 1;
  });*/
  document.getElementById("btn_play").addEventListener("click", function() {
    clipes.forEach(clipe => {
      mixer.clipAction(clipe).setLoop(THREE.LoopPingPong);
      mixer.clipAction(clipe).play();
      mixer.clipAction(clipe).paused = false;
      mixer.clipAction(clipe).timeScale = 1;
    });
  });

  document.getElementById("btn_pause").addEventListener("click", function() {
    let clipe = clipes.find(clipe => clipe.name === "Rotation");
    mixer.clipAction(clipe).paused = !mixer.clipAction(clipe).paused;
  });

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  /*controls.target.set(3, 0, -3);
  controls.update();*/

  let ambientLight = new THREE.AmbientLight("white", 0.6);
  scene.add(ambientLight);
  let luzPonto1 = new THREE.SpotLight("white", 1, 200, 1.05, 0.25, 1);
  luzPonto1.position.set(0, 3, 3);
  luzPonto1.castShadow = false;
  luzPonto1.shadow.mapSize.width = 1024;
  luzPonto1.shadow.mapSize.height = 1024;

  luzPonto1.shadow.camera.near = 500;
  luzPonto1.shadow.camera.far = 4000;
  luzPonto1.shadow.camera.fov = 30;
  scene.add(luzPonto1);

  /*let pointLightHelper = new THREE.SpotLightHelper(luzPonto1, 1, "green");
  scene.add(pointLightHelper);*/
  var sortingButtons = $(".product_sorting_btn");
  sortingButtons.each(function() {
    $(this).on("click", function() {
      var parent = $(this)
        .parent()
        .parent()
        .find(".sorting_text");
      parent.text($(this).text());
      var option = $(this).attr("data-isotope-option");
      option = JSON.parse(option);
      changeColor(option.color);
    });
  });
}

function changeColor(colorN) {
  let alvo = scene.getObjectByName("Cylinder");
  let material;
  console.log(colorN);
  console.log(alvo);
  if (colorN === "texture") {
    alvo.material = texture.clone();
  } else {
    let color = new THREE.Color(colorN);
    alvo.material.color = color;
    /*material = new THREE.MeshStandardMaterial({ color: color });*/
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  mixer.update(clock.getDelta());
}
