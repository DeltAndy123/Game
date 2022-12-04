import {stopLoop, stepLoop, $, RADIAN_HALF, clamp} from "../util.js";
import {loadLevel} from "./levelLoader.js";
import {newCamera, updateCamera, ControlCamera} 
from "../3d.js";
import {setCurrentCam, setCurrentScene, renderLoop} 
from "./app.js";
import {settings} from "../settings.js";

const scene = new THREE.Scene();
const cam = new ControlCamera({
  camera: {fov: 80},
});

function play() {
  loadLevel({
    name: "tutorial",
    scene,
    camera: cam.camera,
  }).then(main);
}

function main() {
  cam.bind($("#c"));
  cam.setDefault(cam.camera, 0, 0);
  cam.enable();
  setCurrentScene(scene);
  setCurrentCam(cam.camera);
  renderLoop.start();
  
  cam.onPointerMove = function(e) {
    cam.rx += e.x * 0.005 * 1.5;
    cam.ry = clamp(
      -Math.PI / 3,
      cam.ry + e.y * 0.005 * 1.5,
      Math.PI / 3,
    );
    //console.log(cam.rx, cam.ry)
  };
}

export {play};