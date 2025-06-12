let canvas;
let world;
let currentLevel = 1;
let isMuted = false;
let keyboard = new Keyboard();

const maxCoinsPerLevel = {
  1: 30,
  2: 35,
  3: 40,
  4: 45,
  5: 50,
  6: 50,
  7: 50,
  8: 60,
};

function showStartscreen() {
  document.getElementById("canvas").style.display = "none";
  document.getElementById("startscreen").classList.remove("hidden");
  document.getElementById("levelmenu").classList.add("hidden");
}

function getMaxCoinsForLevel(levelNumber) {
  return maxCoinsPerLevel[levelNumber] || 0;
}

function updateCoinsInLevelMenu() {
  for (let level = 1; level <= 8; level++) {
    updateCoinsDisplay(level);
  }
}

function updateCoinsDisplay(level) {
  const maxCoins = getMaxCoinsForLevel(level);
  const collectedCoins = localStorage.getItem(`coinsLevel${level}`) || 0;
  const display = document.getElementById(`coinsLevel${level}Display`);
  if (display) {
    display.innerHTML = `${collectedCoins} / ${maxCoins} <img src="img/8_coin/coin_1.png" alt="Coin" style="width:70px; vertical-align:middle;margin-left:-20px;">`;
  }
}

function showLevelMenu() {
  document.getElementById("startscreen").classList.add("hidden");
  document.getElementById("levelmenu").classList.remove("hidden");
  updateCoinsInLevelMenu();
}

// Globals for overlays and canvas
let finalOverlay;
let confettiCanvas;
let confettiCtx;
let confettiAnimationId;
let gameCanvas;

window.addEventListener("load", () => {
  initOverlays();
  setupOverlayButtons();
  setupMobileControls();  // <--- Mobile Controls Setup
  showStartscreen();
});

function initOverlays() {
  finalOverlay = document.getElementById("finalLevelOverlay");
  confettiCanvas = document.getElementById("confettiCanvas");
  confettiCtx = confettiCanvas.getContext("2d");
  confettiCanvas.width = 720;
  confettiCanvas.height = 480;
  gameCanvas = document.getElementById("canvas");
}

function setupOverlayButtons() {
  setupGameOverButtons();
  setupEndScreenButtons();
  setupFinalOverlayButtons();
}

function setupGameOverButtons() {
  const tryAgainBtn = document.getElementById("tryAgainBtn");
  if (tryAgainBtn) {
    tryAgainBtn.onclick = () => {
      hideOverlay("gameOverOverlay");
      startGame(currentLevel);
    };
  }
  const backToMenuBtnGameOver = document.getElementById("backToMenuBtnGameOver");
  if (backToMenuBtnGameOver) {
    backToMenuBtnGameOver.onclick = () => {
      hideOverlay("gameOverOverlay");
      showLevelMenu();
    };
  }
}

function setupEndScreenButtons() {
  const playAgainBtn = document.getElementById("playAgainBtn");
  if (playAgainBtn) {
    playAgainBtn.onclick = () => {
      hideOverlay("endScreenOverlay");
      startGame(currentLevel);
    };
  }
  const nextLevelBtn = document.getElementById("nextLevelBtn");
  if (nextLevelBtn) {
    nextLevelBtn.onclick = () => {
      hideOverlay("endScreenOverlay");
      if (currentLevel < 8) startGame(currentLevel + 1);
      else showLevelMenu();
    };
  }
  const backToMenuBtnEndScreen = document.getElementById("backToMenuBtnEndScreen");
  if (backToMenuBtnEndScreen) {
    backToMenuBtnEndScreen.onclick = () => {
      hideOverlay("endScreenOverlay");
      showLevelMenu();
    };
  }
}

function setupFinalOverlayButtons() {
  const playAgainBtnFinal = document.getElementById("playAgainBtnFinal");
  if (playAgainBtnFinal) {
    playAgainBtnFinal.onclick = () => {
      stopConfetti();
      hideFinalOverlay();
      startGame(1);
    };
  }
  const backToMenuBtnFinal = document.getElementById("backToMenuBtnFinal");
  if (backToMenuBtnFinal) {
    backToMenuBtnFinal.onclick = () => {
      stopConfetti();
      hideFinalOverlay();
      showLevelMenu();
    };
  }
}

function hideOverlay(id) {
  document.getElementById(id).classList.add("hidden");
}

function hideFinalOverlay() {
  finalOverlay.classList.add("hidden");
  gameCanvas.style.display = "block";
}

