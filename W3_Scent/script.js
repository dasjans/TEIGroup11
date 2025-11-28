// Extracted from index.html <script> block
// ----------------------------
// Game data (EDIT THIS PART)
// ----------------------------
const gameData = {
	categories: [
		{
			id: 'locations',
			name: 'Places / Buildings',
			description: 'Spaces you can stand in or move through.',
			pairs: [
				{
					id: 'bakery',
					answer: 'Bakery',
					jars: [2, 3],
					scentLabels: ['Caramel', 'Vanilla']
				},
				{
					id: 'farm',
					answer: 'Farm',
					jars: [4, 5],
					scentLabels: ['Hay', 'Beeswax']
				},
				{
					id: 'italian-restaurant',
					answer: 'Italian Restaurant',
					jars: [6, 7],
					scentLabels: ['Garlic', 'Thyme']
				},
				{
					id: 'christmas-market',
					answer: 'Christmas Market',
					jars: [8, 9],
					scentLabels: ['Cinnamon', 'Peppermint']
				},
				{
					id: 'library',
					answer: 'Library',
					jars: [17, 20],
					scentLabels: ['Trees/Wood', 'Leather']
				}
			]
		},
		{
			id: 'food-drink',
			name: 'Food & Drinks',
			description: 'Edible things and beverages.',
			pairs: [
				{
					id: 'pina-colada',
					answer: 'Pina Colada',
					jars: [10, 11],
					scentLabels: ['Coconut', 'Pineapple']
				},
				{
					id: 'candy-cane',
					answer: 'Candy Cane',
					jars: [9, 3],
					scentLabels: ['Peppermint', 'Vanilla']
				},
				{
					id: 'soup',
					answer: 'Soup',
					jars: [12, 13],
					scentLabels: ['Carrot', 'Celery']
				},
				{
					id: 'bbq',
					answer: 'BBQ',
					jars: [6, 14],
					scentLabels: ['Garlic', 'Chili']
				},
				{
					id: 'cinnamon-bun',
					answer: 'Cinnamon Bun',
					jars: [8, 2],
					scentLabels: ['Cinnamon', 'Caramel']
				}
			]
		},
		{
			id: 'things',
			name: 'Objects / Things',
			description: 'Everyday objects or scenes.',
			pairs: [
				{
					id: 'swimming-pool',
					answer: 'Swimming Pool',
					jars: [15, 16],
					scentLabels: ['Fresh Water', 'Chlorine']
				},
				{
					id: 'campfire',
					answer: 'Campfire',
					jars: [1, 17],
					scentLabels: ['Burnt Wood', 'Trees/Wood']
				},
				{
					id: 'dish-soap',
					answer: 'Dish Soap',
					jars: [18, 19],
					scentLabels: ['Lavender', 'Lemon']
				},
				{
					id: 'house-cleaner',
					answer: 'House Cleaner',
					jars: [16, 19],
					scentLabels: ['Chlorine', 'Lemon']
				}
			]
		}
	],
	roundDurationSeconds: 120
};

// ----------------------------
// State
// ----------------------------
let currentCategory = null;
let currentPair = null;
let timerSecondsRemaining = gameData.roundDurationSeconds;
let timerIntervalId = null;
let timerRunning = false;
let timerFinished = false;
let roundsPlayed = 0;
let roundsCorrect = 0;

let players = [];
let currentRoundPlayers = [];

// ----------------------------
// DOM Elements
// ----------------------------
const categoryButtonsContainer = document.getElementById('category-buttons');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const roundInfo = document.getElementById('round-info');
const roundCategoryLabel = document.getElementById('round-category-label');
const jarRow = document.getElementById('jar-row');
const timerDisplay = document.getElementById('timer-display');
const newPairBtn = document.getElementById('new-pair-btn');
const resetBtn = document.getElementById('reset-btn');
const startBtn = document.getElementById('start-btn');
const stopEarlyBtn = document.getElementById('stop-early-btn');
const revealPanel = document.getElementById('reveal-panel');
const revealHeading = document.getElementById('reveal-heading');
const revealSub = document.getElementById('reveal-sub');
const revealAnswerBtn = document.getElementById('reveal-answer-btn');
const answerText = document.getElementById('answer-text');
const answerMeta = document.getElementById('answer-meta');
const answerActions = document.getElementById('answer-actions');
const correctBtn = document.getElementById('correct-btn');
const incorrectBtn = document.getElementById('incorrect-btn');
const roundsCountLabel = document.getElementById('rounds-count');
const correctCountLabel = document.getElementById('correct-count');

