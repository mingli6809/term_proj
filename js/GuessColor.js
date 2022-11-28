function GET(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            callback(this.responseText);

        } else {
            console.log(this.status);
        }
    }
    xhr.open("GET", url);
    xhr.send();
}


let timeLeft = document.getElementById('time');
let colors = document.getElementById('colortext');
let scoreTally = document.getElementById('scoreval');
let correct = document.getElementById('right');
let incorrect = document.getElementById('wrong');
let startBtn = document.getElementById('start');
let highscore = 0;

let randomText, randomColor;
let score = 0;

document.getElementById("exit").addEventListener("click", function () {

    window.location = "/EXIT1";
});

GET("/getscore1", (response) => {
    response = JSON.parse(response);
    highscore = response.score1;
    let h = "<h3 style='color:red'>Hightscore:" + highscore + " </h3>";
    document.getElementById('highscore').innerHTML = h;
    console.log("highscore:" + highscore);

});

function startGame() {
    getCol();
    timeLeft.classList.add('timeLeft');
    startBtn.style.display = 'none';
}

function getCol() {
    let colorsList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

    randomText = Math.floor(Math.random() * 6);
    randomColor = Math.floor(Math.random() * 6);

    colors.innerText = colorsList[randomText];
    colors.style.color = colorsList[randomColor];
}

function out() {
    alert(`out, your score is ${score}`);
   
        GET("/updatescore1?score1=" + score, function (data) {
            if (data) {
                let dataParsed = JSON.parse(data);
                if (dataParsed.status == "fail") {
                    console.log("fail");
                } else {
                    console.log("successful");
                }
            }
        });
        setTimeout(function () {
            //your code to be executed after 1 second
            GET("/getscore1", (response) => {
                response = JSON.parse(response);
                highscore = response.score1;
                let h = "<h3 style='color:red'>Hightscore:" + highscore + " </h3>";
                document.getElementById('highscore').innerHTML = h;
                console.log("highscore:" + highscore);

            });
        }, 300);
  


    setTimeout(() => {
        score = 0;
    }, 100);
    timeLeft.classList.remove('timeLeft');
    startBtn.style.display = 'block';
}

function isWrong() {
    if (randomText != randomColor) {
        getCol();
        score++;

        incorrect.classList.add('clicked');
        timeLeft.classList.remove('timeLeft');
        setTimeout(() => {
            incorrect.classList.remove('clicked');
            timeLeft.classList.add('timeLeft');
        }, 200);
    } else {
        out();
    }
}

function isCorrect() {
    if (randomText == randomColor) {
        getCol();
        score++;

        correct.classList.add('clicked');
        timeLeft.classList.remove('timeLeft');
        setTimeout(() => {
            correct.classList.remove('clicked');
            timeLeft.classList.add('timeLeft');
        }, 200);
    } else {
        out();
    }
}

setInterval(() => {
    let timeWidth = timeLeft.offsetWidth;
    let maxWidth = document.getElementById('progressbar').offsetWidth;

    if (timeWidth > maxWidth) {
        alert(`game over, your score is ${score}`);
        timeLeft.classList.remove('timeLeft');
        startBtn.style.display = 'block';
        setTimeout(() => {
            score = 0;
        }, 100);
    } else {

        scoreTally.innerText = score;


    }
}, 1);