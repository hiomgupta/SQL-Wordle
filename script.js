let attempts = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', '']
];
let answer = ['select', '*', 'from', 'teacher', ';'];
let chancesRemaining = 3;
let currentAttempt = 0;
let currentInputIndex = 0;

function addToInput(word) {
  if (currentInputIndex < 5 && currentAttempt < 3) {
    attempts[currentAttempt][currentInputIndex] = word;
    document.getElementById(`input${currentAttempt + 1}-${currentInputIndex + 1}`).textContent = word;
    currentInputIndex++;
    highlightButton(word, 'active');  // Temporarily highlight when button is pressed
  }
}

function backspace() {
  if (currentInputIndex > 0) {
    currentInputIndex--;
    let word = attempts[currentAttempt][currentInputIndex];
    attempts[currentAttempt][currentInputIndex] = '';
    document.getElementById(`input${currentAttempt + 1}-${currentInputIndex + 1}`).textContent = '';
    resetButton(word);  // Reset button color when backspace is used
  }
}

function checkAnswer() {
  if (currentInputIndex < 5) return;

  let correctCount = 0;

  // Check each input in the current attempt
  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`input${currentAttempt + 1}-${i + 1}`);
    if (attempts[currentAttempt][i] === answer[i]) {
      box.classList.add('bg-green-500', 'text-white');
      highlightButton(attempts[currentAttempt][i], 'correct');
      correctCount++;
    } else if (answer.includes(attempts[currentAttempt][i])) {
      box.classList.add('bg-yellow-500', 'text-white');
      highlightButton(attempts[currentAttempt][i], 'present');
    } else {
      box.classList.add('bg-gray-500', 'text-white');
    }
  }

  if (correctCount === 5) {
    document.getElementById('message').textContent = 'Congratulations!';
    return;
  }

  chancesRemaining--;
  document.getElementById('chances-remaining').textContent = `Chances remaining: ${chancesRemaining}`;
  if (chancesRemaining === 0) {
    document.getElementById('message').textContent = 'Game Over! The correct answer was: ' + answer.join(' ');
  } else {
    currentAttempt++;
    currentInputIndex = 0;
  }
}

function resetInputs() {
  attempts = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
  ];
  currentAttempt = 0;
  currentInputIndex = 0;
  chancesRemaining = 3;

  document.getElementById('chances-remaining').textContent = `Chances remaining: ${chancesRemaining}`;
  document.getElementById('message').textContent = '';
  const inputBoxes = document.querySelectorAll('.input-box');
  inputBoxes.forEach(box => box.textContent = '');
  inputBoxes.forEach(box => box.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-gray-500', 'text-white'));

  // Reset button colors
  document.querySelectorAll('.snippet-btn').forEach(btn => btn.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-gray-500', 'text-white', 'active'));
}

function highlightButton(word, status) {
  const button = [...document.querySelectorAll('.snippet-btn')].find(btn => btn.textContent === word);
  button.classList.remove('bg-gray-200', 'bg-green-500', 'bg-yellow-500', 'active');
  if (status === 'active') button.classList.add('active');
  else if (status === 'correct') button.classList.add('bg-green-500', 'text-white');
  else if (status === 'present') button.classList.add('bg-yellow-500', 'text-white');
}

function resetButton(word) {
  const button = [...document.querySelectorAll('.snippet-btn')].find(btn => btn.textContent === word);
  button.classList.remove('active');
}
