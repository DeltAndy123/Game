export function $(e) {return document.querySelector(e)}

export function mderr(e = "") {
  return new Error("MD Error: " + e);
}

export function once(e, f) {
  if(Array.isArray(e)) {
    for(const i of e) f(i);
  } else {
    f(e);
  }
}

export function $$(name, opts = {}) {
  const el = document.createElement(name);
  for(const key in opts.attrs) {
    if(key == "style") {
      if(typeof opts.attrs[key] != "string") {
        el.setAttribute(key, parseCSS(opts.attrs[key]));
      } else {
        el.setAttribute(key, opts.attrs[key]);
      } 
    } else {
      el.setAttribute(key, opts.attrs[key]);
    }
  }
  
  if(opts.on != undefined) {
    if(!Array.isArray(opts.on[0])) {
      el.addEventListener(opts.on[0], opts.on[1]());
    } else {
      for(const [event, func] of opts.on)
        el.addEventListener(event, func);
    }
  }
  
  if(opts.up != undefined) 
    once(opts.up, func => 
      el.addEventListener("pointerup", func)
    );
  
  if(opts.down != undefined) 
    once(opts.down, func => 
      el.addEventListener("pointerdown", func)
    );
  
  if(opts.inside != undefined)
    once(opts.inside, func => {
      el.addEventListener("pointerup", e => {
        const pos = el.getBoundingClientRect();
        
        /*console.log({
          mouseX: e.pageX,
          mouseY: e.pageY,
          top: pos.top,
          right: pos.right,
          bottom: pos.bottom,
          left: pos.left,
        });*/
        
        if(e.pageX > pos.left
        && e.pageX < pos.right
        && e.pageY > pos.top
        && e.pageY < pos.bottom) func(e);
      });
    });
  
  if(opts.outside != undefined)
    once(opts.outside, func => {
      el.addEventListener("pointerup", e => {
        const pos = el.getBoundingClientRect();
        if(!(e.pageX > pos.left
        && e.pageX < pos.right
        && e.pageY > pos.top
        && e.pageY < pos.bottom)) func(e);
      });
    });
  
  if(opts.children != undefined) {
    once(opts.children, e => {
      if(typeof e == "string") {
        el.appendChild(document.createTextNode(e));
      } else {
        el.appendChild(e);
      }
    });
  }
  
  if(opts.forEach != undefined) {
    once(opts.forEach, func => {
      for(let i = 0; i < el.children.length; i++)
        func(el.children[i]);
    });
  }
  
  return el;
}

export function addToGame(a, b) {
  $("#ui > #" + b).appendChild(a);
}

export function parseCSS(css) {
  var str = "";
  for(const key in css) str += `${key}:${css[key]};`;
  
  return str;
}

export function eventOnce(e, f) {
  f();
  addEventListener(e, f);
}

export function stopLoop(func, firstTick = true, delta = false) {
  var go = firstTick;
  var f = delta ? deltaLoop : loop;
  var start;
  var stop;
  
  if(delta) var lastTick = new Date.now();
  if(go) f();
  
  function start() {
    if(go) return;
    go = true;
    f();
  }
  
  function step() {
    if(go) {console.error(mderr(
      "step() can't be called when "
    + "the loop isn't stopped"
    )); return}
    f();
  }
  
  function stop() {go = false}
  
  function deltaLoop() {
    var deltas = new Date.now() - lastTick;
    func({start, stop, step, delta: deltas});
    if(go) requestAnimationFrame(loop);
  }
  
  function loop() {
    func({start, stop, step});
    if(go) requestAnimationFrame(loop);
  }
  
  return {start, stop, step};
}

export class TilemapText {
  arr = [];
  
  constructor(opts = {}) {
    opts.delay ||= 0;
    this.opts = opts;
  }
  
  run(e) {
    if(!Array.isArray(e)) {
      console.error(mderr("Didn't recieve an array"));
      return;
    }
    if(e != undefined) {
      this._run(e);
    } else if(this.opts.run != undefined) {
      this._run(opts.run);
    }
  }
  
  hasPre = false;
  pref = [];
  
  pre(f) {
    this.pref.push(f);
    this.hasPre = true;
  }
  
  key(txt, f) {this.arr.push([txt, f])}
  
  _run(e) {
    const self = this;
    var x = 0;
    var y = 0;
    
    var parseCoords;
    if(this.hasPre) {
      parseCoords = function(obj) {
        for(const i of this.pref)
          obj = i(obj.x, obj.y);
        return obj;
      }
    } else {
      parseCoords = function(obj) {return obj}
    }
    
    var stopf = false;
    function parse(yo) {
      yo--;
      console.log(yo);
      const xarr = e[yo];
      for(let xo = 0; xo != xarr.length; xo++) {
        x++;
        const c = xarr[xo];
        function check() {
          for(const [key, f] of self.arr) {
            if(c == key) {
              const a = parseCoords({x, y});
              f({x: a.x, y: a.y, stop() {stopf = true}});
              break;
            }
          }
        }
        
        if(stopf) break;
      }
      
      x = 0;
      y++;
    }
    
    if(this.opts.delay == 0) {
      for(let yo = e.length; yo != 0; yo--) {
        if(stopf) break;
        parse(yo);
      }
    } else {
      var time = 1;
      for(let yo = e.length; yo != 0; yo--) {
        if(stopf) break;
        time++;
        setTimeout(parse, this.opts.delay * time);
      }
    }
  }
}