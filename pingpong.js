const canvas = document.querySelector('canvas'); //można też  nadać canvas jakieś id i użyć .getElementById("id")
const ctx = canvas.getContext('2d'); //zawartość tagu canvas

const playerScoreField = document.querySelector('.player');
const aiScoreField = document.querySelector('.ai');

const button = document.querySelector('button');

const resultOfGame = document.querySelector('.announceScore');

const { cw, ch } = canvasSize();

//Na potrzeby TEJ gry wrzucamy wszystkie zmienne do zasięgu globalnego

var { lineWidth, lineHeight, maxScore, playerY, playerScore, aiScore, ballX, startPositionX, ballY, startPositionY, ballSpeedX, isPaused, ballSpeedY, aiSpeed, aiY, ballSize, playerX, paddelWidth, paddelHeight, aiX, ballSpeedChange, aiSpeedChange } = variables();

function canvasSize() {
    canvas.width = 1000; // domyślnie jest 300x150. ps. w JS nie piszemy 1000px tylko 1000 !!
    canvas.height = 500;
    const cw = canvas.width; //tworzymy je po to żeby nie pisać co chwilę canvas.width i height 
    const ch = canvas.height;
    return { cw, ch };
}

function variables() {
    const ballSize = 20; // zmienne do piłki
    const startPositionX = Math.random() * 100 + cw / 3;
    const startPositionY = Math.random() * ch;
    let ballX;
    let ballY;
    let isPaused = false;
    //let ballMiddleY = ballY + 5;
    const paddelHeight = 100; //zmienne paletki
    const paddelWidth = 20;
    const playerX = 70; // X się nie zmienia bo paletki chodzą tylko w zakresie pionowym
    const aiX = 910;
    let playerY;
    let aiY;
    //let aiMiddleY = aiY + paddelHeight/2;
    const lineWidth = 6; // zmienne przerywanej linii na stole
    const lineHeight = 16;
    let ballSpeedX;
    let ballSpeedY;
    const ballSpeedChange = 0.3;
    let aiSpeed;
    const aiSpeedChange = 0.06;
    let playerScore;
    let aiScore;
    let maxScore;
    return { lineWidth, lineHeight, maxScore, playerY, playerScore, aiScore, ballX, startPositionX, ballY, startPositionY, ballSpeedX, ballSpeedY, aiSpeed, aiY, ballSize, playerX, paddelWidth, paddelHeight, aiX, ballSpeedChange, aiSpeedChange };
}

// w canvasie co 1/60 sekundy rysujemy od nowa cały rysunek, więc z procesu rysowania tworzymy funkcje, które potem będziemy tylko wywoływać
function table() {
    ctx.fillStyle = 'green'; // kolor wypełnienia. Bedzie aktywny tak długo, dopóki coś go nie nadpisze przez kolejne ctx.fillStyle
    ctx.fillRect(0, 0, cw, ch); //pierwsze 2 parametry to x,y punktu startowego. Następne to ODLEGŁOŚĆ x i y od pktu startu. Można wpisać ręcznie 1000, 500, ale jak później będziemy chcieli zmienić to z cw i ch  jest łatwiej
    for (let linePosition = 20; linePosition < ch; linePosition += 30) {
        ctx.fillStyle = 'grey';
        ctx.fillRect(cw / 2 - lineWidth / 2, linePosition, lineWidth, lineHeight);
    }
}

function setDefault() {
    maxScore = 4;
    playerY = 300;
    playerScore = 0;
    aiScore = 0;
    setTimeout(removeEventListener,60)
    displayScore();
    reset();
}

setDefault();

function removeEventListener(){
    document.removeEventListener('click',setDefault);
    document.removeEventListener('click',announce);
    document.removeEventListener('click',pause);

}

function displayScore() {
    playerScoreField.textContent = playerScore;
    aiScoreField.textContent = aiScore;
}

function reset() {
    if ((playerScore) >= maxScore) {
        GameOver('gracz');
    }
    if ((aiScore) >= maxScore) {
        GameOver('komputer');
    }
    ballX = startPositionX;
    ballY = startPositionY;
    ballSpeedX = -(Math.random() * 3 + 3);
    ballSpeedY = -2;
    aiSpeed = 2;
    aiY = 300;
}
function announce(winner) {
    resultOfGame.classList.toggle('show');
    resultOfGame.textContent = ('wygrał ' + winner);
}

