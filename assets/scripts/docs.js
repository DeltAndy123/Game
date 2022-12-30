function $(selector, e = document) {
  return e.querySelector(selector)
}

function toggleTheme(theme) {
  const body = document.querySelector('body');
  if ((body.getAttribute('data-theme') === 'dark' || theme === 'light') && theme !== 'dark') {
    body.setAttribute('data-theme', 'light');
    body.classList.remove('theme-dark');
    body.classList.add('theme-light');
    $("#theme-button i").classList.remove("fa-sun")
    $("#theme-button i").classList.add("fa-moon")
  } else {
    body.setAttribute('data-theme', 'dark');
    body.classList.remove('theme-light');
    body.classList.add('theme-dark');
    $("#theme-button i").classList.remove("fa-moon")
    $("#theme-button i").classList.add("fa-sun")
  }
}

const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function checkSystemDark(query) {
  if (query.matches) {
    // Dark theme
    toggleTheme("dark")
  } else {
    // Light theme
    toggleTheme("light")
  }
}

systemDark.onchange = (e) => {
  checkSystemDark(e)
}

async function scrollToSection(section) {
  if (!section) section = window.location.hash.slice(1)
  if (!section) return 'NOSECTION'
  const element = document.getElementById(section);
  if (!element) return 'NOSECTION'
  await new Promise(resolve => setTimeout(resolve, 1))
  window.scrollTo({ top: (element.offsetTop - 75), behavior: "smooth" })
}

function changeHashWithoutScrolling(hash) {
  hash = hash.replace(/^#/, '')
  if (history.pushState) {
    history.pushState(null, null, `#${hash}`);
  } else {
    const id = hash.replace(/^.*#/, '')
    const elem = document.querySelectorAll(`[id=${id}]`)
    elem.forEach((e) => {e.id = `${id}-tmp`})
    window.location.hash = hash
    elem.forEach((e) => {e.id = id})
  }
}

function patchSectionLink() {
  document.querySelectorAll("a[href*=\"#\"]").forEach((e) => {
    e.onclick = () => {
      changeHashWithoutScrolling(`${e.href.match(/.*?#(.*)/)[1]}`);
      scrollToSection(e.href.match(/.*?#(.*)/)[1])
      return false
    }
  })
}

window.onhashchange = (e) => {
  scrollToSection(e.newURL.match(/.*?#(.*)/)[1])
}

window.onload = () => {

  scrollToSection()
  patchSectionLink()

  checkSystemDark(systemDark)

  $("#theme-button").addEventListener("click", toggleTheme);
  
  const btns = document.querySelectorAll("[data-copytext]");
  for(let i = 0; i < btns.length; i++) {
    btns[i].onpointerup = function() {
      // YAY, IT COPIES THE TEXT
      navigator.clipboard.writeText(
        "https://game.deltandy123.repl.co/index.html#"
      + btns[i].id
      ).then(() => alert("Copied!"))
      .catch(e => alert("Couldn't copy"));
      // bruh
      // ok thanks
      // https://game.deltandy123.repl.co/index.html#util.js
    };
  }
}