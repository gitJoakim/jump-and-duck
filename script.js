// Character and obstacles
const emptySpace = String.fromCodePoint(0x2800);
const topBlock = "▀";
const middleBlock = "■";
const bottomBlock = "▄";
const bottomObstacle = "▲";
const topObstacle = "▼";

// Game state
let currentBlock = middleBlock;
let titleArray = [
	emptySpace,
	emptySpace,
	emptySpace,
	currentBlock,
	emptySpace,
	emptySpace,
	emptySpace,
	emptySpace,
	emptySpace,
	emptySpace,
	emptySpace,
	emptySpace,
	emptySpace,
	emptySpace,
	emptySpace,
];
let obstacleIndex = titleArray.length - 1;
let currentObstacle = "";
let actionIntervalCount = 0;
let currentAction = "nothing";
let gameIsRunning = false;
let countdownActive = false;
let objectsSpawnedCounter = 0;

// Title update
function updateTitle() {
	let newTitle = "";
	for (let i = 0; i < titleArray.length; i++) {
		newTitle += titleArray[i];
	}
	document.title = newTitle;
}

// Player actions
function jump() {
	currentAction = "jump";
	actionIntervalCount = 3;
	currentBlock = topBlock;
}

function duck() {
	currentAction = "duck";
	actionIntervalCount = 3;
	currentBlock = bottomBlock;
}

// Obstacle functions
function spawnObstacle(type) {
	obstacleIndex = titleArray.length - 1;
	currentObstacle = type;
}

function moveObstacle() {
	if (obstacleIndex >= 0) {
		if (obstacleIndex < titleArray.length && obstacleIndex !== 3) {
			titleArray[obstacleIndex] = emptySpace;
		}

		obstacleIndex--;

		if (obstacleIndex >= 0 && obstacleIndex !== 3) {
			titleArray[obstacleIndex] = currentObstacle;
		} else if (obstacleIndex < 0) {
			currentObstacle = "";
		}
	}
}

// Countdown
function startCountdown() {
	countdownActive = true;
	let countdownSteps = [
		emptySpace.repeat(3) + "Ready",
		emptySpace.repeat(3) + "Set",
		emptySpace.repeat(3) + "Go!",
	];

	let step = 0;

	const countdownInterval = setInterval(() => {
		if (step < countdownSteps.length) {
			document.title = countdownSteps[step];
			step++;
		} else {
			clearInterval(countdownInterval);
			countdownActive = false;
			gameIsRunning = true; // start actual game
		}
	}, 400);
}

// Game over
function gameOver() {
	let points = Math.floor(Math.sin(objectsSpawnedCounter / 5) * Math.PI * 10);
	alert(
		`GAME OVER!\nYou got: ${points} points!\nTry again to beat your score!`
	);
	location.reload();
}

// Key inputs
window.addEventListener("keydown", (event) => {
	switch (event.key) {
		case "ArrowUp":
			newDirection = "up";
			jump();
			break;
		case "ArrowDown":
			newDirection = "down";
			duck();
			break;
		case " ": // space
			if (!gameIsRunning && !countdownActive) {
				startCountdown();
			}
			return;
		default:
			return;
	}
});

// Game loop
setInterval(() => {
	if (gameIsRunning) {
		// Spawn obstacles when there are none
		if (currentObstacle === "") {
			objectsSpawnedCounter++;
			if (Math.random() < 0.5) {
				spawnObstacle(topObstacle);
			} else {
				spawnObstacle(bottomObstacle);
			}
		}

		// Collision detection
		if (obstacleIndex === 4 && currentObstacle) {
			let requiredAction = currentObstacle === topObstacle ? "duck" : "jump";

			if (currentAction !== requiredAction) {
				gameIsRunning = false;
				gameOver();
			}
		}

		// reset player block after action
		if (actionIntervalCount > 0) {
			actionIntervalCount--;
			if (actionIntervalCount === 0) {
				currentBlock = middleBlock;
				currentAction = "nothing";
			}
		}
		titleArray[3] = currentBlock;
		moveObstacle();
		updateTitle();
	}
}, 200);