function startGame(levelNumber) {
  currentLevel = levelNumber;
  document.getElementById("levelmenu").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";

  keyboard = new Keyboard();
  canvas = document.getElementById("canvas");

  let level = getLevel(levelNumber);
  world = new World(canvas, keyboard, level);

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

document.addEventListener("fullscreenchange", () => {
  resizeCanvas();
});

window.addEventListener("resize", () => {
  if (document.fullscreenElement) {
    resizeCanvas();
  }
});

function showEndScreenWithButtons(imagePath) {
  const overlay = document.getElementById("endScreenOverlay");
  const img = document.getElementById("endScreenImage");
  img.src = imagePath;
  overlay.classList.remove("hidden");
}

function showGameOverScreen() {
  document.getElementById("gameOverOverlay").classList.remove("hidden");
}

function startConfetti() {
  initializeConfetti();
  confettiAnimationId = requestAnimationFrame(drawConfetti);
}

function initializeConfetti() {
  const colors = ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1b1", "#f9bec7"];
  confettiPieces = [];
  for (let i = 0; i < 100; i++) {
    confettiPieces.push(createConfettiPiece(colors));
  }
}

function createConfettiPiece(colors) {
  return {
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height - confettiCanvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 20 + 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    tilt: Math.floor(Math.random() * 10) - 10,
    tiltAngle: 0,
    tiltAngleIncrement: Math.random() * 0.07 + 0.05,
    speedY: Math.random() + 1,
    speedX: (Math.random() - 0.5) * 2,
  };
}

function drawConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach((p) => updateAndDrawConfetti(p));
  confettiAnimationId = requestAnimationFrame(drawConfetti);
}

function updateAndDrawConfetti(p) {
  p.tiltAngle += p.tiltAngleIncrement;
  p.y += p.speedY;
  p.x += p.speedX;
  p.tilt = Math.sin(p.tiltAngle) * 15;

  confettiCtx.beginPath();
  confettiCtx.lineWidth = p.r / 2;
  confettiCtx.strokeStyle = p.color;
  confettiCtx.moveTo(p.x + p.tilt + p.r / 2, p.y);
  confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
  confettiCtx.stroke();

  if (p.y > confettiCanvas.height) {
    p.x = Math.random() * confettiCanvas.width;
    p.y = -20;
  }
}

function stopConfetti() {
  cancelAnimationFrame(confettiAnimationId);
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function showFinalLevelOverlay() {
  finalOverlay.classList.remove("hidden");
  startConfetti();
  const finalContent = finalOverlay.querySelector(".finalLevelContent");
  finalContent.classList.add("hidden");
  setTimeout(() => {
    stopConfetti();
    finalContent.classList.remove("hidden");
  }, 5000);
}



function setupMobileControls() {
  const btnLeft = document.getElementById("btn-left");
  const btnRight = document.getElementById("btn-right");
  const btnJump = document.getElementById("btn-jump");
  const btnThrow = document.getElementById("btn-throw");
  const btnPause = document.getElementById("btn-pause");
  const btnMute = document.getElementById("btn-mute");

  function pressKey(key) {
    keyboard[key] = true;
  }
  function releaseKey(key) {
    keyboard[key] = false;
  }

  btnLeft.addEventListener("touchstart", () => pressKey("LEFT"));
  btnLeft.addEventListener("touchend", () => releaseKey("LEFT"));
  btnLeft.addEventListener("mousedown", () => pressKey("LEFT"));
  btnLeft.addEventListener("mouseup", () => releaseKey("LEFT"));
  btnLeft.addEventListener("mouseleave", () => releaseKey("LEFT"));

  btnRight.addEventListener("touchstart", () => pressKey("RIGHT"));
  btnRight.addEventListener("touchend", () => releaseKey("RIGHT"));
  btnRight.addEventListener("mousedown", () => pressKey("RIGHT"));
  btnRight.addEventListener("mouseup", () => releaseKey("RIGHT"));
  btnRight.addEventListener("mouseleave", () => releaseKey("RIGHT"));

  btnJump.addEventListener("touchstart", () => pressKey("UP"));
  btnJump.addEventListener("touchend", () => releaseKey("UP"));
  btnJump.addEventListener("mousedown", () => pressKey("UP"));
  btnJump.addEventListener("mouseup", () => releaseKey("UP"));
  btnJump.addEventListener("mouseleave", () => releaseKey("UP"));

  btnThrow.addEventListener("touchstart", () => pressKey("D"));
  btnThrow.addEventListener("touchend", () => releaseKey("D"));
  btnThrow.addEventListener("mousedown", () => pressKey("D"));
  btnThrow.addEventListener("mouseup", () => releaseKey("D"));
  btnThrow.addEventListener("mouseleave", () => releaseKey("D"));


  btnPause.addEventListener("click", () => {
    if (keyboard.P) {
      keyboard.P = false;
      keyboard.C = true;
    } else {
      keyboard.P = true;
      keyboard.C = false;
    }
  });

  btnMute.addEventListener("click", () => {
    if (isMuted) {
      isMuted = false;
      if (world) world.soundManager.unmuteAllSounds();
      btnMute.textContent = "🔈"; 
    } else {
      isMuted = true;
      if (world) world.soundManager.muteAllSounds();
      btnMute.textContent = "🔇"; 
    }
  });
}
