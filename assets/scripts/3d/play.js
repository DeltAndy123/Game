import {stopLoop, stepLoop, $} from "../util.js";
import {loadLevel} from "./levelLoader.js";

function play() {
  const scene = new THREE.Scene();
  loadLevel(scene, "tutorial");
}

export {play};