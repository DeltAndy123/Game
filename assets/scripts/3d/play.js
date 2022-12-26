import {stopLoop, stepLoop, $, RADIAN_HALF, clamp, parseCSS, $$} from "../util.js";
import {loadLevel} from "./levelLoader.js";
import {newCamera, updateCamera, MovementCamera} 
from "../3d.js";
import {setCurrentCam, setCurrentScene, renderLoop} 
from "./app.js";
import {settings, settingsObj} from "../settings.js";

const scene = new THREE.Scene();
const cam = new MovementCamera({
  camera: {fov: 80},
});
/*
stopLoop(() => {
  cam.moveUp();
});
*/

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
    cam.rx += e.x * 0.005 * settingsObj.sensitivity;
    cam.ry = clamp(
      -Math.PI / 3,
      cam.ry + e.y * 0.005 * settingsObj.sensitivity,
      Math.PI / 3,
    );
  };
  
  addControls();
}

function addControls() {
  const co = $$("div", {
    style: parseCSS({
      position: "relative",
      border: "2px solid red",
      width: "100vw",
      height: "100vh",
    }),
  });
  const ch = $$("div", {
    style: parseCSS({
      display: "absolute",
      width: "100px",
      height: "100px",
      border: "3px solid green",
    }),
  });
  co.appendChild(ch);
  $("#ui").appendChild(co);
}

export {play};