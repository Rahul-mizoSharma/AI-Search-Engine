const GEMINI_API_KEY = 'your api key'; // Replace with your actual API key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Add this at the start of your script
if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    document.getElementById('apiWarning').style.display = 'block';
    searchInput.disabled = true;
    searchButton.disabled = true;
}

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');

// Function to call Gemini API
async function getGeminiResponse(question) {
    try {
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: question
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Function to show loading state
function showLoading() {
    searchResults.innerHTML = `
        <div class="result-item loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">Thinking...</div>
        </div>
    `;
    searchButton.disabled = true;
}

// Function to reset button state
function resetButton() {
    searchButton.disabled = false;
}

// Function to perform search
async function performSearch() {
    const question = searchInput.value.trim();
    
    if (question.length < 3) {
        searchResults.innerHTML = '';
        return;
    }

    showLoading();

    const answer = await getGeminiResponse(question);
    resetButton();
    
    if (!answer) {
        searchResults.innerHTML = `
            <div class="result-item error">
                <div class="answer">
                    Sorry, I couldn't process your question at the moment. Please try again later.
                </div>
            </div>
        `;
        return;
    }

    const div = document.createElement('div');
    div.className = 'result-item';
    
    const answerDiv = document.createElement('div');
    answerDiv.className = 'answer';
    answerDiv.innerHTML = answer;
    
    div.appendChild(answerDiv);
    searchResults.innerHTML = '';
    searchResults.appendChild(div);
}

// Remove the input event listener to prevent auto-search
// Add click event listener for the search button
searchButton.addEventListener('click', performSearch);

// Add event listener for Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
}); 