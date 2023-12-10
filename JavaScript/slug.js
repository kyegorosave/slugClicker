/*
    slug.js - This JavaScript file contains all the functionality for the Slug Clicker game.
    Requirements: jQuery must be loaded for this script to work.
    Authors: Kye Gorosave, Corey Haro, Leyton Philbrook, Parker Ehlers
    Date: December 9, 2023
*/

$(document).ready(function() {
    //Defining variables and constants---------------------------------------------------------------------------
    const gameArea = $('#game-area');
    let score = 0, timeLeft = 30, gameInterval;

    const bananaSlugFacts = [
        //Array of slug facts!---------------------------------------------------------------------------
        "California's banana slug holds the title of the world's second-largest slug, surpassed only by the European Limax cinereoniger!",
        "Banana slugs can reach lengths of up to 10 inches!",
        "With a leisurely pace of about 7.5 inches per minute, banana slugs stand as one of the slowest creatures on the planet!",
        "Weighing in at over 4 ounces, banana slugs are no lightweight in the slug world!",
        "The color of banana slugs can vary based on factors such as age, diet, exposure to light and the elements, as well as the moisture content in the atmosphere!",
        "Functioning as detritivores, banana slugs play a vital role in processing leaves, animal droppings, moss, and deceased plant materials, converting them into nutrient-rich soil humus!",
        "While folklore may suggest that picking up and kissing slugs brings good fortune, it's advisable to refrain from doing so. The slimy coating on slugs aids in breathing and serves as protection against predators!",
        "Contrary to popular belief, UCSC T-shirts and signs claiming 'No known predators' for the banana slug are inaccurate. These slugs have various predators, including salamanders, newts, and porcupines!",
        "Featured in the movie Pulp Fiction, there is a UCSC banana slug shirt. Director Quentin Tarantino, a frequent visitor to Santa Cruz, specifically requested the student-designed Fiat Slug shirt for the film!",
        "Banana slugs sport three openings on the right side of their heads, one of which is dedicated to breathing!",
        "As hermaphrodites, banana slugs possess both male and female genitals, allowing them to self-fertilize when the need arises!",
        "Meet the 'Banana Slug String Band,' a musical group with a unique name inspired by these fascinating creatures!",
        "The slime of a banana slug contains chemicals that act as an anesthetic, numbing the tongue and throat of any unfortunate animal attempting to consume it!",
        "Banana slugs employ pheromones in their slime to attract potential mates!"
    ]
    // Function to create the game UI---------------------------------------------------------------------------
    function createGameUI() {
        gameArea.empty();
        gameArea.append(`
            <div id="score-timer">
                <div id="time-left" style="width: 100%;"></div> 
                Score: <span id="score">0</span>
            </div>
            <button id="start-button">Start Game</button>
        `);
        //Adding a timer and a start button---------------------------------------------------------------------------
        $('#start-button').click(startGame).css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '20px',
            padding: '10px 20px'
        });
    }

    // Function to start the game---------------------------------------------------------------------------
    function startGame() {
        $('#end-game-button').show(); 
        $(this).hide();
        score = 0;
        timeLeft = 30;
        updateUI();
        gameInterval = setInterval(() => {
            generateSlug();
            updateTimer();
        }, 1000);

        // Play the game audio
        var gameAudio = $('#game-audio')[0];
        gameAudio.currentTime = 30; // Start 30 seconds into the song
        gameAudio.play();
    }

    // Function to update the timer ---------------------------------------------------------------------------
    function updateTimer() {
        if (--timeLeft <= 0) {
            endGame();
            return;
        }
        updateUI();
    }

 // Function to end the game---------------------------------------------------------------------------
 function endGame() {
    clearInterval(gameInterval);
    $('.slug').remove();
    displayScoreResult();
    $('#end-game-button').hide();

     // Stop the game audio
     var gameAudio = $('#game-audio')[0];
     gameAudio.pause();
     gameAudio.currentTime = 0;

    // Select a random fun fact about banana slugs---------------------------------------------------------------------------
    const randomFact = bananaSlugFacts[Math.floor(Math.random() * bananaSlugFacts.length)];
    $('#fact-text').text(randomFact);

    // Show the end screen with the fun fact---------------------------------------------------------------------------
    $('#end-screen').show();
}
    // Function to display the score result---------------------------------------------------------------------------
    function displayScoreResult() {
        let scoreResult = $('<div id="score-result"></div>');
        scoreResult.html(`Your score is: ${score}`);
        gameArea.append(scoreResult);
    }


    // Function to update the score and timer UI---------------------------------------------------------------------------
    function updateUI() {
        $('#score').text(score);
        let widthPercentage = (timeLeft / 30) * 100;
        let color = `rgb(${255 * (1 - timeLeft / 30)}, ${255 * (timeLeft / 30)}, 0)`;
        $('#time-left').css({ width: widthPercentage + '%', backgroundColor: color });
    }

    // Function to generate and place a new slug on the screen---------------------------------------------------------------------------
    function generateSlug() {
        let randomChance = Math.random();
        if (randomChance < 0.1) {
            generateRedSlug();
        } else if (randomChance < 0.2) { // 20% chance for a green slug
            generateGreenSlug();
        } else {
            let slug = $('<div class="slug"></div>').css({
                top: 0,
                left: Math.floor(Math.random() * (gameArea.width() - 60)),
                backgroundImage: 'url(Images/8bit-slug.png)' // Path to slug image
            }).click(function() {
                showFeedbackText($(this), "+1");
                $(this).effect('explode', 500, function() { $(this).remove(); });
                score++;
                updateUI();
            });

            gameArea.append(slug);
            moveSlug(slug);
        }
    }

    // Function to generate and place a red slug---------------------------------------------------------------------------
    function generateRedSlug() {
        let redSlug = $('<div class="slug red-slug"></div>').css({
            top: 0,
            left: Math.floor(Math.random() * (gameArea.width() - 60)),
            backgroundImage: 'url(Images/red-slug.png)'
        }).click(function() {
            showFeedbackText($(this), "Game Over");
            endGame(); // End the game if a red slug is clicked
        });

        gameArea.append(redSlug);
        moveSlug(redSlug);
    }

    // Function to generate and place a green slug---------------------------------------------------------------------------
    function generateGreenSlug() {
        let greenSlug = $('<div class="slug green-slug"></div>').css({
            top: 0,
            left: Math.floor(Math.random() * (gameArea.width() - 60)),
            backgroundImage: 'url(Images/green-slug.png)'
        }).click(function() {
            showFeedbackText($(this), "+2");
            $(this).effect('explode', 500, function() { $(this).remove(); });
            score += 2; // Double points for green slug
            updateUI();
        });

        gameArea.append(greenSlug);
        moveSlug(greenSlug, true); // Pass true to indicate it's a green slug
    }

    // Function to move the slug down the screen----------------------------------------------------------------------------
    function moveSlug(slug, isGreenSlug = false) {
        let moveInterval = setInterval(() => {
            let currentTop = slug.position().top;
            let speed = parseInt($('#speed-slider').val()); // Get current speed from slider
            if (slug.hasClass('red-slug')) {
                speed += 5; // Red slugs fall faster
            } else if (isGreenSlug) {
                speed *= 2; // Green slugs fall two times faster
            }

            if (currentTop < gameArea.height() - 100) {
                slug.css('top', currentTop + speed);
            } else {
                slug.remove();
                clearInterval(moveInterval);
            }
        }, 50);
    }

    //Function to show the feedback numbers when the slugs are pressed----------------------------------------------------------------
    function showFeedbackText(slugElement, text) {
        let feedback = $('<div class="feedback-text">' + text + '</div>');
        feedback.css({
            top: slugElement.position().top,
            left: slugElement.position().left
        });
        gameArea.append(feedback);
        feedback.fadeOut(1000, function() { $(this).remove(); });
    }
    
    createGameUI();

    // Event listener for the end game button-------------------------------------------
    $('#end-game-button').click(function() {
        endGame();
        $(this).hide();
    });

    // Event listener for speed slider---------------------------------------------------------------------------
    $('#speed-slider').on('input change', function() {
        $('#speed-value').text($(this).val()); // Update the speed display
    });

    // Event listener for closing the end screen---------------------------------------------------------------------------
    $('#close-end-screen').click(function() {
        $('#end-screen').hide();
    });

    // Event listener for the play again button---------------------------------------------------------------------------
    $('#play-again-button').click(function() {
        $('#end-screen').hide();
        createGameUI();
    });

});
//------------------------------------------------------------------------------------------------------------------------------------------------------