window.addEventListener("load", () => {
  initFinalOverlay();
});

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

  if (levelNumber === 8) {
    world.startTime = Date.now();
    world.deaths = 0;
    world.coinsCollectedFinal = 0;
  }
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

function showEndScreenWithButtons(imagePath) {
  const overlay = document.getElementById("endScreenOverlay");
  const img = document.getElementById("endScreenImage");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const nextLevelBtn = document.getElementById("nextLevelBtn");

  img.src = imagePath;
  overlay.classList.remove("hidden");

  playAgainBtn.onclick = () => {
    overlay.classList.add("hidden");
    startGame(currentLevel); // Aktuelles Level neu starten
  };

  nextLevelBtn.onclick = () => {
    overlay.classList.add("hidden");
    if (currentLevel < 8) {
      startGame(currentLevel + 1); // Nächstes Level starten
    } else {
      alert("Du hast alle Level geschafft!");
      // Alternativ: Zur Startseite oder Level-Auswahl
      showLevelMenu();
    }
  };
}

function showGameOverScreen() {
  const overlay = document.getElementById("gameOverOverlay");
  const tryAgainBtn = document.getElementById("tryAgainBtn");
  const backToMenuBtn = document.getElementById("backToMenuBtn");

  overlay.classList.remove("hidden");

  tryAgainBtn.onclick = () => {
    overlay.classList.add("hidden");
    startGame(currentLevel); // aktuelles Level neu starten
  };

  backToMenuBtn.onclick = () => {
    overlay.classList.add("hidden");
    showLevelMenu(); // zurück ins Level Menü
  };
}

// --- Variablen für Tracking ---
let finalOverlay;
let confettiCanvas, confettiCtx;
let confettiPieces = [];
let confettiAnimationId;
let startTime;
let deaths = 0; // Hier musst du die Tode tracken (siehe unten)
let coinsCollectedFinal = 0;

function initFinalOverlay() {
  finalOverlay = document.getElementById("finalLevelOverlay");
  confettiCanvas = document.getElementById("confettiCanvas");
  confettiCtx = confettiCanvas.getContext("2d");
  confettiCanvas.width = 720;
  confettiCanvas.height = 480;

  document.getElementById("playAgainBtnFinal").onclick = () => {
    stopConfetti();
    finalOverlay.classList.add("hidden");
    startGame(1);
  };

  document.getElementById("showStatsBtn").onclick = () => {
    alert(
      `Du hast ${coinsCollectedFinal} Münzen gesammelt, bist ${deaths} mal gestorben und hast ${formatTime(
        Date.now() - startTime
      )} gebraucht.`
    );
  };
}

// Start Konfetti
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

// Hilfsfunktion Zeit formatieren (mm:ss)
function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// --- Funktion zum Anzeigen des finalen Overlays ---
function showFinalLevelOverlay(coins, timeMs, deathCount) {
  finalOverlay.classList.remove("hidden");
  document.getElementById("coinsCollectedFinal").textContent = coins;
  document.getElementById("timeTaken").textContent = formatTime(timeMs);
  document.getElementById("deathsCount").textContent = deathCount;

  startConfetti();
}
