const GAMEKEY = 'ape-game-storage-key';
const MAX_LEVEL = 5;
class ApeBrain {
	constructor() {
		this.randomNumbers = null;
		this.started = false;
		this.startButtonEl = document.getElementById("start-button");
        this.resetButtonEl = document.getElementById("reset-button");
		this.clickCounter = 0;
		this.score = 0;
		this.boxes = 2;
		this.startGameCountDownTime = 6;
		this.loadGameState();
		this.addListener();
	}
	start() {
		this.started = false;
		this.clickCounter = 0;
		this.score = 0;
		this.gameStageCountDownTime = MAX_LEVEL - this.gameState.record; // will be level
		this.randomNumbers = this.creatingRandomNumbers(this.boxes);
		this.startButtonEl.classList.remove('d-none');
		this.countDown(this.startGameCountDownTime, () => {
			this.startButtonEl.classList.add('d-none');
			this.renderBoard();
			this.countDown(this.gameStageCountDownTime, () => {
				this.gameStarted();
			});
		}, (seconds) => {
			if(seconds > 3) {
				this.startButtonEl.innerText = "You have " + (MAX_LEVEL - this.gameState.record) + " secs to memorize the boxes";
				this.startButtonEl.style.fontSize = "20px";
                this.startButtonEl.style.padding = "20px";
			} else {
				this.startButtonEl.style.fontSize = "30px";
				this.startButtonEl.innerText = seconds;
			}
		});
	}
	loadGameState() {
		this.gameState = JSON.parse(localStorage.getItem(GAMEKEY));
		if(!this.gameState) {
			this.gameState = {
				record: 0,
				level: 1
                
			};
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
	countDown(timeInSeconds, callback, iterCallback = null) {
		let seconds = timeInSeconds;
		const clock = setInterval(() => {
			seconds--;
			if(seconds === 0) {
				clearInterval(clock);
				callback();
			}
			if(iterCallback) {
				iterCallback(seconds);
			}
		}, 100);
	}
	addListener() {
		const boxContainer = document.getElementById("box-container");
		document.getElementById("score");
		boxContainer.addEventListener("click", (event) => {
			if(!this.started) {
				return;
			}
			this.clickCounter++;
			if(!this.checkClick(event.target.firstElementChild)) {
				// Game Over!
				this.gameOver();
			} else {
				// Hide the clicked number
				event.target.classList.add('invisible');
				this.score++;
				// Update Scores
				if(this.score == this.boxes && this.gameState.level < MAX_LEVEL + 1) {
					this.gameState.level++;
					this.gameState.record++;
					this.score = 0;
					this.nextLevel();
				}
				if(this.gameState.level === MAX_LEVEL + 1) {
					this.gameState.level--; 
					this.gameState.record = MAX_LEVEL;
					this.gameComplete();
				}
			}
			// Game state is always store after a click on the board.
			this.updateGameState();
			this.renderState();
		});
        
        
		this.startButtonEl.addEventListener("click", () => {
			if((this.startButtonEl.innerText === "Start" || "Retry?" || "Next Level" || "Max Score Achieved!!") && (event.detail == 1)) {
				this.start();
			}
			
		});
        
        this.resetButtonEl.addEventListener("click", () => {
		      this.resetScoresButton();
           
    
		});
        
        
	}
	gameOver() {
		this.removeBoxes();
		this.startButtonEl.innerText = "Retry?";
		this.startButtonEl.classList.remove('d-none');
	}
	nextLevel() {
		this.removeBoxes();
		this.startButtonEl.innerText = "Next Level";
		this.startButtonEl.classList.remove('d-none');
	}
	gameComplete() {
		this.removeBoxes();
		this.startButtonEl.innerText = "Max Score Achieved!!";
		this.startButtonEl.classList.remove('d-none');
		this.resetScores();
        
	}
	resetScores() {
		this.gameState.level = 1;
		this.gameState.record = 0;
	}
    
    resetScoresButton(){
        this.resetScores();
        this.updateGameState();
        this.loadGameState();
        this.removeBoxes();
        this.startButtonEl.innerText = "Start";
		this.startButtonEl.classList.remove('d-none');
		
        
    }
    
    
	removeBoxes() {
		Array.from(document.getElementsByClassName('col')).forEach((el, index) => {
			el.remove();
		});
	}
	renderState() {
		const scoreLabel = document.getElementById('score');
		const levelScoreLabel = document.getElementById('level');
		const recordScoreLabel = document.getElementById('record');
		scoreLabel.innerText = this.score;
		levelScoreLabel.innerText = this.gameState.level;
		recordScoreLabel.innerText = this.gameState.record;

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
		for(let i = 0; i < total; i++) {
			randomNumbers.push(i + 1);
		}
		for(let j = total - 1; j >= 0; j--) {
			let swapIndex = Math.floor(Math.random() * j);
			let tmp = randomNumbers[swapIndex];
			randomNumbers[swapIndex] = randomNumbers[j];
			randomNumbers[j] = tmp;
		}
		return randomNumbers;
	}
}
const apeBrain = new ApeBrain();
//console.log(apeBrain.clickCounter);
//apeBrain.randomNumbers = [1];
//console.log(apeBrain.renderBox(10));