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
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 5; j++) {
            document.getElementById(`input${i}-${j}`).innerText = '';
        }
    }
  }
  
  