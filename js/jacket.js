"use strict";

/*import * as THREE from "js/three";*/

let camera;
let scene;
let renderer;
let controls;
let clock;
let mixer;
let clipes;
let clipeRotacao;
let texture;

init();
animate();

function init() {
  let axes;
  let loader;
  var acaoMover = null;

  clipes = [];

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
  loader.load("./models/Jacket_animacoes_textura.gltf", function(gltf) {
    scene.add(gltf.scene);
    scene.traverse(function(x) {
      if (x.isMesh) {
        gltf.scene.position.set(0, -1.3, 0);
        x.castShadow = true;
        x.receiveShadow = true;
        x.scale.set(7, 7, 7);
        if (x.name === "Cube") {
          x.material.color = new THREE.Color(1, 1, 1);
          texture = x.material.clone();
        }
      }
    });
    clipes.push(THREE.AnimationClip.findByName(gltf.animations, "KeyAction"));
    clipes.forEach(clipe => {
      mixer.clipAction(clipe).play();
      mixer.clipAction(clipe).paused = false;
      mixer.clipAction(clipe).timeScale = 1;
    });

    clipeRotacao = THREE.AnimationClip.findByName(gltf.animations, "rotacao");
  });

  document.getElementById("buttonPlay").onclick = function() {
    mixer.clipAction(clipeRotacao).setLoop(THREE.LoopPingPong);
    mixer.clipAction(clipeRotacao).play();
    mixer.clipAction(clipeRotacao).paused = false;
    mixer.clipAction(clipeRotacao).timeScale = 1;
  };

  document.getElementById("buttonPause").onclick = function() {
    mixer.clipAction(clipeRotacao).paused = !mixer.clipAction(clipeRotacao)
      .paused;
  };

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  /*controls.target.set(3, 0, -3);
    controls.update();*/

  let ambientLight = new THREE.AmbientLight("white", 1);
  scene.add(ambientLight);
  let luzPonto1 = new THREE.SpotLight("white", 2, 200, 1.05, 0.25, 1);
  luzPonto1.position.set(0, 3, 3);
  luzPonto1.castShadow = false;
  luzPonto1.shadow.mapSize.width = 1024;
  luzPonto1.shadow.mapSize.height = 1024;

  luzPonto1.shadow.camera.near = 500;
  luzPonto1.shadow.camera.far = 4000;
  luzPonto1.shadow.camera.fov = 30;
  scene.add(luzPonto1);

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
  let alvo = scene.getObjectByName("Cube");
  let material;
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
