import { stopLoop, stepLoop, $, RADIAN_HALF, clamp, parseCSS, $$ } from "../util.js";
import { loadLevel } from "./levelLoader.js";
import { newCamera, updateCamera, MovementCamera }
  from "../3d.js";
import { setCurrentCam, setCurrentScene, renderLoop }
  from "./app.js";
import { settings, settingsObj } from "../settings.js";

const scene = new THREE.Scene();
const cam = new MovementCamera({
  camera: { fov: 80 },
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
    $("#ui > #controls").style.display = "block"
    cam.rx += e.x * 0.005 * settingsObj.sensitivity;
    cam.ry = clamp(
      -Math.PI / 3,
      cam.ry + e.y * 0.005 * settingsObj.sensitivity,
      Math.PI / 3,
    );
  };
  
  addMouseControls();
  addControls();
}

function addMouseControls() {
  $("#c").addEventListener("mousemove", e => {
    cam.rx += e.movementX * -0.005 * settingsObj.sensitivity;
    cam.ry = clamp(
      -Math.PI / 3,
      cam.ry + e.movementY * -0.005 * settingsObj.sensitivity,
      Math.PI / 3,
    );
  });
  // Set up pointer lock
  document.addEventListener("click", e =>
    $("#c").requestPointerLock()
  );

  document.addEventListener("pointerlockchange", e => {
    if (document.pointerLockElement === $("#c")) {
      // Pointer lock was acquired
      console.log("Pointer lock acquired");
    } else {
      // Pointer lock was lost
      console.log("Pointer lock lost");
    }
  });

  document.addEventListener("pointerlockerror", e =>
    console.log("Pointer lock error")
  );

  if($("#c").requestPointerLock) $("#c").requestPointerLock();

  // Unlock pointer on escape key press
  document.addEventListener("keydown", e => {
    if (e.code === "Escape")
      // Escape key was pressed
      document.exitPointerLock();
  });
}

function addControls() {
  const moving = {
    up: false,
    left: false,
    down: false,
    right: false,
  };
  
  const movementLoop = stopLoop(() => {
    if (moving.up) cam.moveUp(0.1);
    if (moving.left) cam.moveLeft(0.1);
    if (moving.down) cam.moveDown(0.1);
    if (moving.right) cam.moveRight(0.1);
  });
  
  const controls = $("#ui > #controls");
  // nice job
  // I'll fix the PWA manifest.json
  // ok
  const keyboardDown = document.addEventListener("keydown", (e) => {
    controls.style.display = "none";
    if (e.code == "KeyW" || e.code == "ArrowUp") moving.up = true;
    if (e.code == "KeyA" || e.code == "ArrowLeft") moving.left = true;
    if (e.code == "KeyS" || e.code == "ArrowDown") moving.down = true;
    if (e.code == "KeyD" || e.code == "ArrowRight") moving.right = true;
  })

  const keyboardUp = document.addEventListener("keyup", (e) => {
    // NO SEMICOLONS?????
    // ok, fixed
    // should I put ( ) around "e"?
    // or do you like it as e => {} better
    // ok
    // I usually use with the ()
    
    if (e.code == "KeyW" || e.code == "ArrowUp") moving.up = false;
    if (e.code == "KeyA" || e.code == "ArrowLeft") moving.left = false;
    if (e.code == "KeyS" || e.code == "ArrowDown") moving.down = false;
    if (e.code == "KeyD" || e.code == "ArrowRight") moving.right = false;
  })

  const up = $$("button", {
    down(e) { moving.up = true },
    up(e) { moving.up = false },
    children: "Up",
  });

  const right = $$("button", {
    down(e) { moving.right = true },
    up(e) { moving.right = false },
    children: "Right",
  });

  const down = $$("button", {
    down(e) { moving.down = true },
    up(e) { moving.down = false },
    children: "Down",
  });

  const left = $$("button", {
    down(e) { moving.left = true },
    up(e) { moving.left = false },
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

export { play };