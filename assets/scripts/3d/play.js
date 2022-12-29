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
  
  cam.onMovement = s => s;
  
  addControls();
}

function addControls() {
  const moving = {
    up: false,
    left: false,
    down: false,
    right: false,
  };
  const movementLoop = stopLoop(() => {
    if(moving.up) cam.moveUp      (0.1);
    if(moving.left) cam.moveLeft  (0.1);
    if(moving.down) cam.moveDown  (0.1);
    if(moving.right) cam.moveRight(0.1);
  });
  
  const controls = $("#ui > #controls");
  const up = $$("button", {
    down(e) {moving.up = true},
    up(e) {moving.up = false},
    children: "Up",
  });
  
  const right = $$("button", {
    down(e) {moving.right = true},
    up(e) {moving.right = false},
    children: "Right",
  });
  
  const down = $$("button", {
    down(e) {moving.down = true},
    up(e) {moving.down = false},
    children: "Down",
  });
  
  const left = $$("button", {
    down(e) {moving.left = true},
    up(e) {moving.left = false},
    children: "Left",
  });
  
  const interact = $$("button", {
    children: "Interact",
  });
  
  const inventory = $$("button", {
    children: "Inventory",
  });
  
  const topRow = $$("div", {
    attrs: {
      id: "top-row",
      style: parseCSS({
        display: "flex",
        "flex-direction": "row",
      }),
    },
    children: [interact, up, inventory],
  });
  
  const bottomRow = $$("div", {
    attrs: {
      id: "bottom-row",
      style: parseCSS({
        display: "flex",
        "flex-direction": "row",
      }),
    },
    children: [left, down, right],
  });
  
  const co = $$("div", {
    attrs: {
      id: "gamepad",
    },
    children: [topRow, bottomRow],
  });
  controls.appendChild(co);
}

export {play};