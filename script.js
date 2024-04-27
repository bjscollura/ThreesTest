import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Essential Components
const canvas = document.getElementById("threejs");
const dimensions = {
    width: window.innerWidth,
    height: window.innerHeight
};
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(dimensions.width, dimensions.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Camera
const camera1 = new THREE.PerspectiveCamera(55, dimensions.width / dimensions.height);
// Scene
const scene1 = new THREE.Scene();
scene1.add(camera1);

THREE.ColorManagement.enabled = false; // for using old color syntax
renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // for using old color syntax

// Resizing the Canvas
window.addEventListener("resize", () => {
   dimensions.width = window.innerWidth; 
   dimensions.height = window.innerHeight; 
   
   camera1.aspect = dimensions.width / dimensions.height;
   camera1.updateProjectionMatrix();
   
   renderer.setSize(dimensions.width, dimensions.height);
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));   
});
window.addEventListener("dblclick", () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
        if(canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullScreen) {
            document.webkitExitFullScreen();
        }
    }
});

// Managers
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

// Textures, Materials, Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);

scene1.add(ambientLight, pointLight);

const jsTexture = textureLoader.load("/textures/js-logo.png");
const jsMaterial = new THREE.MeshBasicMaterial({ map: jsTexture });
const testCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    jsMaterial
);

scene1.add(testCube);
camera1.position.set(0, 0, 6);
camera1.lookAt(testCube.position);

// Debug
const controls = new OrbitControls(camera1, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

const axesHelper = new THREE.AxesHelper();
scene1.add(axesHelper);

const gui = new GUI();
gui.add(testCube.position, "x", -30, 30, 0.1);
gui.add(testCube.position, "y", -30, 30, 0.1);
gui.add(testCube.position, "z", -30, 30, 0.1);

// Animation
let time = Date.now();
const clock = new THREE.Clock();

function tick() {
    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;
    const elapsedTime = clock.getElapsedTime();
    
    // update controls
    controls.update();
    
    // update objects
    testCube.rotation.y = elapsedTime;
    testCube.rotation.x = elapsedTime;
    
    // rerender
    renderer.render(scene1, camera1);
    // recurse
    window.requestAnimationFrame(tick);
}

tick();