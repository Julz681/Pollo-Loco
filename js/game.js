let canvas;
let world;
let keyboard;
let currentLevel = 1;
let level1;


function showStartscreen() {
  document.getElementById("canvas").style.display = "none";
  document.getElementById("startscreen").classList.remove("hidden");
  document.getElementById("levelmenu").classList.add("hidden");
}

function showLevelMenu() {
  document.getElementById("startscreen").classList.add("hidden");
  document.getElementById("levelmenu").classList.remove("hidden");
}

function startGame(levelNumber) {
  currentLevel = levelNumber;
  document.getElementById("levelmenu").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";

  keyboard = new Keyboard();
  canvas = document.getElementById("canvas");

  let level;

  switch (levelNumber) {
    case 1:
      level = createLevel1();
      break;
    case 2:
      level = createLevel2();
      break;
    case 3:
      level = createLevel3();
      break;
    case 4:
      level = createLevel4();
      break;
    case 5:
      level = createLevel5();
      break;
    default:
      level = createLevel1();
  }

  world = new World(canvas, keyboard, level);  
}


function init() {
  // Start über showStartscreen()
}

document.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }

  if (e.keyCode == 38) {
    keyboard.UP = true;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }

  if (e.keyCode == 68) {
    keyboard.D = true;
  }

  if (e.keyCode == 80) {
    keyboard.P = true;
  }

  if (e.keyCode == 67) {
    keyboard.C = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }

  if (e.keyCode == 38) {
    keyboard.UP = false;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }

  if (e.keyCode == 68) {
    keyboard.D = false;
  }
  if (e.keyCode == 80) {
    keyboard.P = false;
  }

  if (e.keyCode == 67) {
    keyboard.C = false;
  }
});
