// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Character starting position
let character = { x: canvas.width / 2, y: canvas.height / 2, size: 30 };

// Function to draw the character
function drawCharacter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  ctx.beginPath();
  ctx.arc(character.x, character.y, character.size, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.closePath();
}

// Function to update the character's position
function moveCharacter(x, y) {
  character.x = x;
  character.y = y;
  drawCharacter();
}

// Handle mouse click for desktops
canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  moveCharacter(x, y);
});

// Handle touch event for mobiles
canvas.addEventListener('touchstart', function(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.touches[0].clientX - rect.left;
  const y = event.touches[0].clientY - rect.top;
  moveCharacter(x, y);
});

// Initial draw
drawCharacter();
