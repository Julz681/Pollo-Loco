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
    const maxCoins = getMaxCoinsForLevel(level);
    const collectedCoins = localStorage.getItem(`coinsLevel${level}`) || 0;
    const display = document.getElementById(`coinsLevel${level}Display`);
    if (display) {
      display.innerHTML = `${collectedCoins} / ${maxCoins} <img src="img/8_coin/coin_1.png" alt="Coin" style="width:70px; vertical-align:middle;margin-left:-20px;">`;
    }
  }
}

function showLevelMenu() {
  document.getElementById("startscreen").classList.add("hidden");
  document.getElementById("levelmenu").classList.remove("hidden");
  updateCoinsInLevelMenu();
}

window.addEventListener("load", () => {
  initFinalOverlay();
  showStartscreen();

  // Game Over Overlay Buttons
  const tryAgainBtn = document.getElementById("tryAgainBtn");
  if (tryAgainBtn) {
    tryAgainBtn.onclick = () => {
      document.getElementById("gameOverOverlay").classList.add("hidden");
      startGame(currentLevel);
    };
  }
  const backToMenuBtnGameOver = document.getElementById("backToMenuBtnGameOver");
  if (backToMenuBtnGameOver) {
    backToMenuBtnGameOver.onclick = () => {
      document.getElementById("gameOverOverlay").classList.add("hidden");
      showLevelMenu();
    };
  }

  // End Screen Overlay Buttons
  const playAgainBtn = document.getElementById("playAgainBtn");
  if (playAgainBtn) {
    playAgainBtn.onclick = () => {
      document.getElementById("endScreenOverlay").classList.add("hidden");
      startGame(currentLevel);
    };
  }
  const nextLevelBtn = document.getElementById("nextLevelBtn");
  if (nextLevelBtn) {
    nextLevelBtn.onclick = () => {
      document.getElementById("endScreenOverlay").classList.add("hidden");
      if (currentLevel < 8) {
        startGame(currentLevel + 1);
      } else {
        // Wenn letzte Level erreicht ist, zurück zum Menü ohne Alert
        showLevelMenu();
      }
    };
  }
  const backToMenuBtnEndScreen = document.getElementById("backToMenuBtnEndScreen");
  if (backToMenuBtnEndScreen) {
    backToMenuBtnEndScreen.onclick = () => {
      document.getElementById("endScreenOverlay").classList.add("hidden");
      showLevelMenu();
    };
  }

  // Final Level Overlay Buttons
  const playAgainBtnFinal = document.getElementById("playAgainBtnFinal");
  if (playAgainBtnFinal) {
    playAgainBtnFinal.onclick = () => {
      stopConfetti();
      document.getElementById("finalLevelOverlay").classList.add("hidden");
      document.getElementById("canvas").style.display = "block";
      startGame(1);
    };
  }
  const backToMenuBtnFinal = document.getElementById("backToMenuBtnFinal");
  if (backToMenuBtnFinal) {
    backToMenuBtnFinal.onclick = () => {
      stopConfetti();
      document.getElementById("finalLevelOverlay").classList.add("hidden");
      document.getElementById("canvas").style.display = "none";
      showLevelMenu();
    };
  }
});

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

  if (levelNumber === 8) {
    world.startTime = Date.now();
    world.deaths = 0;
    world.coinsCollectedFinal = 0;
  }
}

document.addEventListener("keydown", (e) => {
  if (world?.isGameOver) return;

  // Mute mit Shift + M
  if (e.shiftKey && (e.key === "m" || e.key === "M")) {
    isMuted = true;
    if (world) world.muteAllSounds();
    return; // keine weiteren Aktionen bei diesem Tastendruck
  }

  // Unmute mit Shift + U
  if (e.shiftKey && (e.key === "u" || e.key === "U")) {
    isMuted = false;
    if (world) world.unmuteAllSounds();
    return;
  }

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
  const playAgainBtn = document.getElementById("playAgainBtn");
  const nextLevelBtn = document.getElementById("nextLevelBtn");
  const backToMenuBtn = document.getElementById("backToMenuBtnEndScreen");

  img.src = imagePath;
  overlay.classList.remove("hidden");

}

function showGameOverScreen() {
  document.getElementById("gameOverOverlay").classList.remove("hidden");
}


let startTime;
let deaths = 0;
let coinsCollectedFinal = 0;

function initFinalOverlay() {
  finalOverlay = document.getElementById("finalLevelOverlay");
  confettiCanvas = document.getElementById("confettiCanvas");
  confettiCtx = confettiCanvas.getContext("2d");
  confettiCanvas.width = 720;
  confettiCanvas.height = 480;
}

function startConfetti() {
  confettiPieces = [];
  const colors = ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1b1", "#f9bec7"];

  for (let i = 0; i < 100; i++) {
    confettiPieces.push({
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
    });
  }

  confettiAnimationId = requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiPieces.forEach((p) => {
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
  });

  confettiAnimationId = requestAnimationFrame(drawConfetti);
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
  document.getElementById("canvas").style.display = "none";
  startConfetti();
}


