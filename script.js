// Function to fetch quiz data from JSON file
async function fetchQuizData() {
    try {
        const response = await fetch('./Grader_Quiz_Level01_Foundation.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        return [];
    }
}

// Variables to track quiz state
let currentQuestion = 1;
let correctAnswers = 0;
let totalQuestions = 10;

// Function to show a specific screen
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the requested screen
    document.getElementById(screenId).classList.add('active');
    
    // Reset question if going back to start
    if (screenId === 'start-screen') {
        resetQuiz();
    }
    
    // Show mid-test popup after 5th question
    if (screenId === 'question-screen' && currentQuestion === 5) {
        setTimeout(showPopup, 500);
    }
    
    // Update completion screen data
    if (screenId === 'completion-screen') {
        document.getElementById('correct-answers').textContent = correctAnswers;
    }
    
    // If showing question screen, load the current question
    if (screenId === 'question-screen') {
        loadQuestion(currentQuestion);
    }
}

// Function to load a question
async function loadQuestion(questionNumber) {
    const quizData = await fetchQuizData();
    const questionData = quizData[questionNumber - 1];

    // Update question text
    document.getElementById('question-text').textContent = questionData.question;

    // Update options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    Object.entries(questionData.options).forEach(([key, option]) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.onclick = function() { 
            selectOption(this, parseInt(key) === questionData.answer_key, questionData);
        };

        const prefixElement = document.createElement('div');
        prefixElement.className = 'option-prefix';
        prefixElement.textContent = String.fromCharCode(65 + parseInt(key)); // A, B, C, D

        const textElement = document.createElement('div');
        textElement.className = 'option-text';
        textElement.textContent = option;

        optionElement.appendChild(prefixElement);
        optionElement.appendChild(textElement);
        optionsContainer.appendChild(optionElement);
    });

    // Hide finish button on non-last questions
    document.getElementById('finish-button').style.display = 'none';

    // Update progress
    document.getElementById('current-question').textContent = questionNumber;
    document.getElementById('progress-bar').style.width = (questionNumber / totalQuestions * 100) + '%';
}

// Function to display answer animation and explanation with countdown
function showAnswerAnimation(animation, explanation) {
    const container = document.getElementById('animation-container');
    
    // Clear previous content but keep countdown elements
    const countdownContainer = document.querySelector('.countdown-container');
    const countdownNumbers = document.querySelector('.countdown-numbers');
    container.innerHTML = '';
    
    // Add the emoji
    const emojiElement = document.createElement('div');
    emojiElement.className = 'animation-emoji';
    emojiElement.textContent = animation;
    
    // Add explanation text
    const explanationElement = document.createElement('div');
    explanationElement.className = 'explanation-text';
    explanationElement.textContent = explanation;
    
    // Recreate countdown elements
    const newCountdownContainer = document.createElement('div');
    newCountdownContainer.className = 'countdown-container';
    const countdownBar = document.createElement('div');
    countdownBar.id = 'countdown-bar';
    countdownBar.className = 'countdown-bar';
    newCountdownContainer.appendChild(countdownBar);
    
    // Recreate dots
    const newCountdownNumbers = document.createElement('div');
    newCountdownNumbers.className = 'countdown-numbers';
    
    for (let i = 1; i <= 5; i++) {
        const dot = document.createElement('div');
        dot.id = `countdown-dot-${i}`;
        dot.className = 'countdown-dot';
        if (i === 1) dot.classList.add('active');
        newCountdownNumbers.appendChild(dot);
    }
    
    // Append all elements to container
    container.appendChild(emojiElement);
    container.appendChild(explanationElement);
    container.appendChild(newCountdownContainer);
    container.appendChild(newCountdownNumbers);
    
    // Show animation
    container.classList.add('animation-visible');
    
    // Start countdown
    startCountdown(5);
}

// Function to handle countdown animation
function startCountdown(seconds) {
    const countdownBar = document.getElementById('countdown-bar');
    const totalTime = seconds * 1000;
    const interval = 100; // Update every 100ms for smooth animation
    let timeLeft = totalTime;
    
    // Reset countdown bar
    countdownBar.style.width = '100%';
    
    // Reset dots
    for (let i = 1; i <= 5; i++) {
        const dot = document.getElementById(`countdown-dot-${i}`);
        dot.classList.remove('active');
        if (i === 1) dot.classList.add('active');
    }
    
    // Create countdown interval
    const countdownInterval = setInterval(() => {
        timeLeft -= interval;
        const percentLeft = (timeLeft / totalTime) * 100;
        countdownBar.style.width = percentLeft + '%';
        
        // Update active dot based on time left
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('animation-container').classList.remove('animation-visible');
            return;
        }
        
        // Update the active dot
        const dotToActivate = Math.ceil((timeLeft / totalTime) * 5);
        for (let i = 1; i <= 5; i++) {
            const dot = document.getElementById(`countdown-dot-${i}`);
            dot.classList.remove('active');
            if (i === dotToActivate) dot.classList.add('active');
        }
        
    }, interval);
}

// Function to select an option
function selectOption(optionElement, isCorrect, questionData) {
    // Disable all options
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Add correct/incorrect class
    if (isCorrect) {
        optionElement.classList.add('correct');
        correctAnswers++;
        showAnswerAnimation(questionData.icon_correct, questionData.explanation_correct);
    } else {
        optionElement.classList.add('incorrect');
        showAnswerAnimation(questionData.icon_wrong, questionData.explanation_wrong);
        
        // Find and highlight the correct answer
        options.forEach((option, index) => {
            if (index === questionData.answer_key) {
                option.classList.add('correct');
            }
        });
    }
    
    // Show finish button on last question
    if (currentQuestion === totalQuestions) {
        setTimeout(() => {
            document.getElementById('finish-button').style.display = 'block';
        }, 2000);
        return;
    }
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestion++;
        
        if (currentQuestion <= totalQuestions) {
            // Load the next question
            loadQuestion(currentQuestion);
            
            // Show popup at halfway point (question 5)
            if (currentQuestion === 6) {
                showPopup();
            }
        } else {
            // End of quiz
            showScreen('completion-screen');
        }
    }, 3000);  // Increased delay to give time to read explanation
}

// Function to show mid-test popup
function showPopup() {
    document.getElementById('popup-container').style.display = 'block';
    
    // Auto-close after 2 seconds
    setTimeout(closePopup, 2000);
}

// Function to close popup
function closePopup() {
    document.getElementById('popup-container').style.display = 'none';
}

// Function to reset quiz
function resetQuiz() {
    currentQuestion = 1;
    correctAnswers = 0;
    
    // Load first question
    loadQuestion(currentQuestion);
}

// Initialize the first question when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize the first question data
    if (document.getElementById('question-screen').classList.contains('active')) {
        await loadQuestion(1);
    }
});
