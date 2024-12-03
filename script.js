const correctAnswer = ['select', '*', 'from', 'teacher', ';']; // Example correct answer for testing
let currentAttempt = 0;
let currentInputPosition = 0;
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
    const question = level.questions[levelIndex]; // Get the current question
    const answer = level.answers[levelIndex]; // Get the corresponding answer
    const options = level.options[levelIndex].split(' '); // Get options and split into array

    // Display the question
    document.getElementById('question').textContent = question;

    // Reset attempts and input index for the new level
    currentAttempt = 0;
    currentInputPosition = 0;
    chancesRemaining = 3;
    document.getElementById('chances-remaining').textContent = `Chances remaining: ${chancesRemaining}`;

    // Set up input boxes dynamically based on the answer
    const attemptsContainer = document.getElementById('attempts');
    attemptsContainer.innerHTML = ''; // Clear previous inputs

    for (let attempt = 0; attempt < 3; attempt++) { // Create 3 rows for attempts
        const row = document.createElement('div');
        row.className = 'attempt-row flex space-x-2 justify-center'; // Add a class for styling

        const answerWords = answer.replace(/,/g, '').split(' '); // Split answer into words, ignoring commas
        for (let i = 0; i < answerWords.length; i++) { // Create input boxes based on answer length
            const box = document.createElement('button');
            box.className = 'input-box px-4 py-2 bg-gray-200 rounded';
            box.id = `input${attempt + 1}-${i + 1}`;
            row.appendChild(box);
        }
        attemptsContainer.appendChild(row);
    }

    // Set up option buttons dynamically
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = ''; // Clear previous options
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-botton bg-gray-200 p-2 rounded text-sm';
        button.textContent = option;
        button.setAttribute('data-word', option);
        button.onclick = () => {
            addToInput(option); // Add click event to add input
            buttonClickFeedback(button); // Call feedback function on click
        };
        optionsContainer.appendChild(button);
    });
}

// Function to add input from buttons
function addToInput(value) {
    // Get the current level's answer instead of using currentAttempt as an index
    const currentLevel = levels[0]; // Since we start with first level
    const answer = currentLevel.answers[0].replace(/,/g, '').split(' '); // Get the correct answer
    
    if (currentInputPosition < answer.length) {
        const inputBox = document.getElementById(`input${currentAttempt + 1}-${currentInputPosition + 1}`);
        if (inputBox) {
            inputBox.textContent = value;
            currentInputPosition++;
        }
    }
}

// Function to handle button click feedback
function buttonClickFeedback(button) {
    button.classList.add('bg-blue-300'); // Change color to indicate click
    setTimeout(() => {
        button.classList.remove('bg-blue-300'); // Reset color after a short delay
    }, 200); // Delay in milliseconds
}

// Function to handle backspace
function backspace() {
    if (currentInputPosition > 0) {
        currentInputPosition--;
        document.getElementById(`input${currentAttempt + 1}-${currentInputPosition + 1}`).textContent = '';
    }
}

// Helper function to add feedback classes
function addFeedbackClass(box, feedback) {
    box.classList.remove('bg-gray-200', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'text-white');
    switch (feedback) {
        case 'correct':
            box.classList.add('bg-green-500', 'text-white');
            break;
        case 'wrong-position':
            box.classList.add('bg-yellow-500', 'text-white');
            break;
        case 'incorrect':
            box.classList.add('bg-red-500', 'text-white');
            break;
    }
}

