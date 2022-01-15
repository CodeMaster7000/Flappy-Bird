const game = document.getElementById("game");
const info_box = document.getElementById("info_box");
const info_title = document.getElementById("info_title");
const info_instructions = document.getElementById("info_instructions");
const info_start = document.getElementById("info_start");
const info_end = document.getElementById("info_end");
const score = document.getElementById("score");
const block = document.getElementById("block");
const hole = document.getElementById("hole");
const sprite = document.getElementById("sprite");

const gameHeight = 500;
const holeHeight = 160;
const blockWidth = 60;
const spriteWidth = 30;
const spriteHeight = 30;

let gameActivated = false;
let counter = 0;
let jumpTimer;
let moveSprite;

function animateSprite() {
  const spriteTop = parseInt(
    window.getComputedStyle(sprite).getPropertyValue("top")
  );
  if (gameActivated && jumpTimer < 5) {
    sprite.style.top = `${spriteTop + 3}px`;
  }
  if (gameActivated && spriteTop > 0 && jumpTimer > 1) {
    sprite.style.top = `${spriteTop - 5}px`;
  }
  const blockLeft = parseInt(
    window.getComputedStyle(block).getPropertyValue("left")
  );
  const holeTop = parseInt(
    window.getComputedStyle(hole).getPropertyValue("top")
  );
  const spriteLeft = parseInt(
    window.getComputedStyle(sprite).getPropertyValue("left")
  );
  if (
    spriteTop > gameHeight - spriteHeight ||
    (spriteLeft + spriteWidth > blockLeft &&
      (spriteTop - gameHeight < holeTop ||
        spriteTop + spriteHeight - gameHeight > holeTop + holeHeight))
  ) {
    endGame();
    return;
  }
  if (jumpTimer > 1) jumpTimer--;
  moveSprite = requestAnimationFrame(animateSprite);
}

let startGame = function (e) {
  if (e.type === "click" || (e.type === "keydown" && e.keyCode === 32)) {
    counter = 0;
    gameActivated = true;
    score.innerHTML = 0;
    jumpTimer = 0;
    block.classList.add("animatedBlock");
    hole.classList.add("animatedBlock");
    score.classList.toggle("hidden");
    info_title.classList.toggle("hidden");
    info_start.classList.add("hidden");
    info_end.classList.add("hidden");
    info_instructions.classList.add("hidden");
    sprite.classList.remove("hidden");
    game.addEventListener("click", jump);
    document.removeEventListener("keydown", startGame);
    document.addEventListener("keydown", jump);
    hole.addEventListener("animationiteration", scorePoint);
    moveSprite = requestAnimationFrame(animateSprite);
  }
};

function endGame() {
  gameActivated = false;
  game.removeEventListener("click", jump);
  document.removeEventListener("keydown", jump);
  document.addEventListener("keydown", startGame);
  document.onkeydown = null;
  info_end.innerHTML = `
  Game over! Score: <br><br>
  <span class="final_score">${counter}</span> 
  <br><br>
  Click here or press space to play again`;
  sprite.style.top = 100 + "px";
  sprite.classList.add("hidden");
  score.classList.toggle("hidden");
  info_title.classList.toggle("hidden");
  info_end.classList.remove("hidden");
  block.classList.remove("animatedBlock");
  hole.classList.remove("animatedBlock");
  hole.removeEventListener("animationiteration", scorePoint);
  cancelAnimationFrame(moveSprite);
}

function scorePoint() {
  counter = counter + 1;
  score.innerHTML = counter;
  generateNextHole();
}

function generateNextHole() {
  const random = Math.floor(Math.random() * (-170 - -490 + 1) + -490);
  hole.style.top = `${random}px`;
}

let jump = function (e) {
  if (
    gameActivated === true &&
    (e.type === "click" || (e.type === "keydown" && e.keyCode === 32))
  ) {
    jumpTimer = 10;
  } else {
    return;
  }
};

info_start.addEventListener("click", startGame);
info_end.addEventListener("click", startGame);
document.addEventListener("keydown", startGame);
