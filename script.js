const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let playerTurn = true;
let gameOver = false;
let resultText = document.getElementById('gameResult');

// Initialize game state
const gameState = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

canvas.addEventListener('click', handleClick);

function handleClick(e) {
    if (gameOver) return;

    const x = Math.floor((e.offsetX / canvas.width) * 3);
    const y = Math.floor((e.offsetY / canvas.height) * 3);

    if (gameState[y][x] === null && playerTurn) {
        gameState[y][x] = 'X';
        playerTurn = false;
        drawGame();
        checkWinner();
        if (!gameOver) setTimeout(botMove, 500); // Bot moves after player
    }
}

function botMove() {
    if (gameOver) return;

    const bestMove = minimax(gameState, 'O').index;
    const [row, col] = bestMove;
    gameState[row][col] = 'O';
    playerTurn = true;
    drawGame();
    checkWinner();
}

// Minimax algorithm to find the best move for the bot
function minimax(board, player) {
    const emptyCells = getEmptyCells(board);

    // Check for terminal states (win/loss/draw)
    const winner = evaluateWinner(board);
    if (winner === 'X') return { score: -10 }; // Player win
    if (winner === 'O') return { score: 10 };  // Bot win
    if (emptyCells.length === 0) return { score: 0 };  // Draw

    const moves = [];

    for (let cell of emptyCells) {
        const [row, col] = cell;
        const newBoard = JSON.parse(JSON.stringify(board));
        newBoard[row][col] = player;

        const move = {};
        move.index = [row, col];

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        // Maximize the bot's score
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        // Minimize the player's score
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

function getEmptyCells(board) {
    const emptyCells = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === null) {
                emptyCells.push([i, j]);
            }
        }
    }
    return emptyCells;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#FF6600';
    ctx.lineWidth = 5;

    // Draw grid
    for (let i = 1; i < 3; i++) {
        ctx.moveTo(i * (canvas.width / 3), 0);
        ctx.lineTo(i * (canvas.width / 3), canvas.height);
        ctx.moveTo(0, i * (canvas.height / 3));
        ctx.lineTo(canvas.width, i * (canvas.height / 3));
    }
    ctx.stroke();

    // Draw X's and O's
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameState[i][j]) {
                drawMark(i, j, gameState[i][j]);
            }
        }
    }

    checkWinner();
}

function drawMark(row, col, mark) {
    ctx.font = '80px Poppins';
    ctx.fillStyle = '#FF6600';
    const text = mark === 'X' ? 'X' : 'O';
    ctx.fillText(text, col * (canvas.width / 3) + 40, row * (canvas.height / 3) + 90);
}

function checkWinner() {
    const winningCombos = [
        // Rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Columns
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonals
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameState[a[0]][a[1]] && gameState[a[0]][a[1]] === gameState[b[0]][b[1]] && gameState[a[0]][a[1]] === gameState[c[0]][c[1]]) {
            gameOver = true;
            let emoji = String.fromCodePoint(0x1F600);
            resultText.textContent = gameState[a[0]][a[1]] === 'X' ? "Congratulations! You're the winner!"+emoji : 'Haha, I won! Better luck next time!'+emoji;
            return;
        }
    }

    if (gameState.flat().every(cell => cell)) {
        gameOver = true;
        resultText.textContent = 'It\'s a Draw!';
    }
}

// Check for terminal state (winner)
function evaluateWinner(board) {
    const winningCombos = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
            return board[a[0]][a[1]];
        }
    }

    return null;
}

// Initial draw
drawGame();



// contact section

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Your message has been sent successfully!');
});
