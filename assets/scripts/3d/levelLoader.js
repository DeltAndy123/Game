import {TilemapText} from "../util.js";

function getLevel(num) {
  return [
    "###",
    "#@#",
    "###",
  ];
}

export async function loadLevel(scene, num) {
  const level = getLevel(num);
  var centerX = 0;
  var centerY = 0;
  
  const center = new TilemapText({delay: 0});
  center.key("@", ({x, y, stop}) => {
    centerX = x;
    centerY = y;
    stop();
  });
  center.run(level);
  
  const tilemap = new TilemapText();
  /*tilemap.pre(({x, y}) => {
    x -= centerX;
    y -= centerY;
  });*/
  tilemap.key("#", ({x, y}) => {
    console.log({x, y});
  });
  tilemap.run(level);
}