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
    case 6:
      level = createLevel6();
      break;
    case 7:
      level = createLevel7();
      break;
    case 8:
      level = createLevel8();
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
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
  if (e.keyCode == 80) keyboard.P = true;
  if (e.keyCode == 67) keyboard.C = true;

  if (e.keyCode == 16) keyboard.SHIFT = true;
  if (e.keyCode == 83) keyboard.S = true;
  if (e.keyCode == 70) keyboard.F = true;

  if (keyboard.SHIFT && keyboard.F) {
    e.preventDefault();
    enterFullscreen();
  }

  if (keyboard.SHIFT && keyboard.S) {
    e.preventDefault();
    exitFullscreen();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
  if (e.keyCode == 80) keyboard.P = false;
  if (e.keyCode == 67) keyboard.C = false;

  if (e.keyCode == 16) keyboard.SHIFT = false;
  if (e.keyCode == 83) keyboard.S = false;
  if (e.keyCode == 70) keyboard.F = false;
});

function enterFullscreen() {
  const canvas = document.getElementById("canvas");
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch((err) => {
      console.error(`Fehler beim Vollbild-Start: ${err.message}`);
    });
  }
}

function exitFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch((err) => {
      console.error(`Fehler beim Vollbild-Ende: ${err.message}`);
    });
  }
}

function resizeCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

document.addEventListener("fullscreenchange", () => {
  resizeCanvas();
});

window.addEventListener("resize", () => {
  if (document.fullscreenElement) {
    resizeCanvas();
  }
});