// Category description area (updates from category.description)
const categoryDescriptionEl = document.getElementById('category-description');

const rulesCard = document.getElementById('rules-card');
const rulesToggleBtn = document.getElementById('rules-toggle-btn');

// Player round card
const playerRoundCard = document.getElementById('player-round-card');
const playerANameEl = document.getElementById('player-a-name');
const playerBNameEl = document.getElementById('player-b-name');

// Overlay elements
const playerOverlay = document.getElementById('player-overlay');
const playerInputsContainer = document.getElementById('player-inputs');
const addPlayerBtn = document.getElementById('add-player-btn');
const startGameBtn = document.getElementById('start-game-btn');
const overlayError = document.getElementById('overlay-error');

// ----------------------------
// Helpers
// ----------------------------
function formatTime(seconds) {
	const m = Math.floor(seconds / 60).toString().padStart(2, '0');
	const s = (seconds % 60).toString().padStart(2, '0');
	return `${m}:${s}`;
}

function setTimer(seconds) {
	timerSecondsRemaining = seconds;
	timerDisplay.textContent = formatTime(timerSecondsRemaining);
}

function clearTimer() {
	if (timerIntervalId !== null) {
		clearInterval(timerIntervalId);
		timerIntervalId = null;
	}
	timerRunning = false;
	if (stopEarlyBtn) stopEarlyBtn.disabled = true;
}

function updateScoreboard() {
	roundsCountLabel.textContent = roundsPlayed;
	correctCountLabel.textContent = roundsCorrect;
}

function pickRandomPair(category) {
	const pairs = category.pairs;
	if (!pairs || pairs.length === 0) return null;
	const idx = Math.floor(Math.random() * pairs.length);
	return pairs[idx];
}

function updateStatus(text, live = false) {
	statusText.textContent = text;
	if (live) {
		statusDot.classList.add('live');
	} else {
		statusDot.classList.remove('live');
	}
}

function renderRoundInfo() {
	if (!currentCategory || !currentPair) {
		roundInfo.style.display = 'none';
		return;
	}
	roundInfo.style.display = 'flex';
	roundCategoryLabel.textContent = `Category: ${currentCategory.name}`;
	jarRow.innerHTML = '';
	currentPair.jars.forEach((jarNum, index) => {
		const pill = document.createElement('div');
		pill.className = 'jar-pill';
		const labelSpan = document.createElement('span');
		labelSpan.className = 'label';
		labelSpan.textContent = `Jar ${index + 1}`;
		const valueSpan = document.createElement('span');
		valueSpan.className = 'value';
		valueSpan.textContent = `#${jarNum}`;
		pill.appendChild(labelSpan);
		pill.appendChild(valueSpan);
		jarRow.appendChild(pill);
	});
}

function hideRevealPanel() {
	revealPanel.style.display = 'none';
	answerText.style.display = 'none';
	answerMeta.style.display = 'none';
	answerActions.style.display = 'none';
	revealAnswerBtn.style.display = 'inline-flex';
}

function resetRound(hardResetCategory = false) {
	clearTimer();
	setTimer(gameData.roundDurationSeconds);
	timerFinished = false;
	hideRevealPanel();

	if (hardResetCategory) {
		currentCategory = null;
		currentPair = null;
		roundInfo.style.display = 'none';
		if (categoryDescriptionEl) {
			categoryDescriptionEl.style.display = 'none';
			categoryDescriptionEl.textContent = '';
		}
		const buttons = categoryButtonsContainer.querySelectorAll('.category-btn');
		buttons.forEach(btn => btn.classList.remove('active'));
		updateStatus('Select a category to start a round.', false);
		newPairBtn.disabled = true;
		resetBtn.disabled = true;
		startBtn.disabled = true;
		playerRoundCard.style.display = 'none';
	} else {
		currentPair = null;
		roundInfo.style.display = 'none';
		if (currentCategory) {
			updateStatus('Press “New pair” to pick another combination in this category.', false);
			newPairBtn.disabled = false;
			resetBtn.disabled = false;
			startBtn.disabled = true;
		}
	}
}

