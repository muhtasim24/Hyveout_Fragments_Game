const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Create Image objects for the player, fragments, and activate button
const playerImage = new Image();
playerImage.src = 'player.gif';  // Path to your player.png file
const fragmentImage = new Image();
fragmentImage.src = 'fragments.png';  // Path to your fragments.png file
// Load the button images
const buttonImage = new Image();
buttonImage.src = 'button.png'; // Image when button is not pressed
const pressedButtonImage = new Image();
pressedButtonImage.src = 'pressedButton.png'; // Image when button is pressed
// Create Image objects for start and title images
const startImage = new Image();
startImage.src = 'start.png';  // Path to your start.png file
const titleImage = new Image();
titleImage.src = 'title.png';  // Path to your title.png file

// Character position and size
let character = {
  x: 0,  // Initially, set to 0 (we'll center it dynamically)
  y: 0,
  width: 60,  // Set the width of the character
  height: 60  // Set the height of the character
};

// Fragments array to hold multiple fragments
let fragments = [];
let fragmentSize = 30;  // Size of the fragment
const totalFragments = 5;  // Total number of fragments in the game
let collectedFragments = 0;  // Number of fragments collected

// Button position and size
let activateButton = {
  x: 0,
  y: 0,
  width: 100,
  height: 50,
  pressed: false,  // Track if the button is pressed
  timer: null,  // Timer to track 100 seconds
  active: false  // Whether the player can collect fragments
};

// Variable to track game state
let gameStarted = false;

// Adjust button position when resizing the canvas
function updateButtonPosition() {
  activateButton.x = (canvas.width - activateButton.width) / 2;  // Center the button horizontally
  activateButton.y = canvas.height - activateButton.height - 20;  // Place it near the bottom
}
// Function to resize the canvas dynamically
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  updateButtonPosition();  // Ensure button is correctly positioned after resizing

  if (!gameStarted) {
    centerCharacter();  // Center the character on landing page
    showLandingPage();  // Redraw landing page after resize
  } else {
    positionActivateButton();  // Reposition the activate button after resize
    drawGame();  // Redraw game after resize
  }
}

// Function to center the character based on the canvas size
function centerCharacter() {
  character.x = canvas.width / 2 - character.width / 2;
  character.y = canvas.height / 2 - character.height / 2;
}

// Function to position the activate button at the bottom middle of the canvas
function positionActivateButton() {
  activateButton.x = canvas.width / 2 - activateButton.width / 2;
  activateButton.y = canvas.height - activateButton.height - 20;  // 20px padding from the bottom
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
    if (!fragment.collected && isColliding(character, fragment) && activateButton.pressed) {
      fragment.collected = true;  // Mark fragment as collected
      collectedFragments++;  // Increase the collected count
      console.log("Fragment collected")
    }
  });
}

// Function to detect collision between the player and a fragment or button
function isColliding(player, object) {
  return player.x < object.x + fragmentSize &&
         player.x + player.width > object.x &&
         player.y < object.y + fragmentSize &&
         player.y + player.height > object.y;
}

// Function to check if the character pressed the activate button
function checkActivateButtonCollision() {
  if (isColliding(character, activateButton)) {
    activateButton.pressed = true;  // Mark the button as pressed
    console.log("Activate button pressed")
  }
}

// Function to display the landing page
function showLandingPage() {
  ctx.fillStyle = '#008080';  // Set the background to teal
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Center the player character on the landing page
  ctx.drawImage(playerImage, character.x, character.y, character.width, character.height);

  // Draw the static fragments on the landing page
  drawLandingFragments();

  // Draw the start button (start.png) in the center
  const startWidth = 200;  // Set width of start.png image
  const startHeight = 100;  // Set height of start.png image
  const startX = (canvas.width - startWidth) / 2;  // Center horizontally
  const startY = canvas.height / 2 + 100;  // Below the player image
  ctx.drawImage(startImage, startX, startY, startWidth, startHeight);

  // Draw the title image (title.png) at the top center of the screen
  const titleWidth = 300;  // Set width of title.png image
  const titleHeight = 100;  // Set height of title.png image
  const titleX = (canvas.width - titleWidth) / 2;  // Center horizontally
  const titleY = 80;  // Distance from the top of the screen
  ctx.drawImage(titleImage, titleX, titleY, titleWidth, titleHeight);

  drawActivateButton();
}

// Wait for the images to load before displaying the landing page
startImage.onload = function() {
  showLandingPage();  // Redraw the landing page once start.png is loaded
};
titleImage.onload = function() {
  showLandingPage();  // Redraw the landing page once title.png is loaded
};


// Function to start the game
function startGame() {
  gameStarted = true;  // Change game state to started
  positionActivateButton();  // Position the activate button
  drawGame();  // Start the game drawing loop
}

