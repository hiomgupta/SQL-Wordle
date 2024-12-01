const correctAnswer = ['select', '*', 'from', 'teacher', ';']; // Example correct answer for testing
let currentAttempt = 0;
let currentInputIndex = 0;
let chancesRemaining = 3;
let levels = []; // To store levels data

// Function to load levels from JSON
function loadLevels() {
    fetch('data/questions.json')
        .then(response => response.json())
        .then(data => {
            levels = data.levels; // Store the levels in a global variable
            startLevel(0); // Start with the first level
        })
        .catch(error => console.error('Error loading levels:', error));
}

// Function to start a specific level
function startLevel(levelIndex) {
    const level = levels[levelIndex]; // Access the current level
    document.getElementById('question').textContent = level.questions[0]; // Display the first question
    document.getElementById('description').textContent = level.answers[0]; // Display the correct answer
    // Reset attempts and input index for the new level
    currentAttempt = 0;
    currentInputIndex = 0;
    chancesRemaining = 3;
    document.getElementById('chances-remaining').textContent = `Chances remaining: ${chancesRemaining}`;
}

// Function to add input from buttons with interactivity
function addToInput(value) {
    if (currentInputIndex < 5) {
        const box = document.getElementById(`input${currentAttempt + 1}-${currentInputIndex + 1}`);
        box.textContent = value;
        currentInputIndex++;

        // Add interactivity to the button
        const button = document.querySelector(`button[data-word="${value}"]`);
        if (button) {
            button.classList.add('bg-blue-300'); // Change color to indicate it's clicked
            setTimeout(() => {
                button.classList.remove('bg-blue-300'); // Reset color after a short delay
            }, 200); // Delay in milliseconds
        }
    }
}

// Function to handle backspace
function backspace() {
    if (currentInputIndex > 0) {
        currentInputIndex--;
        document.getElementById(`input${currentAttempt + 1}-${currentInputIndex + 1}`).textContent = '';
    }
}

// Function to check the answer
function checkAnswer() {
    const row = Array.from({ length: 5 }, (_, i) =>
        document.getElementById(`input${currentAttempt + 1}-${i + 1}`).textContent
    );

    // Create a copy of the correct answer to track which letters have been matched
    const answerCopy = [...levels[currentAttempt].answers]; // Use the new answers property

    row.forEach((value, index) => {
        const box = document.getElementById(`input${currentAttempt + 1}-${index + 1}`);
        if (value === answerCopy[index]) {
            // Correct position
            box.classList.add('bg-green-500', 'text-white');
            answerCopy[index] = null; // Mark this letter as matched

            const buttons = document.querySelectorAll(`button[data-word="${value}"]`);
            buttons.forEach(button => {
                button.classList.add('bg-green-500', 'text-white');
            });
        } else if (answerCopy.includes(value)) {
            // Wrong position but correct letter
            box.classList.add('bg-yellow-500', 'text-white');
            const buttons = document.querySelectorAll(`button[data-word="${value}"]`);
            buttons.forEach(button => {
                button.classList.add('bg-yellow-500', 'text-white');
            });
        } else {
            // Not present
            box.classList.add('bg-red-500', 'text-white');
            const buttons = document.querySelectorAll(`button[data-word="${value}"]`);
            buttons.forEach(button => {
                button.classList.add('bg-red-500', 'text-white');
            });
        }
    });

    if (JSON.stringify(row) === JSON.stringify(answerCopy)) {
        document.getElementById('message').textContent = 'Congratulations! You Win!';
        return;
    }

    chancesRemaining--;
    document.getElementById('chances-remaining').textContent = `Chances remaining: ${chancesRemaining}`;
    if (chancesRemaining === 0) {
        document.getElementById('message').textContent = 'Game Over!';
        return;
    }

    currentAttempt++;
    currentInputIndex = 0;

    // Load the next level if available
    if (currentAttempt < levels.length) {
        startLevel(currentAttempt);
    }
}

// Function to reset inputs
function resetInputs() {
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 5; j++) {
            const box = document.getElementById(`input${i}-${j}`);
            box.textContent = '';
            box.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-red-500', 'text-white');
        }
    }
    currentAttempt = 0;
    currentInputIndex = 0;
    chancesRemaining = 3;
    document.getElementById('chances-remaining').textContent = 'Chances remaining: 3';
    document.getElementById('message').textContent = '';
}

// Event listener for starting the game
document.getElementById('start-game-btn').addEventListener('click', function() {
    const userName = document.getElementById('name-input').value.trim();
    if (userName) {
        document.getElementById('welcome-message').textContent = `Welcome, ${userName}! Let's play SQL Wordle!`;
        document.getElementById('welcome-container').style.display = 'none'; // Hide the welcome container
        document.getElementById('game-container').style.display = 'block'; // Show the game container
        loadLevels(); // Load levels when the game starts
    } else {
        alert("Name is required to play the game.");
    }
});