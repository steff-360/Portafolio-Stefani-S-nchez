const menuToggle = document.querySelector(".menu-toggle");
const mainMenu = document.querySelector("#main-menu");
const projectGrid = document.querySelector("#project-grid");
const gameStartButton = document.querySelector("#game-start");
const gameCells = [...document.querySelectorAll(".game-cell")];
const gameScore = document.querySelector("#game-score");
const gameTime = document.querySelector("#game-time");
const gameBest = document.querySelector("#game-best");
const gameProgress = document.querySelector("#game-progress");
const gameMessage = document.querySelector("#game-message");
document.querySelector("#year").textContent = new Date().getFullYear();

let gameTimer = null;
let targetTimer = null;
let gameSeconds = 15;
let score = 0;
let targetIndex = -1;
let gameIsActive = false;

function clearGameTarget() {
  gameCells.forEach((cell, index) => {
    cell.classList.remove("is-target", "is-miss");
    cell.setAttribute("aria-label", `Casilla ${index + 1}`);
  });
}

function moveGameTarget() {
  clearGameTarget();
  const nextIndex = Math.floor(Math.random() * gameCells.length);
  targetIndex = nextIndex === targetIndex ? (nextIndex + 1) % gameCells.length : nextIndex;
  gameCells[targetIndex].classList.add("is-target");
  gameCells[targetIndex].setAttribute("aria-label", `Objetivo, casilla ${targetIndex + 1}`);
}

function readBestScore() {
  try {
    return Number(localStorage.getItem("stefaniPortfolioBest") || 0);
  } catch {
    return 0;
  }
}

function finishMiniGame() {
  gameIsActive = false;
  clearInterval(gameTimer);
  clearInterval(targetTimer);
  clearGameTarget();
  targetIndex = -1;
  const previousBest = readBestScore();
  const bestScore = Math.max(previousBest, score);
  try {
    localStorage.setItem("stefaniPortfolioBest", String(bestScore));
  } catch {
    // The game remains playable when browser storage is unavailable.
  }
  gameBest.textContent = String(bestScore).padStart(2, "0");
  gameStartButton.textContent = "Jugar otra vez";
  gameMessage.textContent = score > previousBest
    ? `¡Nuevo récord! Puntuación: ${score}.`
    : `Partida terminada. Puntuación: ${score}.`;
}

function startMiniGame() {
  clearInterval(gameTimer);
  clearInterval(targetTimer);
  gameIsActive = true;
  gameSeconds = 15;
  score = 0;
  targetIndex = -1;
  gameScore.textContent = "00";
  gameTime.textContent = String(gameSeconds).padStart(2, "0");
  gameProgress.style.width = "100%";
  gameStartButton.textContent = "Reiniciar partida";
  gameMessage.textContent = "¡A jugar!";
  moveGameTarget();
  targetTimer = setInterval(moveGameTarget, 760);
  gameTimer = setInterval(() => {
    gameSeconds -= 1;
    gameTime.textContent = String(gameSeconds).padStart(2, "0");
    gameProgress.style.width = `${(gameSeconds / 15) * 100}%`;
    if (gameSeconds <= 0) finishMiniGame();
  }, 1000);
}

gameStartButton.addEventListener("click", startMiniGame);
gameCells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (!gameIsActive) return;
    if (index === targetIndex) {
      score += 1;
      gameScore.textContent = String(score).padStart(2, "0");
      moveGameTarget();
      return;
    }
    cell.classList.add("is-miss");
    setTimeout(() => cell.classList.remove("is-miss"), 180);
  });
});

gameBest.textContent = String(readBestScore()).padStart(2, "0");

const featuredProjects = [
  {
    title: "API de gestión de postulaciones",
    description: "API REST para candidatos, vacantes y postulaciones; calcula puntuación y prioridad e incluye pruebas automatizadas.",
    technologies: "Node.js · Express · PostgreSQL · Jest",
    url: "https://github.com/steff-360/Prueba-diagnostica-/tree/main/job-applications-api"
  },
  {
    title: "TechZone · Inventario con PostgreSQL",
    description: "Base de datos relacional para inventario y ventas, con modelo entidad-relación, normalización, scripts SQL y consultas.",
    technologies: "PostgreSQL · SQL",
    url: "https://github.com/steff-360/Examen-postgres"
  },
  {
    title: "CampusLands CLI ESM",
    description: "Aplicación de consola para agregar, listar, buscar y eliminar campers, con persistencia de datos en JSON.",
    technologies: "JavaScript · Node.js · ESM",
    url: "https://github.com/steff-360/new"
  },
  {
    title: "Algodones Maravilla · La Fábrica",
    description: "Juego arcade para navegador con niveles, puntuación, vidas y un modo runner adicional.",
    technologies: "JavaScript · HTML · CSS",
    url: "https://github.com/steff-360/primera-versi-n"
  },
  {
    title: "Animación web de flores",
    description: "Práctica responsive de animación con HTML y CSS/Sass, inspirada en el trabajo de Nilver TI, con crédito en el repositorio.",
    technologies: "HTML · CSS · Sass",
    url: "https://github.com/steff-360/flowers"
  }
];

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isExpanded);
});

function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  mainMenu.classList.toggle("is-open", isOpen);
}

mainMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenuOpen(false);
  }
});

document.addEventListener("click", (event) => {
  if (!mainMenu.contains(event.target) && !menuToggle.contains(event.target)) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

function makeProjectCard(project, index) {
  const card = document.createElement("article");
  card.className = "project-card";

  const meta = document.createElement("div");
  meta.className = "project-meta";
  const rank = document.createElement("span");
  rank.className = "project-rank";
  rank.textContent = `PROYECTO 0${index + 1}`;
  const language = document.createElement("span");
  language.textContent = project.technologies;
  meta.append(rank, language);

  const title = document.createElement("h3");
  title.textContent = project.title;
  const description = document.createElement("p");
  description.textContent = project.description;

  const bottom = document.createElement("div");
  bottom.className = "project-bottom";
  const link = document.createElement("a");
  link.className = "project-link";
  link.href = project.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Ver código en GitHub ↗";
  bottom.append(link);

  card.append(meta, title, description, bottom);
  return card;
}

projectGrid.replaceChildren(...featuredProjects.map(makeProjectCard));
projectGrid.setAttribute("aria-busy", "false");