// Function to draw the activate button
function drawActivateButton() {
  const buttonImageToUse = activateButton.pressed ? pressedButtonImage : buttonImage;
  
  ctx.drawImage(
    buttonImageToUse,
    activateButton.x, 
    activateButton.y, 
    activateButton.width, 
    activateButton.height
  );
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

// Function to check if the character is at the activate button position
function isCharacterAtActivateButton() {
  return character.x < activateButton.x + activateButton.width &&
         character.x + character.width > activateButton.x &&
         character.y < activateButton.y + activateButton.height &&
         character.y + character.height > activateButton.y;
}

// Function to handle the activate button press and timer logic
function handleActivateButton() {
  // Check if the character is at the button and if the button isn't already pressed
  if (isCharacterAtActivateButton() && !activateButton.pressed) {
    activateButton.pressed = true;   // Mark the button as pressed
    activateButton.active = true;    // Allow fragment collection
    console.log("Activate button pressed! Timer started.");

    // Clear any previous timers to avoid overlapping
    if (activateButton.timer) {
      clearTimeout(activateButton.timer);
    }

    // Start the timer (e.g., 200 seconds)
    activateButton.timer = setTimeout(() => {
      activateButton.pressed = false;   // Reset button state after time ends
      activateButton.active = false;    // Disable fragment collection
      console.log("Activate button reset after 200 seconds. You need to press it again!");

      // Reset button color (or any visual indicator)
      drawGame();  // Redraw the game with reset button state
    }, 3000);  // 3 seconds (adjust time as needed)
  }
}
  


function moveCharacter(x, y) {
  character.x = x - character.width / 2;  // Adjust so the character stays centered on the touch
  character.y = y - character.height / 2;

  // // Check if the character presses the activate button
  // checkActivateButtonCollision();

  // // Check for fragment collection if the button is pressed
  // if (activateButton.pressed) {
  //   checkFragmentCollision();  // Check if any fragments are collected
  // }

  drawGame();  // Redraw the game after moving the character
}

let targetPosition = { x: character.x, y: character.y };  // The position the character will move to
let walkingSpeed = 5;  // Speed of walking, you can adjust this

// Move character gradually toward the target position
function moveCharacterTo(x, y) {
  targetPosition.x = x - character.width / 2;  // Target position is centered on the click/tap
  targetPosition.y = y - character.height / 2;

  // // Check if the character is now at the activate button
  // if (isCharacterAtActivateButton()) {
  //   activateButton.pressed = true;  // Set the button as pressed
  //   console.log("Player at Activation button");  // Debug log
  // } else {
  //   activateButton.pressed = false; // Reset button state if not at the button
  // }
  drawGame();
}

// Function to update the character's position each frame
function updateCharacterPosition() {
  let dx = targetPosition.x - character.x;
  let dy = targetPosition.y - character.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  // Move the character only if it's far enough from the target
  if (distance > walkingSpeed) {
    character.x += (dx / distance) * walkingSpeed;
    character.y += (dy / distance) * walkingSpeed;
  } else {
    // When close enough to the target, snap to the final position
    character.x = targetPosition.x;
    character.y = targetPosition.y;
  }
}

// Function to draw the game (including character, fragments, progress bar, and activate button)
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set the background color
  ctx.fillStyle = '#008080';  // Teal background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the player character
  ctx.drawImage(playerImage, character.x, character.y, character.width, character.height);

  // Draw the random fragments
  drawFragments();

  // Draw the progress bar
  drawProgressBar();

  // Draw the activate button
  drawActivateButton();

  // Check for fragment collection if the button is active (not when character moves away)
  if (activateButton.active) {
    checkFragmentCollision(); // Check if fragments can be collected
  }
}



// Main game loop for continuous animation
function gameLoop() {
  if (gameStarted) {
    updateCharacterPosition();  // Update character position smoothly
    drawGame();  // Render the game state
  } else {
    showLandingPage();  // Show landing page if the game hasn't started
  }
  requestAnimationFrame(gameLoop);  // Continue the animation
}

gameLoop();


// Handle mouse click and touch events
canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Check if the click was within the activate button area
  if (isCharacterAtActivateButton()) {
    handleActivateButton();  // Handle button press if the character is at the button
  }

  // If the game hasn't started, start it
  if (!gameStarted) {
    startGame();  // Start the game if it hasn't started
    console.log("Game started!");  // Debug log
  } else {
    // Move the character to the clicked position
    moveCharacterTo(x, y);
  }
});

canvas.addEventListener('touchstart', function(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.touches[0].clientX - rect.left;
  const y = event.touches[0].clientY - rect.top;

  // Check if the click was within the activate button area
  if (isCharacterAtActivateButton()) {
    handleActivateButton();  // Handle button press if the character is at the button
  }

  // If the game hasn't started, start it
  if (!gameStarted) {
    startGame();  // Start the game if it hasn't started
    console.log("Game started!");  // Debug log
  } else {
    // Move the character to the clicked position
    moveCharacterTo(x, y);
  }
});

// Function to start the game
function startGame() {
  gameStarted = true;  // Change game state to started
  generateFragments(5);  // Generate random fragments
  drawGame();  // Start the game drawing loop
}




// Wait for the images to load before displaying the landing page
playerImage.onload = function() {
  centerCharacter();  // Ensure the character is centered initially
  showLandingPage();  // Show landing page initially
};
fragmentImage.onload = function() {
  // Fragments will also be shown on the landing page
};
activateImage.onload = function() {
  // Activate button image is ready
};
