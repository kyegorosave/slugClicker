/*
    slug.js(!PROTOTTPE!) - This JavaScript files contains all the goods for how thr slug clicker works.
    (Slugs falliing, click interactivity, starting the game, ending the game, updating the timer
    updating the score, displaying your score, and ofc more slug stuff.)
    
    Requirements: jQuery must be loaded for this script to work.

    Authors: Kye Gorosave, Corey Haro, Leyton Philbrook, Parker Ehlers
    
    Date: November 26, 2023
*/

$(document).ready(function() {
    const gameArea = $('#game-area');
    let score = 0, timeLeft = 30, gameInterval, slugSpeed = 7;

    // Function to create the initial game UI
    function createGameUI() {
        gameArea.empty();
        gameArea.append(`
            <div id="score-timer">
                <div id="time-left" style="width: 100%;"></div> 
                Score: <span id="score">0</span>
            </div>
            <button id="start-button">Start Game</button>
        `);
        $('#start-button').click(startGame).css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '20px',
            padding: '10px 20px'
        });
    }

    // Function to start the game
    function startGame() {
        $('#end-game-button').show(); // Show the end game button when a new game starts
        $(this).hide();
        score = 0;
        timeLeft = 30;
        updateUI();
        gameInterval = setInterval(() => {
            generateSlug();
            updateTimer();
        }, 1000);
    }

    // Function to update the timer
    function updateTimer() {
        if (--timeLeft <= 0) {
            endGame();
            return;
        }
        updateUI();
    }

    // Function to end the game
function endGame() {
    clearInterval(gameInterval);
    $('.slug').remove(); // Remove all slugs from the game area
    displayScoreResult(); // Display the score result
    $('#end-game-button').hide(); // Hide the end game button when the game ends
    if ($('#reset-button').length === 0) {
        gameArea.append('<div>GAME OVER</div><button id="reset-button">Play Again</button>');
    }
    $('#reset-button').click(function() {
        createGameUI();
        $(this).remove(); // Remove the reset button after clicking
    });
}

// Function to display the score result with animations
function displayScoreResult() {
    let scoreResult = $('<div id="score-result"></div>');
    if (score > 10) {
        scoreResult.html(`Congratulations! Your score is: ${score}<br><span class="party-animation">🎉🎊🥳</span>`);
    } else {
        scoreResult.html(`Your score is: ${score}<br><span class="giant-L">L</span>`);
    }
    gameArea.append(scoreResult);
}


    // Function to update the score and timer UI
    function updateUI() {
        $('#score').text(score);
        let widthPercentage = (timeLeft / 30) * 100;
        let color = `rgb(${255 * (1 - timeLeft / 30)}, ${255 * (timeLeft / 30)}, 0)`;
        $('#time-left').css({ width: widthPercentage + '%', backgroundColor: color });
    }

    // Function to generate and place a new slug on the screen
    function generateSlug() {
        let slug = $('<div class="slug"></div>').css({
            top: 0,
            left: Math.floor(Math.random() * (gameArea.width() - 60)),
            backgroundImage: 'url(Images/8bit-slug.png)' // Path to slug image
        }).click(function() {
            $(this).effect('explode', 500, function() { $(this).remove(); });
            score++;
            updateUI();
        });

        gameArea.append(slug);
        moveSlug(slug);
    }

    // Function to move the slug down the screen
    function moveSlug(slug) {
        let moveInterval = setInterval(() => {
            let currentTop = slug.position().top;
            if (currentTop < gameArea.height() - 100) {
                slug.css('top', currentTop + slugSpeed);
            } else {
                slug.remove();
                clearInterval(moveInterval);
            }
        }, 50);
    }

    createGameUI();

    // Event listener for the end game button
    $('#end-game-button').click(function() {
        endGame();
        $(this).hide();
    });
});
