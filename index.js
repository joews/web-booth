import THREE from "three";
import getEffectComposer from "three-effectcomposer";
import getUserMedia from "getUserMedia";

import dotScreen from "./effects/dot-screen/dot-screen";

const EffectComposer = getEffectComposer(THREE);

const [width, height] = [1280, 720];

const video = document.getElementById("video");
video.width = width;
video.height = height;

const mediaConfig = {
  video: {
    mandatory: {
      minWidth: width,
      minHeight: height
    }
  }
};

getUserMedia(mediaConfig, (err, stream) => {
  if(err) {
    console.error(err);
  } else {
    video.src = window.URL.createObjectURL(stream);
    start();
  }
});

const videoTexture = new THREE.Texture(video);
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const composer = new EffectComposer(renderer);
let mesh;

function start() {
  buildScene();
  animate();
}

function buildScene() {
	camera.position.z = 400;

	const geometry = new THREE.BoxGeometry(200, 200, 200);
	const material = new THREE.MeshBasicMaterial({ map: videoTexture });

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	window.addEventListener("resize", onWindowResize, false);

  // postprocessing
  composer.addPass(new EffectComposer.RenderPass(scene, camera));

  const dotScreenEffect = new EffectComposer.ShaderPass(dotScreen);
  dotScreenEffect.uniforms.scale.value = 4;
  dotScreenEffect.renderToScreen = true;
  composer.addPass( dotScreenEffect );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);

  if(video.readyState === video.HAVE_ENOUGH_DATA) {
    videoTexture.needsUpdate = true;
  }

	mesh.rotation.x += 0.005;
	mesh.rotation.y += 0.01;

	composer.render( scene, camera );
}
