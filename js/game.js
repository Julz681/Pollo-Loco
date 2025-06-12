let canvas;
let world;
let currentLevel = 1;
let isMuted = false;
let keyboard = new Keyboard();

const maxCoinsPerLevel = {
  1: 30, 2: 35, 3: 40, 4: 45,
  5: 50, 6: 50, 7: 50, 8: 60,
};

function getMaxCoinsForLevel(levelNumber) {
  return maxCoinsPerLevel[levelNumber] || 0;
}

function startGame(levelNumber) {
  currentLevel = levelNumber;
  document.getElementById("levelmenu").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";
  keyboard = new Keyboard();
  canvas = document.getElementById("canvas");
  let level = getLevel(levelNumber);
  world = new World(canvas, keyboard, level);
  window.world = world; 
  if (levelNumber === 8) resetFinalLevelStats();
}

function getLevel(levelNumber) {
  switch (levelNumber) {
    case 1: return createLevel1();
    case 2: return createLevel2();
    case 3: return createLevel3();
    case 4: return createLevel4();
    case 5: return createLevel5();
    case 6: return createLevel6();
    case 7: return createLevel7();
    case 8: return createLevel8();
    default: return createLevel1();
  }
}

function resetFinalLevelStats() {
  world.startTime = Date.now();
  world.deaths = 0;
  world.coinsCollectedFinal = 0;
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

function handleKeyDown(e) {
  if (world?.isGameOver) return;
  if (e.shiftKey && (e.key === "m" || e.key === "M")) {
    isMuted = true;
    if (world) world.soundManager.muteAllSounds();
    return;
  }
  if (e.shiftKey && (e.key === "u" || e.key === "U")) {
    isMuted = false;
    if (world) world.soundManager.unmuteAllSounds();
    return;
  }
  setKeyPressed(e.keyCode, true);
  if (keyboard.SHIFT && keyboard.F) {
    e.preventDefault();
    enterFullscreen();
  }
  if (keyboard.SHIFT && keyboard.S) {
    e.preventDefault();
    exitFullscreen();
  }
}

function handleKeyUp(e) {
  setKeyPressed(e.keyCode, false);
}

function setKeyPressed(keyCode, pressed) {
  switch (keyCode) {
    case 39: keyboard.RIGHT = pressed; break;
    case 37: keyboard.LEFT = pressed; break;
    case 38: keyboard.UP = pressed; break;
    case 40: keyboard.DOWN = pressed; break;
    case 32: keyboard.SPACE = pressed; break;
    case 68: keyboard.D = pressed; break;
    case 80: keyboard.P = pressed; break;
    case 67: keyboard.C = pressed; break;
    case 16: keyboard.SHIFT = pressed; break;
    case 83: keyboard.S = pressed; break;
    case 70: keyboard.F = pressed; break;
  }
}

function enterFullscreen() {
  const canvas = document.getElementById("canvas");
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch(() => {});
  }
}

function exitFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

function resizeCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

document.addEventListener("fullscreenchange", resizeCanvas);
window.addEventListener("resize", () => {
  if (document.fullscreenElement) resizeCanvas();
});
