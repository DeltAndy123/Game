import {stopLoop, $} from "../util.js";
import {loadLevel} from "./levelLoader.js";

function play() {
  const scene = new THREE.Scene();
  loadLevel(scene, 0);
}

export {play};