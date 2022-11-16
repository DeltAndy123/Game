import {TilemapText} from "../util.js";

function getLevel(num) {
  return [
    "###",
    "# #",
    "###",
  ];
}

export function loadLevel(num) {
  const tilemap = new TilemapText();
  tilemap.run(getLevel(num));
}