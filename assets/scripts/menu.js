import {$, $$, addToGame, parseCSS} from "./util.js";
import {play} from "./3d/play.js";
import {settings} from "./settings.js";
import {inDevEl} from "./in-dev.js";

var menu;

function main() {
  menu = $$("div", {
    attrs: {style: parseCSS({
      color: "white",
      display: "flex",
      "flex-direction": "column",
      width: "100%",
      height: "100%",
      "align-items": "space-around",
      "justify-content": "space-around",
    })},
    forEach(e) {
      e.style = parseCSS({
        margin: "auto",
        width: "50%",
        height: "min(20%, 100px)",
        padding: "auto",
        "border-radius": "5px",
        color: "black",
        "font-size": "1.5rem",
        "background": "linear-gradient(45deg, silver, white)",
        border: "1px solid white",
      });
      e.setAttribute("class", "down");
      e.addEventListener("pointerup", e => {
        menu.style.display = "none";
      });
    },
    children: [
      $$("button", {
        children: "Play",
        //up() {inDevEl.style.display = "flex"},
        up: play,
      }),
      $$("button", {
        children: "Settings",
        up: settings,
      }),
    ],
  });
  
  addToGame(menu, "page");
}

export {main, menu};