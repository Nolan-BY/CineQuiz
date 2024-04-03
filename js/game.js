

var gameMode = JSON.parse(localStorage.getItem('gameMode'));
var playerMode = JSON.parse(localStorage.getItem('playerMode'));
var playersNumber = JSON.parse(localStorage.getItem('playersNumber'));
var turnsNumber = JSON.parse(localStorage.getItem('turnsNumber'));
var timeByTurn = JSON.parse(localStorage.getItem('timeByTurn'));
var penalties = JSON.parse(localStorage.getItem('penalties'));
var genre = JSON.parse(localStorage.getItem('genre'));


var page;
var movieNb;

var movie;
var movieTitle;
var movieImg;
var movieImgRand;

var maxPoints = localStorage.setItem('maxPoints', JSON.stringify(timeByTurn*turnsNumber));

var points = (JSON.parse(localStorage.getItem('points')) != null ? JSON.parse(localStorage.getItem('points')) : 0);
var turnNumber = (JSON.parse(localStorage.getItem('turnNumber')) != null ? JSON.parse(localStorage.getItem('turnNumber')) : 1)

var timer = timeByTurn;


const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNWY0M2IwYWM1YmIyNjcyNzAzMzk2ZDVmOGIzNjUzZSIsInN1YiI6IjY2MDViNGMxY2QyZjBmMDE3ZDk0MGZiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oAko1_6hX5GvQxel6I2VepDOXHH_8PKo_X7aCNUXBAY'
    }
  };


function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function gamePreload() {
    page = randomNumber(1, 10);
    movieNb = randomNumber(0, 19);

    fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&page=${page}&with_genres=${genre}`, options)
        .then(response => response.json())
        .then(response => movie = response["results"][movieNb])
        .then(() => gameInit())
        .catch(err => console.error(err));
}

function gameInit() {
    movieTitle = movie["original_title"];
    movieId = movie["id"];
    
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?include_image_language=null`, options)
        .then(response => response.json())
        .then(response => movieImgs = response)
        .then(() => contentFill())
        .catch(err => console.error(err));

}

function contentFill() {

    document.getElementById("turn").innerText = `Tour : ${turnNumber}/${turnsNumber}`;

    if (movieImgs["backdrops"].length == 0) {
        if (movieImgs["posters"].length == 0) {
            gamePreload();
        }
        movieImgRand = randomNumber(1, (movieImgs["posters"].length-1));
        movieImg = movieImgs["posters"][movieImgRand]["file_path"];
    } else {
        movieImgRand = randomNumber(1, (movieImgs["backdrops"].length-1));
        movieImg = movieImgs["backdrops"][movieImgRand]["file_path"];
    }

    document.getElementById("title").innerHTML = `<h1>${gameMode.slice(0, -5)} Guess</h1>`;

    if (gameMode == "ImageGuess") {

        const imageContainer = document.createElement("div");
        const image = document.createElement("img");
        const movieAnswer = document.createElement("div");
        movieAnswer.id = "movie-answer";
        imageContainer.id = "image-row";
        image.id = "image";
        image.src = `https://image.tmdb.org/t/p/original${movieImg}`;

        imageContainer.appendChild(image);
        document.getElementById("game-container").insertBefore(imageContainer, document.getElementById("input-row"));
        document.getElementById("game-container").insertBefore(movieAnswer, document.getElementById("input-row"))
    } 
    // else if (gameMode == "DialogueGuess") {
        
    // } else {

    // }

    gamePlay();
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}


let timerGame;

function validateAnswer() {
    var guess = document.getElementById("input").value;
    var answer = movieTitle.toLowerCase().replace('.', "").split(/(?::|-)+/)[0].split(" ");
    console.log(answer);
    console.log(guess.toLowerCase().trim().split(" "));
    if (guess.toLowerCase().trim().split(" ").every(a => answer.includes(a))) {
        points += timer;
        document.getElementById("input").style.backgroundColor = "rgb(110, 197, 69)";
        setTimeout(() => {
            document.getElementById("input").style.backgroundColor = "white";
        }, 600);
        gameEnd();
    } else {
        if(penalties == "true") {
            points -= timer;
        }
        document.getElementById("input").style.backgroundColor = "rgb(255, 130, 130)";
        document.getElementById("input").value = "";
        setTimeout(() => {
            document.getElementById("input").style.backgroundColor = "white";
        }, 600);
    }
}


function gameEnd() {
    clearInterval(timerGame);

    document.getElementById("points").innerText = `Points : ${points}`;

    document.getElementById("input").disabled = true;
    document.getElementById("validate-input").style.pointerEvents = "none";

    localStorage.setItem('points', JSON.stringify(points));

    document.getElementById("movie-answer").innerHTML = `<u>Réponse : </u> ${movieTitle}`;

    setTimeout(() => {
        if (turnNumber == turnsNumber) {
            turnNumber+=1;
            localStorage.setItem('turnNumber', JSON.stringify(turnNumber));
            window.location.href = './results.html';
        } else {
            turnNumber+=1;
            localStorage.setItem('turnNumber', JSON.stringify(turnNumber));
            window.location.reload();
        }
    }, 3000);
}


function gamePlay() {
    var elapsedTime = 0;
    var blurLevel = timeByTurn;

    timerGame = setInterval(() => {

        elapsedTime+=1;

        if (elapsedTime % 300 === 0) {
            timer--;
        }

        document.getElementById("time").innerText = formatTime(timer);
        document.getElementById("points").innerText = `Points : ${points}`;

        if (gameMode == "ImageGuess") {
            if (blurLevel > 0) {
                blurLevel-=((timer/(timeByTurn/2))/300);
            }
            const filterValue = `blur(${blurLevel}px)`;
            document.getElementById('image').style.filter = filterValue;
        }

        if (timer === 0) {
            gameEnd();
        }

    }, 1);
}