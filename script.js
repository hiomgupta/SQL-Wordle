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

    if (!row.every(Boolean)) {
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

    // Apply feedback to option buttons
    document.querySelectorAll('.option-botton').forEach(button => {
        const word = button.getAttribute('data-word');
        if (feedbackMap.has(word)) {
            updateOptionButtonColor(button, feedbackMap.get(word));
        }
    });

    // Rest of the game logic
    if (JSON.stringify(row) === JSON.stringify(answerWords)) {
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
    currentInputPosition = 0;
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

    // Reset button colors
    document.querySelectorAll('.grid button').forEach(button => {
        button.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-red-500', 'text-white', 'bg-blue-300');
        button.classList.add('bg-gray-200'); // Reset to default color
    });

    // Reset game state
    currentAttempt = 0;
    currentInputPosition = 0;
    chancesRemaining = 3;
    document.getElementById('chances-remaining').textContent = 'Chances remaining: 3';
    document.getElementById('message').textContent = '';

    // Optionally, reset the question and description
    document.getElementById('question').textContent = '';
    document.getElementById('description').textContent = '';
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
// Add event listeners to buttons for feedback
document.querySelectorAll('.grid button').forEach(button => {
    button.addEventListener('click', function() {
        buttonClickFeedback(button); // Call feedback function on click
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
