const resultOverlay = document.getElementById('resultOverlay');
const resultMessage = document.getElementById('resultMessage');
const closeResultBtn = document.getElementById('closeResultBtn');
closeResultBtn.addEventListener('click', () => {
    resultOverlay.classList.add('hidden');
});

class TicTacToe {
    constructor() {
        this.playBtn = document.getElementById('play');
        this.menu = document.getElementById('menu');
        this.playAIButton = document.getElementById('playAI');
        this.playFriendButton = document.getElementById('playFriend');
        this.board = document.getElementById('board');
        this.resetBtn = document.getElementById('reset');
        this.playerXScoreDisplay = document.getElementById('playerXScore');
        this.playerOScoreDisplay = document.getElementById('playerOScore');

        this.currentPlayer = 'X';
        this.cells = Array.from({ length: 9 });
        this.isAiTurn = false;
        this.isPlayingAI = false;
        this.playerXScore = 0;
        this.playerOScore = 0;

        this.playBtn.addEventListener('click', () => this.handlePlayClick());
        this.playAIButton.addEventListener('click', () => this.handlePlayAI());
        this.playFriendButton.addEventListener('click', () => this.handlePlayFriend());
        this.resetBtn.addEventListener('click', () => this.resetBoard());

        this.easyBtn = document.getElementById('easy');
        this.mediumBtn = document.getElementById('medium');
        this.hardBtn = document.getElementById('hard');

        this.easyBtn.addEventListener('click', () => this.setDifficulty('easy'));
        this.mediumBtn.addEventListener('click', () => this.setDifficulty('medium'));
        this.hardBtn.addEventListener('click', () => this.setDifficulty('hard'));
    }

    handlePlayClick() {
        this.menu.classList.remove('hidden');
        this.playBtn.classList.add('hidden');
    }

    handlePlayAI() {
        this.isPlayingAI = true;
        this.startGame();
    }

    handlePlayFriend() {
        this.isPlayingAI = false;
        this.startGame();
    }

    setDifficulty(difficulty) {
        console.log(`Выбран уровень сложности: ${difficulty}`);
        // Ваш код для установки уровня сложности
    }

    startGame() {
        this.menu.classList.add('hidden');
        this.playBtn.classList.add('hidden');
        this.resetBtn.classList.remove('hidden');
        this.board.classList.remove('hidden');
        this.board.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', (event) => this.handleClick(event));
            this.board.appendChild(cell);
            this.cells[i] = cell;
        }

        const audio = new Audio('mt.mp3');
        audio.play();

        this.board.style.animation = 'scaleAnimation 3s ease-out';
        setTimeout(() => {
            this.board.style.animation = '';
        }, 4000);
    }

    handleClick(event) {
        const cell = event.target;
        if (!cell.textContent && (!this.isAiTurn || !this.isPlayingAI)) {
            cell.textContent = this.currentPlayer;
            if (this.checkWin()) {
                resultMessage.textContent = `Player ${this.currentPlayer} wins!`;
                resultOverlay.classList.remove('hidden');
                resultOverlay.classList.add('result-win');
                this.updateScore(this.currentPlayer);
                this.resetBoard();
            } else if (this.cells.every(cell => cell.textContent !== '')) {
                resultMessage.textContent = "It's a draw!";
                resultOverlay.classList.remove('hidden');
                resultOverlay.classList.add('result-draw');
                this.resetBoard();
            } else {
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                if (this.isPlayingAI) {
                    this.isAiTurn = !this.isAiTurn;
                    if (this.isAiTurn) {
                        setTimeout(() => this.makeAiMove(), 500);
                    }
                }
            }
        }
    }

    updateScore(winner) {
        if (winner === 'X') {
            this.playerXScore++;
            this.playerXScoreDisplay.textContent = this.playerXScore;
        } else {
            this.playerOScore++;
            this.playerOScoreDisplay.textContent = this.playerOScore;
        }
    }

    checkWin() {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return this.cells[a].textContent && this.cells[a].textContent === this.cells[b].textContent && this.cells[a].textContent === this.cells[c].textContent;
        });
    }

    resetBoard() {
        this.cells.forEach(cell => {
            cell.textContent = '';
        });
        this.currentPlayer = 'X';
        this.isAiTurn = false;
        if (this.isPlayingAI) {
            this.isAiTurn = false;
        }
    }

    makeAiMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells[i].textContent === '') {
                this.cells[i].textContent = 'O';
                let score = this.minimax(this.cells, 0, false);
                this.cells[i].textContent = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        this.cells[move].textContent = this.currentPlayer;

        if (this.checkWin()) {
            resultMessage.textContent = `Player ${this.currentPlayer} wins!`;
            resultOverlay.classList.remove('hidden');
            this.updateScore(this.currentPlayer);
            this.resetBoard();
        } else if (this.cells.every(cell => cell.textContent !== '')) {
            resultMessage.textContent = "It's a draw!";
            resultOverlay.classList.remove('hidden');
            this.resetBoard();
        } else {
            this.currentPlayer = 'X';
            this.isAiTurn = false;
        }
    }

    minimax(cells, depth, isMaximizing) {
        if (this.checkWin()) {
            return isMaximizing ? -1 : 1;
        } else if (this.cells.every(cell => cell.textContent !== '')) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < this.cells.length; i++) {
                if (this.cells[i].textContent === '') {
                    this.cells[i].textContent = 'O';
                    let score = this.minimax(this.cells, depth + 1, false);
                    this.cells[i].textContent = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < this.cells.length; i++) {
                if (this.cells[i].textContent === '') {
                    this.cells[i].textContent = 'X';
                    let score = this.minimax(this.cells, depth + 1, true);
                    this.cells[i].textContent = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
}

const game = new TicTacToe();
