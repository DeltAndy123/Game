import {TilemapText, mderr, randomColor} from "../util.js";
import {newBox} from "../3d.js";

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

export async function loadLevel({name, scene, camera} = {}) {
  if((name && scene && camera) == undefined)
    return console.error(mderr(
      `Didn't receive proper arguments for `
    + `the level loader @levelLoader.js`
    ));
  
  const level = await getLevel(name);
  
  const player = new TilemapText();
  player.key("@", ({x, y, stop}) => {
    centerX = x;
    centerY = y;
    camera.x = x;
    camera.y = y;
    stop();
  }).run(level);
  
  const pr = new Promise(
    res => player.finished(() =>
      parseLevel({level, scene, camera, res})
    )
  );
  
  return pr;
}

function parseLevel({level, scene, camera, res}) {
  const tilemap = new TilemapText();
  tilemap.use(o => {
    o.x -= centerX;
    o.y -= centerY;
  });
  tilemap.key("#", ({x, y}) => {
    const box = newBox(5, randomColor());
    x *= 5;
    y *= 5;
    box.position.x = x;
    box.position.y = y;
    scene.add(box);
  }).run(level);
  tilemap.finished(res);
}