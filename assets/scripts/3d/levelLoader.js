import {TilemapText, mderr} from "../util.js";

async function getLevel(name) {
  const data = 
  await fetch(`/assets/scripts/3d/levels/${name}.txt`);
  const txt = await data.text();
  
  if(txt[0] == "<"
  && txt[1] == "!")
    console.error(mderr("404 file recieved"));
  
  const arr = [];
  var xarr = "";
  for(const i of txt) if(i == "\n") {
    arr.unshift(xarr);
    xarr = "";
  } else {
    xarr += i;
  }
  arr.unshift(xarr);
  
  return arr;
}

var centerX = 0;
var centerY = 0;

export async function loadLevel(scene, name) {
  const level = await getLevel(name);
  
  const player = new TilemapText();
  player.key("@", ({x, y, stop}) => {
    centerX = x;
    centerY = y;
    stop();
  }).run(level);
  
  player.finished(() => parseLevel({level, scene}));
}

function parseLevel({level, scene}) {
  const tilemap = new TilemapText();
  tilemap.use(o => {
    o.x -= centerX;
    o.y -= centerY;
  });
  tilemap.key("#", ({x, y}) => {
    
  }).run(level);
}