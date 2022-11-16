import {$, eventOnce, stopLoop} from "../modules/utils.js";

const renderer = new THREE.WebGLRenderer({
  canvas: $("#c"),
  precision: "lowp",
  antialias: false,
});

const dpi = devicePixelRatio;

renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
eventOnce("resize", () => renderer.setSize(innerWidth, innerHeight))

eventOnce("resize", () => {
  $("#c").setAttribute("width", innerWidth * dpi);
  $("#c").setAttribute("height", innerHeight * dpi);
  $("#c").style.width = innerWidth + "px";
  $("#c").style.height = innerHeight + "px";
});

var currentScene;
var currentCam;

function setCurrentScene(e) {currentScene = e}

function setCurrentCam(e) {currentCam = e}

const renderLoop = stopLoop(() => {
  renderer.render(currentScene, currentCam);
}, false);

export {
  renderLoop,
  renderer,
  setCurrentScene,
  setCurrentCam,
};