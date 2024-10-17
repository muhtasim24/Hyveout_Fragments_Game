const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Create Image objects for the player and fragments
const playerImage = new Image();
playerImage.src = 'player.png';  // Path to your player.png file
const fragmentImage = new Image();
fragmentImage.src = 'fragments.png';  // Path to your fragments.png file

// Character position and size
let character = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 50,  // Set the width of the character
  height: 50  // Set the height of the character
};

// Fragments array for the game
let fragments = [];
let fragmentSize = 30;  // Size of the fragment

// Predefined fragment positions for the landing page
let landingFragments = [
  { x: 50, y: 50 },
  { x: canvas.width - 80, y: 100 },
  { x: canvas.width / 2 - 15, y: canvas.height - 100 },
  { x: 150, y: 300 },
  { x: canvas.width - 200, y: canvas.height - 150 }
];

// Variable to track game state
let gameStarted = false;

// Function to generate random fragments at random positions (for the game)
function generateFragments(count) {
  fragments = [];
  for (let i = 0; i < count; i++) {
    fragments.push({
      x: Math.random() * (canvas.width - fragmentSize),
      y: Math.random() * (canvas.height - fragmentSize),
      collected: false
    });
  }
}

// Function to draw the fragments on the landing page (static positions)
function drawLandingFragments() {
  landingFragments.forEach(fragment => {
    ctx.drawImage(fragmentImage, fragment.x, fragment.y, fragmentSize, fragmentSize);
  });
}

// Function to draw the fragments during the game (randomized positions)
function drawFragments() {
  fragments.forEach(fragment => {
    if (!fragment.collected) {
      ctx.drawImage(fragmentImage, fragment.x, fragment.y, fragmentSize, fragmentSize);
    }
  });
}

// Function to check if the player collected a fragment
function checkFragmentCollision() {
  fragments.forEach(fragment => {
    if (!fragment.collected && isColliding(character, fragment)) {
      fragment.collected = true;  // Mark fragment as collected
    }
  });
}

// Function to detect collision between the player and a fragment
function isColliding(player, fragment) {
  return player.x < fragment.x + fragmentSize &&
         player.x + player.width > fragment.x &&
         player.y < fragment.y + fragmentSize &&
         player.y + player.height > fragment.y;
}

// Function to display the landing page
function showLandingPage() {
  ctx.fillStyle = '#008080';  // Set the background to teal
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the player character in the center of the screen
  ctx.drawImage(playerImage, canvas.width / 2 - character.width / 2, canvas.height / 2 - character.height / 2, character.width, character.height);

  // Draw the static fragments on the landing page
  drawLandingFragments();

  // Display the "Tap to Start" text
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('COLLECT THE PLASMA FRAGMENTS', canvas.width / 2, canvas.height / 2 - 100);
  ctx.fillText('TAP TO START', canvas.width / 2, canvas.height / 2 + 100);
}

// Function to start the game
function startGame() {
  gameStarted = true;  // Change game state to started
  generateFragments(5);  // Generate 5 random fragments for the game
  drawGame();  // Start the game drawing loop
}

// Function to draw the game (character and fragments)
function drawGame() {
  ctx.fillStyle = '#008080';  // Clear canvas with teal background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the player character
  ctx.drawImage(playerImage, character.x - character.width / 2, character.y - character.height / 2, character.width, character.height);

  // Draw the random fragments
  drawFragments();

  // Check for fragment collision
  checkFragmentCollision();
}

// Function to move the character
function moveCharacter(x, y) {
  character.x = x;
  character.y = y;
  drawGame();  // Redraw the game after moving the character
}

// Handle mouse click and touch events
canvas.addEventListener('click', function(event) {
  if (!gameStarted) {
    startGame();  // Start the game from the landing page
  } else {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    moveCharacter(x, y);
  }
});

canvas.addEventListener('touchstart', function(event) {
  if (!gameStarted) {
    startGame();  // Start the game from the landing page
  } else {
    const rect = canvas.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    const y = event.touches[0].clientY - rect.top;
    moveCharacter(x, y);
  }
});

// Wait for the images to load before displaying the landing page
playerImage.onload = function() {
  showLandingPage();  // Show landing page initially
};
fragmentImage.onload = function() {
  // Fragments will also be shown on the landing page
};
