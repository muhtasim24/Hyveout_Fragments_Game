const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Create Image objects for the player and fragments
const playerImage = new Image();
playerImage.src = 'player.png';  // Path to your player.png file
const fragmentImage = new Image();
fragmentImage.src = 'fragments.png';  // Path to your fragments.png file

// Character position and size
let character = {
  x: 0,  // Initially, set to 0 (we'll center it dynamically)
  y: 0,
  width: 50,  // Set the width of the character
  height: 50  // Set the height of the character
};

// Fragments array to hold multiple fragments
let fragments = [];
let fragmentSize = 30;  // Size of the fragment
const totalFragments = 5;  // Total number of fragments in the game
let collectedFragments = 0;  // Number of fragments collected

// Variable to track game state
let gameStarted = false;

// Function to resize the canvas dynamically
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  if (!gameStarted) {
    centerCharacter();  // Center the character on landing page
    showLandingPage();  // Redraw landing page after resize
  } else {
    drawGame();  // Redraw game after resize
  }
}

// Function to center the character based on the canvas size
function centerCharacter() {
  character.x = canvas.width / 2 - character.width / 2;
  character.y = canvas.height / 2 - character.height / 2;
}

// Resize the canvas to fit the screen
window.addEventListener('resize', resizeCanvas);
resizeCanvas();  // Initial canvas size setup

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

// Generate random fragment positions before landing page is displayed
generateFragments(totalFragments);  // Generate fragments

// Function to draw the fragments on the landing page (static positions)
function drawLandingFragments() {
  fragments.forEach(fragment => {
    ctx.drawImage(fragmentImage, fragment.x, fragment.y, fragmentSize, fragmentSize);
  });
}

// Function to draw the fragments during the game (same positions as landing page)
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
      collectedFragments++;  // Increment the collected fragments count
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

  // Center the player character on the landing page
  ctx.drawImage(playerImage, character.x, character.y, character.width, character.height);

  // Draw the static fragments on the landing page
  drawLandingFragments();

  // Display the "Tap to Start" text
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Tap to Start', canvas.width / 2, canvas.height / 2 + 100);
}

// Function to start the game
function startGame() {
  gameStarted = true;  // Change game state to started
  drawGame();  // Start the game drawing loop
}

// Function to draw the progress bar
function drawProgressBar() {
  const progressBarWidth = 200;
  const progressBarHeight = 30;
  const progressBarX = (canvas.width / 2) - (progressBarWidth / 2);
  const progressBarY = 20;

  // Draw the progress bar background
  ctx.fillStyle = '#ddd';
  ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

  // Calculate and draw the filled portion of the progress bar
  const fillWidth = (collectedFragments / totalFragments) * progressBarWidth;
  ctx.fillStyle = '#76C7C0';  // A teal-like color
  ctx.fillRect(progressBarX, progressBarY, fillWidth, progressBarHeight);

  // Draw the text in the middle of the progress bar
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${collectedFragments}/${totalFragments}`, progressBarX + progressBarWidth / 2, progressBarY + progressBarHeight / 2 + 7);
}

// Function to draw the game (character, fragments, and progress bar)
function drawGame() {
  ctx.fillStyle = '#008080';  // Clear canvas with teal background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the player character
  ctx.drawImage(playerImage, character.x, character.y, character.width, character.height);

  // Draw the random fragments (same positions as on landing page)
  drawFragments();

  // Check for fragment collision
  checkFragmentCollision();

  // Draw the progress bar
  drawProgressBar();
}

// Function to move the character
function moveCharacter(x, y) {
  character.x = x - character.width / 2;  // Adjust so the character stays centered on the touch
  character.y = y - character.height / 2;
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
  centerCharacter();  // Ensure the character is centered initially
  showLandingPage();  // Show landing page initially
};
fragmentImage.onload = function() {
  // Fragments will also be shown on the landing page
};
