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
    }
  }
  
  function backspace() {
    if (currentInputIndex > 0) {
      currentInputIndex--;
      attempts[currentAttempt][currentInputIndex] = '';
      document.getElementById(`input${currentAttempt + 1}-${currentInputIndex + 1}`).textContent = '';
    }
  }
  
  function checkAnswer() {
    if (currentInputIndex < 5) return; // Ensure all inputs are filled
  
    let correctCount = 0;
  
    // Loop through the inputs and compare to the answer
    for (let i = 0; i < 5; i++) {
      const box = document.getElementById(`input${currentAttempt + 1}-${i + 1}`);
      const userInput = attempts[currentAttempt][i].trim(); // Trim spaces for accurate comparison
      const correctAnswer = answer[i];
  
      if (userInput === correctAnswer) {
        box.classList.add('bg-green-500', 'text-white');
        correctCount++;
      } else if (answer.includes(userInput)) {
        box.classList.add('bg-yellow-500', 'text-white');
      } else {
        box.classList.add('bg-red-500', 'text-white');
      }
    }
  
    // Check win condition
    if (correctCount === 5) {
      document.getElementById('message').textContent = 'Congratulations! You guessed correctly!';
      return;
    }
  
    // Update chances and prepare for the next attempt
    chancesRemaining--;
    document.getElementById('chances-remaining').textContent = `Chances remaining: ${chancesRemaining}`;
  
    // Adjust UI color based on remaining chances
    if (chancesRemaining === 0) {
      // Show the correct answer when the player runs out of chances
      const correctAnswerStr = answer.join(' ');
      document.getElementById('message').textContent = `Game Over! The correct answer was: ${correctAnswerStr}`;
    } else {
      currentAttempt++;
      currentInputIndex = 0;
    }
  }
  
  function resetInputs() {
    // Clear all inputs and reset game state
    attempts = [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']
    ];
    currentAttempt = 0;
    currentInputIndex = 0;
    chancesRemaining = 3;
  
    // Clear UI and reset styling
    document.getElementById('chances-remaining').textContent = `Chances remaining: ${chancesRemaining}`;
    document.getElementById('message').textContent = '';
    for (let attemptRow = 1; attemptRow <= 3; attemptRow++) {
      for (let inputBox = 1; inputBox <= 5; inputBox++) {
        const box = document.getElementById(`input${attemptRow}-${inputBox}`);
        box.textContent = '';
        box.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-red-500', 'text-white');
      }
    }
  }
  
  