// Function to check the answer
function checkAnswer() {
    const currentLevel = levels[0];
    const answer = currentLevel.answers[0];
    
    // Get current attempt's inputs
    const row = Array.from({ length: 5 }, (_, i) =>
        document.getElementById(`input${currentAttempt + 1}-${i + 1}`).textContent
    );

    // Validation
    if (row.some(input => !input || input.trim() === '')) {
        alert('Please fill all boxes before checking');
        return;
    }

    const answerWords = answer.replace(/,/g, '').split(' ');
    
    // Create feedback map for the current attempt
    const feedbackMap = new Map();
    
    // First pass: Mark exact matches (green)
    row.forEach((value, index) => {
        if (value === answerWords[index]) {
            feedbackMap.set(value, 'correct');
        } else if (answerWords.includes(value)) {
            feedbackMap.set(value, 'wrong-position');
        } else {
            feedbackMap.set(value, 'incorrect');
        }
    });

    // Apply feedback to input boxes
    row.forEach((value, index) => {
        const box = document.getElementById(`input${currentAttempt + 1}-${index + 1}`);
        const feedback = feedbackMap.get(value);
        addFeedbackClass(box, feedback);
    });

    // Update option buttons with feedback colors (modified part)
    document.querySelectorAll('.option-botton').forEach(button => {
        const word = button.getAttribute('data-word');
        if (feedbackMap.has(word)) {
            const newFeedback = feedbackMap.get(word);
            const currentClasses = button.classList;
            
            // Only upgrade the feedback color if it's better than the current one
            if (
                (newFeedback === 'correct') || 
                (newFeedback === 'wrong-position' && !currentClasses.contains('bg-green-500')) ||
                (newFeedback === 'incorrect' && !currentClasses.contains('bg-green-500') && !currentClasses.contains('bg-yellow-500'))
            ) {
                updateOptionButtonColor(button, newFeedback);
            }
        }
    });

    // Rest of game logic...
    if (JSON.stringify(row) === JSON.stringify(answerWords)) {
        document.getElementById('message').textContent = 'Congratulations! You Win!';
        document.getElementById('share-btn').classList.remove('bg-gray-300', 'cursor-not-allowed', 'opacity-50');
        document.getElementById('share-btn').classList.add('bg-blue-500', 'hover:bg-blue-600');
        return;
    }

    chancesRemaining--;
    document.getElementById('chances-remaining').textContent = `Chances remaining: ${chancesRemaining}`;
    
    if (chancesRemaining === 0) {
        document.getElementById('message').textContent = 'Game Over!';
        document.getElementById('share-btn').classList.remove('bg-gray-300', 'cursor-not-allowed', 'opacity-50');
        document.getElementById('share-btn').classList.add('bg-blue-500', 'hover:bg-blue-600');
        return;
    }

    currentAttempt++;
    currentInputPosition = 0;
}

// Modified resetInputs function to only reset input boxes, not option buttons
function resetInputs() {
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 5; j++) {
            const box = document.getElementById(`input${i}-${j}`);
            box.textContent = '';
            box.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-red-500', 'text-white');
        }
    }

    // Reset game state
    currentAttempt = 0;
    currentInputPosition = 0;
    chancesRemaining = 3;
    document.getElementById('chances-remaining').textContent = 'Chances remaining: 3';
    document.getElementById('message').textContent = '';

    // Reset share button state
    const shareBtn = document.getElementById('share-btn');
    shareBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
    shareBtn.classList.add('bg-gray-300', 'cursor-not-allowed', 'opacity-50');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Existing event listeners
    document.getElementById('start-game-btn').addEventListener('click', function() {
        const userName = document.getElementById('name-input').value.trim();
        if (userName) {
            document.getElementById('welcome-message').textContent = `Welcome, ${userName}! Let's play SQL Wordle!`;
            document.getElementById('welcome-container').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            loadLevels();
        } else {
            alert("Name is required to play the game.");
        }
    });

    // Add event listener for GO button
    document.getElementById('go-btn').addEventListener('click', checkAnswer);

    // Add event listener for backspace button
    document.getElementById('backspace-btn').addEventListener('click', backspace);

    // Add event listener for reset button
    document.getElementById('reset-btn').addEventListener('click', resetInputs);

    // Add event listener for share button
    document.getElementById('share-btn').addEventListener('click', function(e) {
        // Only allow sharing if button is active (blue)
        if (this.classList.contains('bg-blue-500')) {
            const shareText = generateShareText();
            
            if (navigator.share) {
                navigator.share({
                    title: 'SQL-Wordle Results',
                    text: shareText
                }).catch(console.error);
            } else {
                navigator.clipboard.writeText(shareText)
                    .then(() => {
                        const message = document.getElementById('message');
                        message.textContent = 'Results copied to clipboard!';
                        setTimeout(() => {
                            message.textContent = '';
                        }, 2000);
                    })
                    .catch(console.error);
            }
        }
    });
});

function updateOptionButtonColor(button, feedback) {
    button.classList.remove('bg-gray-200', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'text-white');
    switch (feedback) {
        case 'correct':
            button.classList.add('bg-green-500', 'text-white');
            break;
        case 'wrong-position':
            button.classList.add('bg-yellow-500', 'text-white');
            break;
        case 'incorrect':
            button.classList.add('bg-red-500', 'text-white');
            break;
    }
}

function generateShareText() {
    const gameName = "SQL-Wordle P1.0\n\n";
    let attemptGrid = '';
    
    // Generate grid for each attempt
    for (let i = 0; i <= currentAttempt; i++) {
        const row = Array.from({ length: 5 }, (_, j) => {
            const box = document.getElementById(`input${i + 1}-${j + 1}`);
            if (box.classList.contains('bg-green-500')) return '🟩';
            if (box.classList.contains('bg-yellow-500')) return '🟨';
            if (box.classList.contains('bg-red-500')) return '⬜';
            return '⬜';
        });
        attemptGrid += row.join('') + '\n';
    }

    return `${gameName}${attemptGrid}\nPlay at: [your-game-url]`;
}
