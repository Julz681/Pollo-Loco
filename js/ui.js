let finalOverlay;
let confettiCanvas;
let confettiCtx;
let confettiAnimationId;
let gameCanvas;

window.addEventListener("load", () => {
  initOverlays();
  setupOverlayButtons();
  setupMobileControls();
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

function showStartscreen() {
  document.getElementById("canvas").style.display = "none";
  document.getElementById("startscreen").classList.remove("hidden");
  document.getElementById("levelmenu").classList.add("hidden");
}

function updateCoinsDisplay(level) {
  const maxCoins = getMaxCoinsForLevel(level);
  const collectedCoins = localStorage.getItem(`coinsLevel${level}`) || 0;
  const display = document.getElementById(`coinsLevel${level}Display`);
  if (display) {
    display.innerHTML = `${collectedCoins} / ${maxCoins} <img src="img/8_coin/coin_1.png" alt="Coin" style="width:70px; vertical-align:middle;margin-left:-20px;">`;
  }
}

function updateCoinsInLevelMenu() {
  for (let level = 1; level <= 8; level++) {
    updateCoinsDisplay(level);
  }
}

function showLevelMenu() {
  document.getElementById("startscreen").classList.add("hidden");
  document.getElementById("levelmenu").classList.remove("hidden");
  updateCoinsInLevelMenu();
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

function showEndScreenWithButtons(imagePath) {
  const overlay = document.getElementById("endScreenOverlay");
  const img = document.getElementById("endScreenImage");
  img.src = imagePath;
  overlay.classList.remove("hidden");
}

function showGameOverScreen() {
  document.getElementById("gameOverOverlay").classList.remove("hidden");
}

function setupMobileControls() {
  const btnLeft = document.getElementById("btn-left");
  const btnRight = document.getElementById("btn-right");
  const btnJump = document.getElementById("btn-jump");
  const btnThrow = document.getElementById("btn-throw");
  const btnPause = document.getElementById("btn-pause");
  const btnMute = document.getElementById("btn-mute");

  function pressKey(key) { keyboard[key] = true; }
  function releaseKey(key) { keyboard[key] = false; }

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
