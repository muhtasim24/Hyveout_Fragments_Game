const gameArea = document.getElementById('game-area');
const progressBar = document.getElementById('progress-bar');

// Landing page elements
const titleElement = document.createElement('img');
titleElement.src = 'gifs/title.png';
titleElement.id = 'title'; // Add an ID for styling
titleElement.style.position = 'absolute';
titleElement.style.width = '30vw';
titleElement.style.top = '10vh';
titleElement.style.left = '50%';
titleElement.style.transform = 'translateX(-50%)';
gameArea.appendChild(titleElement);

const startButtonElement = document.createElement('img');
startButtonElement.src = 'gifs/start.png';
startButtonElement.id = 'start-button'; // Add an ID for styling
startButtonElement.style.position = 'absolute';
startButtonElement.style.width = '20vw';
startButtonElement.style.height = '10vh';
startButtonElement.style.top = '70%';
startButtonElement.style.left = '50%';
startButtonElement.style.transform = 'translate(-50%, -50%)';
gameArea.appendChild(startButtonElement);

let gameStarted = false;
let canMoveCharacter = false;
let firstClick = true; // Flag to detect the first click

// Spawning exactly count crystals
// Spawn crystals directly for landing page visibility

// Initialize player on load
const characterGif = 'gifs/characterleft.gif';
const characterWidth = 8;
const characterHeight = 10;

const characterElement = document.createElement('img');
characterElement.src = characterGif;
characterElement.style.position = 'absolute';
characterElement.style.width = `${characterWidth}vw`;
characterElement.style.height = `${characterHeight}vh`;
positionCharacter();
gameArea.appendChild(characterElement);

// Initialize lightfield element
const lightfieldGif = 'gifs/lightfield.gif'; // Path to your lightfield GIF
const lightfieldElement = document.createElement('img');
lightfieldElement.src = lightfieldGif;
lightfieldElement.style.position = 'absolute';
lightfieldElement.style.width = '15vw'; // Adjust size as needed
lightfieldElement.style.height = '15vh'; // Adjust size as needed
lightfieldElement.style.visibility = 'hidden'; // Initially hidden
gameArea.appendChild(lightfieldElement);

// Crystal settings for responsiveness
const gifs = ['gifs/crystal.gif'];
const crystalWidth = 10;
const crystalHeight = 10;
const crystalElements = [];
function spawnGIF(count) {
    for (let i = 0; i < count; i++) {
        const gifElement = document.createElement('img');
        gifElement.src = gifs[0];
        gifElement.style.position = 'absolute';
        gifElement.style.width = `${crystalWidth}vw`;
        gifElement.style.height = `${crystalHeight}vh`;

        const maxX = window.innerWidth - (crystalWidth * window.innerWidth / 100);
        const maxY = window.innerHeight - (crystalHeight * window.innerHeight / 100);

        gifElement.style.left = `${Math.random() * maxX}px`;
        gifElement.style.top = `${Math.random() * maxY}px`;

        gameArea.appendChild(gifElement);
        crystalElements.push(gifElement); // Keep track for future interactions
    }
}
spawnGIF(5);

function startGame() {
    gameArea.removeChild(titleElement);
    gameArea.removeChild(startButtonElement);

    gameStarted = true;
    canMoveCharacter = true;
}


// Modify the existing detectCollision function
function detectCollision() {
    if (!gameStarted || !buttonActive) return; // Only detect collision if button is active

    const characterRect = characterElement.getBoundingClientRect();
    for (let i = crystalElements.length - 1; i >= 0; i--) {
        const crystalRect = crystalElements[i].getBoundingClientRect();
        if (
            characterRect.x < crystalRect.x + crystalRect.width &&
            characterRect.x + characterRect.width > crystalRect.x &&
            characterRect.y < crystalRect.y + crystalRect.height &&
            characterRect.y + characterRect.height > crystalRect.y
        ) {
            gameArea.removeChild(crystalElements[i]);
            crystalElements.splice(i, 1);
            collectedCrystals++;
            updateProgressBar(); // Call the update function when a crystal is collected
        }
    }
}


function moveCharacter(targetX, targetY) {
    if (!canMoveCharacter) return;

    const moveSpeed = 5;
    let characterX = parseFloat(characterElement.style.left);
    let characterY = parseFloat(characterElement.style.top);

    const maxX = window.innerWidth - (characterWidth * window.innerWidth / 100);
    const maxY = window.innerHeight - (characterHeight * window.innerHeight / 100);

    targetX = Math.max(0, Math.min(targetX, maxX));
    targetY = Math.max(0, Math.min(targetY, maxY));

    const move = () => {
        const deltaX = targetX - characterX;
        const deltaY = targetY - characterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < moveSpeed) {
            characterElement.style.left = `${targetX}px`;
            characterElement.style.top = `${targetY}px`;
            detectCollision();
            detectButtonCollision(); // Check for button collision
            updateLightfieldPosition(); // Update lightfield position
            return;
        }

        characterX += (deltaX / distance) * moveSpeed;
        characterY += (deltaY / distance) * moveSpeed;
        characterX = Math.max(0, Math.min(characterX, maxX));
        characterY = Math.max(0, Math.min(characterY, maxY));

        characterElement.style.left = `${characterX}px`;
        characterElement.style.top = `${characterY}px`;
        detectCollision();
        detectButtonCollision(); // Check for button collision
        updateLightfieldPosition(); // Update lightfield position
        requestAnimationFrame(move);
    };

    move();
}