function startTimer() {
	if (!currentPair || !currentCategory) return;
	if (timerRunning) return;

	timerRunning = true;
	timerFinished = false;
	hideRevealPanel();
	updateStatus('Timer running — describe your scents and guess together!', true);

	newPairBtn.disabled = true;
	resetBtn.disabled = false;
	startBtn.disabled = true;
	stopEarlyBtn.disabled = false;

	timerIntervalId = setInterval(() => {
		timerSecondsRemaining--;
		timerDisplay.textContent = formatTime(timerSecondsRemaining);

		if (timerSecondsRemaining <= 0) {
			clearTimer();
			timerFinished = true;
			timerSecondsRemaining = 0;
			timerDisplay.textContent = formatTime(0);
			updateStatus('Time is up! Stop smelling and lock in your guess, then reveal the answer.', false);
			showRevealPrompt('time');
		}
	}, 1000);
}

function showRevealPrompt(reason = 'time') {
	if (!currentPair || !currentCategory) return;
	revealPanel.style.display = 'flex';

	if (reason === 'early') {
		revealHeading.textContent = 'Round stopped';
		revealSub.textContent = 'You chose to stop early. Lock in your guess, then press “Reveal Answer”.';
	} else {
		revealHeading.textContent = 'Time is up!';
		revealSub.textContent = 'Talk it out and agree on your final guess. When you’re ready, press “Reveal Answer”.';
	}

	answerText.style.display = 'none';
	answerMeta.style.display = 'none';
	answerActions.style.display = 'none';
	revealAnswerBtn.style.display = 'inline-flex';
}

function revealAnswer() {
	if (!currentPair || !currentCategory) return;

	answerText.textContent = `Answer: ${currentPair.answer}`;

	const labels = currentPair.scentLabels && currentPair.scentLabels.length
		? currentPair.scentLabels.map((label, i) =>
				`Jar ${i + 1} (#${currentPair.jars[i]}): ${label}`
			).join(' • ')
		: `Jars: ${currentPair.jars.map((n, i) => `Jar ${i + 1} #${n}`).join(' • ')}`;

	answerMeta.textContent = labels;

	revealHeading.textContent = 'Answer revealed';
	revealSub.textContent = 'Now mark whether your guess was correct or not.';

	answerText.style.display = 'block';
	answerMeta.style.display = 'block';
	answerActions.style.display = 'flex';
	revealAnswerBtn.style.display = 'none';
}

// Pick two distinct players for this round
function pickPlayersForRound() {
	if (!players || players.length < 2) {
		currentRoundPlayers = [];
		playerRoundCard.style.display = 'none';
		return;
	}
	if (players.length === 2) {
		currentRoundPlayers = [players[0], players[1]];
	} else {
		const idx1 = Math.floor(Math.random() * players.length);
		let idx2 = Math.floor(Math.random() * players.length);
		while (idx2 === idx1) {
			idx2 = Math.floor(Math.random() * players.length);
		}
		currentRoundPlayers = [players[idx1], players[idx2]];
	}
	playerANameEl.textContent = currentRoundPlayers[0];
	playerBNameEl.textContent = currentRoundPlayers[1];
	playerRoundCard.style.display = 'flex';
}

// ----------------------------
// Event handlers
// ----------------------------
function handleCategoryClick(categoryId) {
	if (players.length < 2) {
		alert('Please add at least two players before starting.');
		return;
	}

	const cat = gameData.categories.find(c => c.id === categoryId);
	if (!cat) return;

	const buttons = categoryButtonsContainer.querySelectorAll('.category-btn');
	buttons.forEach(btn => {
		if (btn.dataset.categoryId === categoryId) {
			btn.classList.add('active');
		} else {
			btn.classList.remove('active');
		}
	});

	currentCategory = cat;
	if (categoryDescriptionEl) {
		categoryDescriptionEl.textContent = cat.description || '';
		categoryDescriptionEl.style.display = 'block';
	}
	currentPair = pickRandomPair(cat);
	pickPlayersForRound();
	setTimer(gameData.roundDurationSeconds);
	timerFinished = false;
	hideRevealPanel();
	clearTimer();

	renderRoundInfo();
	newPairBtn.disabled = false;
	resetBtn.disabled = false;
	startBtn.disabled = false;
	stopEarlyBtn.disabled = true;

	updateStatus(`Playing in “${cat.name}”. Hand out the jars to ${currentRoundPlayers[0]} and ${currentRoundPlayers[1]}, then start the timer.`, false);
}

