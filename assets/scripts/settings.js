import {$, $$, addToGame, parseCSS} from "./util.js";

var settingsEl;

const settingsArr = [
  {
    name: "Back",
    type: "button",
    change() {
      settingsEl.style.display = "none";
    }
  },
  {
    name: "Music",
    type: "bar",
    change(a, b) {
      a.innerText = `Music [${b}%]`;
    },
  },
  {
    name: "Sound",
    type: "bar",
    change(a, b) {
      a.innerText = `Sound [${b}%]`;
    },
  },
  {
    name: "Controls",
    type: "button",
    change(e) {
      console.log("down");
    },
  },
];

function parseSettings(arr = []) {
  const internal = [];
  
  for(const {name, type, change} of arr) {
    // DO NOT DELETE
    switch(type) {
      case "bar":
        (function() {
          const label = $$("label", {
            attrs: {
              for: "a",
            }, 
            children: name + " [100%]",
          });
          const slider = $$("input", {
            attrs: {
              type: "range",
              name: "a",
              min: 0,
              max: 100,
              value: 100,
              class: "slider",
            },
          });
          const el = $$("div", {
            attrs: {style: parseCSS({
              display: "flex",
              "flex-direction": "row",
              "justify-content": "space-between",
              border: "2px outset silver",
              "background": "linear-gradient(45deg, silver, white)",
              color: "black",
              "text-align": "center",
              "align-items": "center",
            })},
            forEach(e) {
              e.style = parseCSS({
                width: "100%",
                height: "100%",
              });
            },
            children: [
              label,
              $$("div", {
                attrs: {style: parseCSS({
                  display: "flex",
                  "flex-direction": "row",
                  "align-items": "center",
                })},
              }),
              slider,
            ],
          });
          slider.addEventListener("input", 
            e => change(label, e.currentTarget.value),
          );
          internal.push(el);
        })();
        break;
      case "button":
        (function() {
          const el = $$("div", {
            attrs: {},
          });
        })();
        break;
      default:
        console.error(new Error("Invalid settings type"));
    }
  }
  
  return internal;
}

settingsEl = $$("div", {
  attrs: {style: parseCSS({
    display: "none",
  })},
  children: parseSettings(settingsArr),
});

addToGame(settingsEl, "page");

function settings() {
  settingsEl.style.display = "block";
}

export {settings};