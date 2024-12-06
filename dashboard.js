async function fetchUserData() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/users');
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
        const row = tableBody.insertRow();
        const nameCell = row.insertCell(0);
        const attemptsCell = row.insertCell(1);
        const resultsCell = row.insertCell(2);

        nameCell.textContent = user.name;
        attemptsCell.textContent = user.attempts.length; // Display number of attempts
        resultsCell.textContent = user.finalResults.join(', '); // Display final results
    });
}

// Fetch user data when the page loads
document.addEventListener('DOMContentLoaded', fetchUserData); 