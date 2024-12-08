async function fetchUserData() {
    try {
        const response = await fetch('https://sql-wordle-2.onrender.com/api/users');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users = await response.json();
        displayUserData(users);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

function displayUserData(users) {
    const tableBody = document.getElementById('user-data-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing data

    users.forEach(user => {
        user.attempts.forEach(attempt => {
            const row = tableBody.insertRow();
            const nameCell = row.insertCell(0);
            const attemptNumberCell = row.insertCell(1);
            const inputCell = row.insertCell(2);
            const resultCell = row.insertCell(3);
            const timestampCell = row.insertCell(4);
            const solvedCell = row.insertCell(5); // New cell for solved status

            nameCell.textContent = user.name;
            attemptNumberCell.textContent = attempt.attemptNumber; // Display attempt number
            inputCell.textContent = attempt.input.join(', '); // Display input
            resultCell.textContent = attempt.result; // Display result
            timestampCell.textContent = new Date(attempt.timestamp).toLocaleString(); // Display timestamp
            solvedCell.innerHTML = `<input type="checkbox" ${user.solved ? 'checked' : ''} disabled>`; // Checkbox for solved status
        });
    });
}

async function saveUserData(name, attempt, finalResult, solved) {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, attempt, finalResult, solved }), // Include 'solved' in the request body
        });
        const data = await response.json();
        // Handle the response data as needed
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

// Example usage
const name = 'User1';
const attempt = { attemptNumber: 1, input: ['A', 'B', 'C'], result: 'lose' };
const finalResult = 'lose';
const solved = false; // Set this based on your application logic
saveUserData(name, attempt, finalResult, solved);

// Fetch user data when the page loads
document.addEventListener('DOMContentLoaded', fetchUserData); 