function GameOver(winner) {
    pause();
    
    announce(winner); 
    document.addEventListener('click',announce);
    document.addEventListener('click',setDefault);
    document.addEventListener('click',pause);
    //  document.removeEventListener('click',setDefault);  

}

function updateScore(winner) {
    if (winner == player) {
        playerScore++;
        playerScoreField.textContent = playerScore;
    } else {
        aiScore++;
        aiScoreField.textContent = aiScore;
    }   
    reset();
}
// rysowanie i zachowanie pilki
function ball() {
    ctx.fillStyle = 'white';
    ctx.fillRect(ballX, ballY, ballSize, ballSize);
    // ruch pilki
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    // przyspieszanie piłki gdy pilka odbija sie od paletek lub scianek
    if (ballY >= ch - ballSize || ballY <= 0) {
        ballSpeedY *= -1;
        speedUp();
    }
    if (ballX <= playerX + paddelWidth && ballX >= playerX && ballY >= playerY - ballSize && ballY <= playerY + paddelHeight) {
        ballSpeedX *= -1;
        speedUp();
    }
    if (ballX >= aiX - ballSize && ballY > aiY - ballSize && ballY < aiY + paddelHeight) {
        ballSpeedX *= -1;
        speedUp();
    }
    //zapisywanie wyniku
    if (ballX <= 0) {
        updateScore(ai);
    }

    if (ballX >= cw - ballSize) {
        updateScore(player);
    }
}
// narysowanie paletki playera
function player() {
    ctx.fillStyle = 'black';
    ctx.fillRect(playerX, playerY, paddelWidth, paddelHeight);
}
// narysowanie paletki ai
function ai() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(aiX, aiY, paddelWidth, paddelHeight);
}
// przyspieszanie pilki i paletki ai
function speedUp() {
    if (ballSpeedX > 0 && ballSpeedX < 16) {
        ballSpeedX += ballSpeedChange;
        aiSpeed += aiSpeedChange;
    }
    if (ballSpeedX < 0 && ballSpeedX > -16) {
        ballSpeedX -= ballSpeedChange;
        aiSpeed += aiSpeedChange;
    }
    if (ballSpeedY > 0 && ballSpeedY < 16) {
        ballSpeedY += ballSpeedChange;
        aiSpeed += aiSpeedChange;
    }
    if (ballSpeedY < 0 && ballSpeedY > -16) {
        ballSpeedY -= ballSpeedChange;
        aiSpeed += aiSpeedChange;
    }
    //console.log(ballSpeedX, ballY, aiSpeed, 'aiY=' + aiY)
}

topCanvas = canvas.offsetTop;

function playerPosition(e) {
    playerY = e.clientY - topCanvas - paddelHeight / 2;
    if (playerY <= 0) {
        playerY = 0;
    }
    if (playerY >= ch - paddelHeight) {
        playerY = ch - paddelHeight;
    }
}
canvas.addEventListener('mousemove', playerPosition);
// sztuczna inteligencja ai
function aiPosition() {
    const ballMiddleY = ballY + ballSize;
    const aiMiddleY = aiY + paddelHeight / 2;
    if (aiMiddleY < ballY - 150) {
        aiY += aiSpeed * 2;
    } else if (aiMiddleY < ballMiddleY) {
        aiY += aiSpeed;
    }
    if (aiMiddleY > ballY + 150) {
        aiY -= aiSpeed * 2;
    } else if (aiMiddleY > ballMiddleY) {
        aiY -= aiSpeed;
    }
    if (aiY + paddelHeight >= ch) {
        aiY = ch - paddelHeight;
    }
    if (aiY <= 0) {
        aiY = 0;
    }
}

function control() {
    //  console.log('aiMidleY='+aiMiddleY,'ballMiddleY= '+ ballMiddleY, 'ballY='+ballY ,'aiY=' +aiY)
}
setInterval(control, 300);
// wywoływanie powyższych funkcji
function game() {
    if (!isPaused) {
        table();
        ball();
        player();
        ai();
        aiPosition();
    } else {
        return;
    }

}

// pauza
function pause() {
    isPaused = !isPaused;
    button.classList.toggle("resume");
    button.classList.toggle("pause");
    if (button.textContent === 'Resume') {
        button.textContent = 'Pause';
    } else {
        button.textContent = 'Resume';
    }

}

button.addEventListener('click', pause);
// odswieżanie gry z f=60Hz
setInterval(game, 1000 / 60);