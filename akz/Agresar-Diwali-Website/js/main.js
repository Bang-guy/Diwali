const games = [
  { name: "Dumb Charades", short: "Dumb Charades", image: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80", description: "Guess three prompts correctly within two minutes. The audience acts out the clues or gives the agreed dialogue clue." },
  { name: "Repeat After Me", short: "Repeat After Me", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80", description: "Repeat the host's tongue twisters and tricky phrases. Keep going for the full three minutes without getting caught out." },
  { name: "Read My Lips", short: "Read My Lips", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", description: "Watch the host's lips and guess the word or sentence written on the chit by an audience member." },
  { name: "Wrong Answers Only", short: "Wrong Answers Only", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80", description: "Answer every question incorrectly. Give the correct answer and the challenge is lost." },
  { name: "Emotion Switch", short: "Emotion Switch", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80", description: "Take the host's sentence and deliver it using a different, opposite emotion." },
  { name: "Character Acting", short: "Character Acting", image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80", description: "Act like the character suggested by the host or audience. Make the character come alive." },
  { name: "Blow Candle", short: "Blow Candle", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80", description: "You get one attempt to blow out all ten candles arranged in a line." },
  { name: "Fill Water Cup", short: "Fill Water Cup", image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80", description: "Take your turn pouring water into the glass. Spill it and face an audience-picked truth or dare." },
  { name: "One-Word Story", short: "One-Word Story", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80", description: "Choose five people. Each person adds one word at a time to create one shared story." },
  { name: "Diya Tower", short: "Diya Tower", image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=800&q=80", description: "Two teams of three build diya towers. The tallest tower built in the shortest time wins." }
];

const $ = (id) => document.getElementById(id);
const welcomeScreen = $("welcomeScreen");
const gameArea = $("gameArea");
const wheelImage = $("wheelImage");
const wheelStage = document.querySelector(".wheel-stage");
const spinButton = $("spinButton");
const modeNote = $("modeNote");
const roundStatus = $("roundStatus");
const roundModal = $("roundModal");

let mode = "repeat";
let spinning = false;
let selectedGameIndex = null;
let roundNumber = 1;
let roundPlayed = [];
let history = [];
let recent = [];

const STORAGE_KEY = "agresar-diwali-session-v1";
const celebrationCanvas = $("celebrationCanvas");
const celebrationCtx = celebrationCanvas.getContext("2d");
const introCanvas = $("introCanvas");
const introCtx = introCanvas.getContext("2d");
let fireworks = [];
let confetti = [];
let animationFrame = 0;
let introRunning = true;


function fitCanvas(canvas, ctx) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
function burst(x, y, count = 64, power = 4.5) {
  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 2 * i / count + Math.random() * .08;
    const speed = Math.random() * power + 1;
    fireworks.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 55 + Math.random() * 30, maxLife: 85,
      size: Math.random() * 2.2 + 1,
      hue: [36, 42, 28, 350, 18][Math.floor(Math.random() * 5)]
    });
  }
}
function animateCanvas(ctx, canvas, isIntro = false) {
  const width = window.innerWidth, height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);
  if (isIntro && Math.random() < .045) burst(Math.random() * width, height * (.12 + Math.random() * .42), 48, 3.6);
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const p = fireworks[i];
    p.x += p.vx; p.y += p.vy; p.vy += .025; p.vx *= .992; p.life--;
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = `hsl(${p.hue} 95% 69%)`;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    if (p.life <= 0) fireworks.splice(i, 1);
  }
  ctx.globalAlpha = 1;
  if (isIntro || fireworks.length || confetti.length) {
    for (let i = confetti.length - 1; i >= 0; i--) {
      const p = confetti[i]; p.x += p.vx; p.y += p.vy; p.vy += .035; p.life--;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 45));
      ctx.fillStyle = `hsl(${p.hue} 90% 65%)`;
      ctx.fillRect(p.x, p.y, p.size, p.size * 1.6);
      if (p.life <= 0 || p.y > height + 20) confetti.splice(i, 1);
    }
  }
  ctx.globalAlpha = 1;
  if (isIntro && introRunning) {
    requestAnimationFrame(() => animateCanvas(ctx, canvas, true));
  } else if (!isIntro && animationFrame && (fireworks.length || confetti.length)) {
    animationFrame = requestAnimationFrame(() => animateCanvas(ctx, canvas, false));
  }
}
function launchFireworks(intensity = 1) {
  fitCanvas(celebrationCanvas, celebrationCtx);
  animationFrame = 0;
  const w = window.innerWidth, h = window.innerHeight;
  for (let i = 0; i < 3 * intensity; i++) {
    setTimeout(() => burst(w * (.18 + Math.random() * .64), h * (.12 + Math.random() * .42), 70, 5.2), i * 260);
  }
  for (let i = 0; i < 130 * intensity; i++) {
    confetti.push({ x: Math.random() * w, y: -Math.random() * h * .5, vx: (Math.random() - .5) * 2.5, vy: Math.random() * 2 + 1, life: 150, size: Math.random() * 5 + 2, hue: [35, 43, 48, 12][Math.floor(Math.random() * 4)] });
  }
  animationFrame = requestAnimationFrame(() => animateCanvas(celebrationCtx, celebrationCanvas, false));
  setTimeout(() => { cancelAnimationFrame(animationFrame); celebrationCtx.clearRect(0, 0, w, h); animationFrame = 0; }, 5200);
}
function showEffectMessage(message) {
  const node = $("effectMessage");
  node.textContent = message;
  node.classList.remove("hidden");
  setTimeout(() => node.classList.add("hidden"), 2200);
}
function makeSparkle(x, y) {
  const s = document.createElement("span");
  s.className = "sparkle";
  s.style.left = `${x}px`; s.style.top = `${y}px`;
  s.style.setProperty("--dx", `${(Math.random() - .5) * 65}px`);
  s.style.setProperty("--dy", `${-20 - Math.random() * 55}px`);
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 800);
}
function initFestiveEffects() {
  fitCanvas(introCanvas, introCtx);
  animateCanvas(introCtx, introCanvas, true);
  $("introEnterButton").addEventListener("click", () => {
    introRunning = false;
    introCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    $("introOverlay").classList.add("dismissed");
    $("enterButton").click();
  });
  document.addEventListener("pointerdown", e => {
    for (let i = 0; i < 7; i++) makeSparkle(e.clientX + (Math.random() - .5) * 36, e.clientY + (Math.random() - .5) * 28);
  }, { passive: true });
  document.addEventListener("pointermove", e => {
    if (Math.random() < .13) makeSparkle(e.clientX, e.clientY);
  }, { passive: true });
  window.addEventListener("resize", () => { fitCanvas(introCanvas, introCtx); fitCanvas(celebrationCanvas, celebrationCtx); });
}
function showDudFirecracker() {
  $("dudOverlay").classList.remove("hidden");
  // A small sputter: a few sparks, then a deliberately failed pop.
  const w = window.innerWidth, h = window.innerHeight;
  fitCanvas(celebrationCanvas, celebrationCtx);
  burst(w / 2, h / 2 + 70, 12, 1.7);
  animationFrame = requestAnimationFrame(() => animateCanvas(celebrationCtx, celebrationCanvas, false));
  setTimeout(() => { cancelAnimationFrame(animationFrame); celebrationCtx.clearRect(0, 0, w, h); animationFrame = 0; }, 1200);
}

function loadSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) return;
    history = Array.isArray(saved.history) ? saved.history : [];
    recent = Array.isArray(saved.recent) ? saved.recent : [];
    roundNumber = Number(saved.roundNumber) || 1;
    roundPlayed = Array.isArray(saved.roundPlayed) ? saved.roundPlayed : [];
    mode = saved.mode === "round" ? "round" : "repeat";
  } catch (_) {}
}
function saveSession() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ history, recent, roundNumber, roundPlayed, mode }));
}
function setMode(nextMode) {
  if (spinning) return;
  mode = nextMode;
  $("repeatModeButton").classList.toggle("selected", mode === "repeat");
  $("roundModeButton").classList.toggle("selected", mode === "round");
  modeNote.textContent = mode === "repeat"
    ? "Open Play is selected. Games may repeat. The last two results are avoided when possible."
    : `No-Repeat Round ${roundNumber} is selected. ${roundPlayed.length} of 10 games completed in this round.`;
  updateRoundStatus();
  saveSession();
}
function updateRoundStatus() {
  if (mode !== "round") {
    roundStatus.classList.add("hidden");
    spinButton.disabled = spinning;
    spinButton.textContent = "Spin the wheel";
    return;
  }
  roundStatus.classList.remove("hidden");
  roundStatus.textContent = `ROUND ${roundNumber} · ${roundPlayed.length} / 10 games selected`;
  if (roundPlayed.length === 10) {
    spinButton.disabled = true;
    spinButton.textContent = "Round complete";
  } else {
    spinButton.disabled = spinning;
    spinButton.textContent = "Spin the wheel";
  }
}
function showSection(id) {
  ["emptyResult", "gameResult", "winnerForm", "rewardPanel", "lostPanel"].forEach(key => $(key).classList.add("hidden"));
  $(id).classList.remove("hidden");
}
function chooseGame() {
  if (mode === "round") {
    const remaining = games.map((_, i) => i).filter(i => !roundPlayed.includes(i));
    return remaining[Math.floor(Math.random() * remaining.length)];
  }
  let candidates = games.map((_, i) => i).filter(i => !recent.slice(-2).includes(i));
  if (!candidates.length) candidates = games.map((_, i) => i);
  return candidates[Math.floor(Math.random() * candidates.length)];
}
function spin() {
  if (spinning) return;
  if (mode === "round" && roundPlayed.length === 10) return;
  spinning = true;
  wheelStage.classList.add("is-spinning");
  spinButton.disabled = true;
  $("repeatModeButton").disabled = true;
  $("roundModeButton").disabled = true;
  $("spinHint").textContent = "The wheel is choosing your game...";
  showSection("emptyResult");

  const index = chooseGame();
  selectedGameIndex = index;

  // The custom wheel has ten equal slices centered on the top, then clockwise.
  const sliceCenter = index * 36;
  const targetModulo = (360 - sliceCenter + 360) % 360;
  const current = ((getRotation() % 360) + 360) % 360;
  const adjustment = (targetModulo - current + 360) % 360;
  const totalRotation = getRotation() + (6 * 360) + adjustment;

  wheelImage.style.transition = "transform 5.2s cubic-bezier(0.12, 0.78, 0.12, 1)";
  wheelImage.style.transform = `rotate(${totalRotation}deg)`;
  wheelImage.dataset.rotation = String(totalRotation);

  window.setTimeout(() => {
    spinning = false;
    wheelStage.classList.remove("is-spinning");
    $("repeatModeButton").disabled = false;
    $("roundModeButton").disabled = false;
    const game = games[index];
    $("resultIndex").textContent = `GAME ${String(index + 1).padStart(2, "0")}`;
    $("gameImage").src = game.image;
    $("gameImage").alt = `${game.name} challenge`;
    $("gameTitle").textContent = game.name;
    $("gameDescription").textContent = game.description;
    showSection("gameResult");
    $("spinHint").textContent = "Your game is ready. Good luck!";
    recent.push(index);
    recent = recent.slice(-5);
    saveSession();
    updateRoundStatus();
  }, 5350);
}
function getRotation() {
  return Number(wheelImage.dataset.rotation || 0);
}
function recordResult(outcome, name = "") {
  if (selectedGameIndex === null) return;
  history.unshift({
    game: games[selectedGameIndex].name,
    outcome,
    name,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    round: roundNumber
  });
  if (mode === "round" && !roundPlayed.includes(selectedGameIndex)) {
    roundPlayed.push(selectedGameIndex);
  }
  saveSession();
  renderHistory();
  updateRoundStatus();
}
function renderHistory() {
  const list = $("historyList");
  if (!history.length) {
    list.innerHTML = '<p class="history-empty">No games played yet. The first spin is yours.</p>';
    return;
  }
  list.innerHTML = history.slice(0, 12).map((item, i) => `
    <div class="history-row">
      <span class="history-number">${String(history.length - i).padStart(2, "0")}</span>
      <div><strong>${escapeHtml(item.game)}</strong><small>${escapeHtml(item.name || "Participant")} · ${escapeHtml(item.time)} · Round ${item.round}</small></div>
      <span class="history-outcome ${item.outcome === "LOST" ? "lost" : ""}">${item.outcome}</span>
    </div>`).join("");
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
function nextParticipant() {
  selectedGameIndex = null;
  $("winnerName").value = "";
  $("nameError").textContent = "";
  showSection("emptyResult");
  $("spinHint").textContent = "The wheel will choose your next game.";
  if (mode === "round" && roundPlayed.length === 10) {
    updateRoundStatus();
    roundModal.classList.remove("hidden");
  } else {
    spinButton.disabled = false;
    spinButton.textContent = "Spin the wheel";
  }
}
$("enterButton").addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
  gameArea.classList.remove("hidden");
  gameArea.scrollIntoView({ behavior: "smooth", block: "start" });
});
$("repeatModeButton").addEventListener("click", () => setMode("repeat"));
$("roundModeButton").addEventListener("click", () => setMode("round"));
spinButton.addEventListener("click", spin);
$("wonButton").addEventListener("click", () => showSection("winnerForm"));
$("lostButton").addEventListener("click", () => {
  recordResult("LOST");
  showSection("lostPanel");
  showDudFirecracker();
});
$("saveWinnerButton").addEventListener("click", () => {
  const name = $("winnerName").value.trim();
  if (!name) {
    $("nameError").textContent = "Please enter the winner's name.";
    $("winnerName").focus();
    return;
  }
  recordResult("WON", name);
  launchFireworks(2);
  showEffectMessage("YOU WON! ✨");
  $("rewardMessage").textContent = `${name}, here's a little mithai for your win. Enjoy!`;
  showSection("rewardPanel");
});
$("dudContinueButton").addEventListener("click", () => {
  $("dudOverlay").classList.add("hidden");
  nextParticipant();
});
$("nextTurnButton").addEventListener("click", nextParticipant);
$("nextAfterLossButton").addEventListener("click", nextParticipant);
$("startNextRoundButton").addEventListener("click", () => {
  roundNumber += 1;
  roundPlayed = [];
  roundModal.classList.add("hidden");
  saveSession();
  updateRoundStatus();
  nextParticipant();
});
$("resetButton").addEventListener("click", () => {
  if (!confirm("Reset this device's game history and round progress?")) return;
  history = [];
  recent = [];
  roundNumber = 1;
  roundPlayed = [];
  selectedGameIndex = null;
  wheelStage.classList.remove("is-spinning");
  wheelImage.style.transition = "none";
  wheelImage.style.transform = "rotate(0deg)";
  wheelImage.dataset.rotation = "0";
  saveSession();
  renderHistory();
  roundModal.classList.add("hidden");
  nextParticipant();
  setMode(mode);
});

initFestiveEffects();
loadSession();
renderHistory();
setMode(mode);