// Update lightfield position to center around the character
function updateLightfieldPosition() {
    const characterRect = characterElement.getBoundingClientRect();
    lightfieldElement.style.left = `${characterRect.left - (lightfieldElement.offsetWidth - characterRect.width) / 2}px`;
    lightfieldElement.style.top = `${characterRect.top - (lightfieldElement.offsetHeight - characterRect.height) / 2}px`;
}

function positionCharacter() {
    const centerX = (window.innerWidth - (characterWidth * window.innerWidth / 100)) / 2;
    const centerY = (window.innerHeight - (characterHeight * window.innerHeight / 100)) / 2;
    characterElement.style.left = `${centerX}px`;
    characterElement.style.top = `${centerY}px`;
}

positionCharacter();
gameArea.appendChild(characterElement);

window.addEventListener('resize', () => {
    positionCharacter();
    repositionCrystals();
});

function repositionCrystals() {
    for (let i = 0; i < crystalElements.length; i++) {
        const maxX = window.innerWidth - (crystalWidth * window.innerWidth / 100);
        const maxY = window.innerHeight - (crystalHeight * window.innerHeight / 100);

        crystalElements[i].style.left = `${Math.random() * maxX}px`;
        crystalElements[i].style.top = `${Math.random() * maxY}px`;
    }
}

// Initialize button element
const buttonActiveGif = 'gifs/pressedButton.png'; // Active button image
const buttonInactiveGif = 'gifs/button.png'; // Inactive button image
let buttonActive = false; // Flag to check if button is active

const buttonElement = document.createElement('img');
buttonElement.src = buttonInactiveGif;
buttonElement.style.position = 'absolute';
buttonElement.style.width = '10vw';
buttonElement.style.height = '5vh';
buttonElement.style.bottom = '2vh';
buttonElement.style.left = '50%';
buttonElement.style.transform = 'translateX(-50%)';
gameArea.appendChild(buttonElement);

// Detect button collision
function detectButtonCollision() {
    if (!gameStarted || !canMoveCharacter) return;

    const characterRect = characterElement.getBoundingClientRect();
    const buttonRect = buttonElement.getBoundingClientRect();

    if (
        characterRect.x < buttonRect.x + buttonRect.width &&
        characterRect.x + characterRect.width > buttonRect.x &&
        characterRect.y < buttonRect.y + buttonRect.height &&
        characterRect.y + characterRect.height > buttonRect.y
    ) {
        // Character has collided with button
        activateButton(); // Call function to activate button
    }
}

// Function to activate the button
function activateButton() {
    if (buttonActive) return; // Do not activate if already active

    buttonActive = true; // Set button active
    buttonElement.src = buttonActiveGif; // Change button image to active
    lightfieldElement.style.visibility = 'visible'; // Show lightfield

    // Allow crystal collection for a limited time
    setTimeout(() => {
        deactivateButton(); // Deactivate after timeout
    }, 3000); // 5 seconds
}

// Function to deactivate the button
function deactivateButton() {
    buttonActive = false; // Set button inactive
    buttonElement.src = buttonInactiveGif; // Change button image back to inactive
    lightfieldElement.style.visibility = 'hidden'; // Hide lightfield
}

const totalCrystals = 5; // Total number of crystals to collect
let collectedCrystals = 0; // Number of crystals collected

// Function to update the progress bar
function updateProgressBar() {
    const progressBarElement = document.getElementById('progress-bar');
    const progress = (collectedCrystals / totalCrystals) * 100; // Calculate progress percentage
    progressBarElement.style.width = `${progress}%`; // Update the width of the progress bar
}

// Main game loop to detect collisions
function gameLoop() {
    if (gameStarted) {
        detectButtonCollision(); // Check for button collision on each frame
    }
    requestAnimationFrame(gameLoop); // Continue the loop
}

// Event listener for clicking the game area
gameArea.addEventListener('click', (event) => {
    if (!gameStarted) {
        startGame(); // Start game on first click
    } else if (canMoveCharacter) {
        const rect = gameArea.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        moveCharacter(clickX, clickY);
    }
});

// Event listener for tapping the game area
gameArea.addEventListener('touchstart', (event) => {
  if (!gameStarted) {
      startGame(); // Start game on first click
  } else if (canMoveCharacter) {
      const rect = gameArea.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;
      moveCharacter(clickX, clickY);
  }
});

