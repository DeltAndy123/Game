(function() {
  "use strict";
  
  function $(e) {return document.querySelector(e)}
  
  addEventListener("touchend", e => e.preventDefault());
  
  addEventListener("load", e => {
    $("main").style.display = "block";
  });
  
  document.documentElement.style
  .setProperty("--w", innerWidth + "px");
  document.documentElement.style
  .setProperty("--h", innerHeight + "px");
  addEventListener("resize", e => {
    document.documentElement.style
    .setProperty("--w", innerWidth + "px");
    document.documentElement.style
    .setProperty("--h", innerHeight + "px");
  });
})();