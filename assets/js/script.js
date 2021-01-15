const GAMEKEY = 'ape-game-storage-key';
const MAX_LEVEL = 5;

class ApeBrain {
    constructor(boxes, gameStageCountDownTime) {
        this.randomNumbers = null;
        this.started = false;
        this.startButtonEl = document.getElementById("start-button");
        this.clickCounter = 0;

        this.score = 0;
        this.boxes = boxes;
        this.startGameCountDownTime = 0;
        this.gameStageCountDownTime = gameStageCountDownTime;

        this.loadGameState();
        this.addListener();
    }

    start() {
        this.started = false;
        this.clickCounter = 0;
        this.score = 0;
        this.startGameCountDownTime = MAX_LEVEL - this.gameState.level;
        this.randomNumbers = this.creatingRandomNumbers(this.boxes);
        this.startButtonEl.classList.remove('d-none');
        this.countDown(this.startGameCountDownTime, () => {
            this.startButtonEl.classList.add('d-none');
            this.renderBoard();
            this.countDown(this.gameStageCountDownTime, () => {
                this.gameStarted();
            });
        },
            (seconds) => {
                this.startButtonEl.innerText = seconds;
            });
    }

    loadGameState() {
        this.gameState = JSON.parse(localStorage.getItem(GAMEKEY));
        if (!this.gameState) {
            this.gameState = { level: 1, highScore: 0 };
        }
        this.renderState();
    }

    updateGameState() {
        localStorage.setItem(GAMEKEY, JSON.stringify(this.gameState));
    }

    gameStarted() {
        Array.from(document.getElementsByClassName('number')).forEach((el, index) => {
            el.innerHTML = ''
        });
        this.started = true;
    }

    /**
     * 
     * @param {Number} timeInSeconds 
     * @param {Function} callback 
     */
    countDown(timeInSeconds, callback, iterCallback = null) {
        let seconds = timeInSeconds;
        const clock = setInterval(() => {
            seconds--;
            if (seconds === 0) {
                clearInterval(clock);
                callback();
            }
            if (iterCallback) {
                iterCallback(seconds);
            }
        }, 1000);
    }

    addListener() {
        const boxContainer = document.getElementById("box-container");
        document.getElementById("score");

        boxContainer.addEventListener("click", (event) => {
            if (!this.started) {
                return;
            }

            this.clickCounter++;

            if (!this.checkClick(event.target.firstElementChild)) {
                // Game Over!
                this.gameOver();
            }
            else {
                // Hide the clicked number
                event.target.classList.add('invisible');
                this.score++;

                // Check score
                if (this.gameState.highScore < this.score) {
                    this.gameState.highScore = this.score;
                }

                // Player won!!!
                if (this.clickCounter === this.boxes - 1) {
                    if (this.gameState.level < MAX_LEVEL) {
                        this.gameState.level++;
                        this.score = 0;
                        this.gameState.highScore = 0;
                    }
                    this.playerWon();
                }
            }
            // Game state is always store after a click on the board.
            this.updateGameState();
            this.renderState();
        });

        this.startButtonEl.addEventListener("click", () => {
            if ((this.startButtonEl.innerText === "Start" || "Retry?") && (event.detail == 1)) {
                this.start();
            }
        });

    }

    gameOver() {
        this.removeBoxes();
        this.startButtonEl.innerText = "Retry?";
        this.startButtonEl.classList.remove('d-none');
    }

    playerWon() {
        this.removeBoxes();
        this.startButtonEl.innerText = "Retry?";
        this.startButtonEl.classList.remove('d-none');
    }

    removeBoxes() {
        Array.from(document.getElementsByClassName('col')).forEach((el, index) => {
            el.remove();
        });
    }

    renderState() {
        const scoreLabel = document.getElementById('score');
        const highScoreLabel = document.getElementById('high-score');
        const levelLabel = document.getElementById('level');
        scoreLabel.innerText = this.score;
        highScoreLabel.innerText = this.gameState.highScore;
        levelLabel.innerText = this.gameState.level;
    }

    checkClick(boxElement) {
        return parseInt(boxElement.dataset.value) === this.clickCounter;
    }

    renderBoard() {
        const boxContainer = document.getElementById("box-container");
        this.randomNumbers.forEach((item, index) => {
            let col = document.createElement("div");
            col.className = "col";
            col.innerHTML = this.renderBox(index);
            boxContainer.appendChild(col);
        });
    }

    renderBox(index) {
        return `<div class="box" id="number-box-${index}">
                    <p class="box-text number" data-value="${this.randomNumbers[index]}">${this.randomNumbers[index]}</p>
                </div>
            </div>`;
    }

    creatingRandomNumbers(total) {
        var randomNumbers = [];
        for (let i = 0; i < total; i++) {
            randomNumbers.push(i + 1);
        }
        for (let j = total - 1; j >= 0; j--) {
            let swapIndex = Math.floor(Math.random() * j);
            let tmp = randomNumbers[swapIndex];
            randomNumbers[swapIndex] = randomNumbers[j];
            randomNumbers[j] = tmp;
        }
        return randomNumbers;
    }
}

const apeBrain = new ApeBrain(9, 2);

//console.log(apeBrain.clickCounter);
//apeBrain.randomNumbers = [1];
//console.log(apeBrain.renderBox(10));