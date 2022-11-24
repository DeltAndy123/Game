import {stopLoop, stepLoop, $, RADIAN_HALF} from "../util.js";
import {loadLevel} from "./levelLoader.js";
import {newCamera, updateCamera} from "../3d.js";
import {setCurrentCam, setCurrentScene, renderLoop} 
from "./app.js";

const scene = new THREE.Scene();
const cam = newCamera(80);

function play() {
  loadLevel({
    name: "tutorial",
    scene,
    camera: cam,
  }).then(main);
}

function main() {
  updateCamera(cam, 0, RADIAN_HALF);
  setCurrentScene(scene);
  setCurrentCam(cam);
  
  renderLoop.start();
}

export {play};