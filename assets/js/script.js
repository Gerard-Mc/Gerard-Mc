class ApeBrain {
    constructor(maxBoxes, startGameCountDownTime, gameStageCountDownTime) {
        this.randomNumbers = null;
        this.started = false;
        this.startButtonEl = document.getElementById("start-button");
        this.clickCounter = 0;
        this.maxBoxes = maxBoxes;
        this.startGameCountDownTime = startGameCountDownTime;
        this.gameStageCountDownTime = gameStageCountDownTime;
        this.addListener();

    }

    start() {

        this.started = false;
        this.clickCounter = 0;
        this.randomNumbers = this.creatingRandomNumbers(this.maxBoxes);
        this.startButtonEl.classList.remove('d-none');
        this.countDown(this.startGameCountDownTime, () => {
            this.startButtonEl.classList.add('d-none');
            this.renderBoard();
            this.countDown(this.gameStageCountDownTime, () => {
                
                this.gameStarted();
            });
        });

    }

    gameStarted() {
        Array.from(document.getElementsByClassName('number')).forEach((el, index) => {
            el.innerHTML = ''
        });
        this.started = true;

    }

      countDown(timeInSeconds, callback) {
        let seconds = timeInSeconds;
        const clock = setInterval(() => {
            seconds--;
            
            if(seconds > 3){
            this.startButtonEl.innerText = "You have 2 seconds to memorize the board";
            this.startButtonEl.classList.add("change-font-size");
            }
            
            else{
                this.startButtonEl.innerText = seconds;
                this.startButtonEl.classList.remove("change-font-size");
            }
            
            
            if (seconds === 0) {
                this.startButtonEl.classList.add('d-none');
                clearInterval(clock);
                callback();
            }

        }, 800);
    }

   addListener(){
        const boxContainer = document.getElementById("box-container");
        boxContainer.addEventListener("click", (event) => {

            if (!this.started) {
                return;
            }
            
            this.clickCounter++;

         if (!this.checkClick(event.target.firstElementChild)) {
                Array.from(document.getElementsByClassName('col')).forEach((el, index) => {
                    el.remove();
                });

            } else {

                event.target.classList.add('invisible');
            }

        });
        
        this.startButtonEl.addEventListener("click", () => {
            if (this.startButtonEl.innerText === "Start" && (event.detail == 1)) {
                this.start();


            }
        });

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

const apeBrain = new ApeBrain(9, 6, 2);

// console.log(apeBrainGame.started);
// apeBrainGame.randomNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// console.log(apeBrainGame.renderBox(10));