newPairBtn.addEventListener('click', () => {
	if (!currentCategory) return;
	clearTimer();
	setTimer(gameData.roundDurationSeconds);
	timerFinished = false;
	hideRevealPanel();

	currentPair = pickRandomPair(currentCategory);
	pickPlayersForRound();
	renderRoundInfo();
	newPairBtn.disabled = false;
	resetBtn.disabled = false;
	startBtn.disabled = false;
	stopEarlyBtn.disabled = true;

	updateStatus(`New pair selected. Jars go to ${currentRoundPlayers[0]} and ${currentRoundPlayers[1]}. Hand them out, then start the timer.`, false);
});

resetBtn.addEventListener('click', () => {
	resetRound(true);
});

startBtn.addEventListener('click', () => {
	if (!currentPair || !currentCategory) return;
	startTimer();
});

stopEarlyBtn.addEventListener('click', () => {
	if (!timerRunning || !currentPair || !currentCategory) return;
	clearTimer();
	timerFinished = true;
	updateStatus('Round stopped early. Lock in your guess, then reveal the answer.', false);
	showRevealPrompt('early');
});

revealAnswerBtn.addEventListener('click', () => {
	revealAnswer();
});

correctBtn.addEventListener('click', () => {
	roundsPlayed++;
	roundsCorrect++;
	updateScoreboard();
	updateStatus('Nice! Marked as correct. Choose another pair or switch category.', false);
	resetRound(false);
});

incorrectBtn.addEventListener('click', () => {
	roundsPlayed++;
	updateScoreboard();
	updateStatus('Marked as incorrect. Try another pair or switch category.', false);
	resetRound(false);
});

// Rules card toggle
rulesToggleBtn.addEventListener('click', () => {
	const isCollapsed = rulesCard.classList.toggle('collapsed');
	if (isCollapsed) {
		rulesToggleBtn.textContent = 'Show';
	} else {
		rulesToggleBtn.textContent = 'Hide';
	}
});

// Player overlay logic
function getPlayerInputs() {
	return Array.from(document.querySelectorAll('.player-input'));
}

function collectPlayers() {
	const inputs = getPlayerInputs();
	const names = inputs
		.map(input => input.value.trim())
		.filter(name => name.length > 0);
	return names;
}

addPlayerBtn.addEventListener('click', () => {
	const currentCount = getPlayerInputs().length;
	if (currentCount >= 10) {
		overlayError.textContent = 'You can’t add more than 10 players.';
		return;
	}
	overlayError.textContent = '';
	const row = document.createElement('div');
	row.className = 'player-input-row';
	const label = document.createElement('label');
	label.textContent = `Player ${currentCount + 1}`;
	const input = document.createElement('input');
	input.type = 'text';
	input.className = 'player-input';
	input.placeholder = 'Name';
	row.appendChild(label);
	row.appendChild(input);
	playerInputsContainer.appendChild(row);
});

startGameBtn.addEventListener('click', () => {
	const names = collectPlayers();
	if (names.length < 2) {
		overlayError.textContent = 'Please enter at least two player names.';
		return;
	}
	players = names;
	overlayError.textContent = '';
	playerOverlay.style.display = 'none';
	updateStatus('Select a category to start a round.', false);
});

// ----------------------------
// Initial render
// ----------------------------
function initCategories() {
	gameData.categories.forEach(cat => {
		const btn = document.createElement('button');
		btn.className = 'category-btn';
		btn.dataset.categoryId = cat.id;

		const labelSpan = document.createElement('span');
		labelSpan.className = 'label';
		labelSpan.textContent = cat.name;

		const pillSpan = document.createElement('span');
		pillSpan.className = 'pill';
		pillSpan.textContent = `${cat.pairs.length} pairs`;

		btn.appendChild(labelSpan);
		btn.appendChild(pillSpan);

		btn.addEventListener('click', () => handleCategoryClick(cat.id));
		categoryButtonsContainer.appendChild(btn);
	});
}

function init() {
	initCategories();
	setTimer(gameData.roundDurationSeconds);
	updateStatus('Add players to begin.', false);
	newPairBtn.disabled = true;
	resetBtn.disabled = true;
	startBtn.disabled = true;
	stopEarlyBtn.disabled = true;
	hideRevealPanel();
	updateScoreboard();
}

init();
