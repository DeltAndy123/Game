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

export function stepLoop(f) {
  function step() {f(step)}
  return step();
}

export class TilemapText {
  arr = [];
  
  constructor(opts = {}) {
    opts.delay ||= 0;
    this.opts = opts;
    return this;
  }
  
  run(e) {
    if(!Array.isArray(e)) return console.error(
      mderr("Didn't recieve an array")
    );
    
    if(e != undefined) {
      this._run(e);
    } else if(this.opts.run != undefined) {
      this._run(opts.run);
    }
    
    return this;
  }
  
  hasPre = false;
  pre = [];
  
  use(f) {
    this.pre.push(f);
    this.hasPre = true;
    return this;
  }
  
  runPre(o) {
    for(const i of this.pre) i(o);
    return this;
  }
  
  key(key, f) {this.arr.push([key, f]); return this}
  
  check(c) {
    for(const [key, f] of this.arr)
      if(key == c) return [key, f];
    return false;
  }
  
  _finish = [];
  
  finished(f) {
    this._finish.push(f);
    return this;
  }
  
  _run(e) {
    var end = false;
    const self = this;
    var yLevel = e.length;
    function parseX(layer, step) {
      for(let i = 0; i != layer.length; i++) {
        const res = self.check(layer[i]);
        if(res) {
          const o = {y: yLevel, x: i, stop() {end = true}};
          if(self.hasPre) self.runPre(o);
          res[1](o);
          if(end) {
            for(const i of self._finish) i();
            return;
          }
        }
      }
      step();
    }
    
    function parseY() {
      stepLoop(step => {
        if(end) {
          for(const i of self._finish) i();
          return;
        }
        
        if(yLevel != 0) {
          yLevel--;
          setTimeout(() => parseX(e[yLevel], step), 50);
        } else {
          for(const i of self._finish) i();
          return;
        }
      });
    }
    parseY();
  }
}