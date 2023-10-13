// instead of main game functionality happening on click,
// create master game manager function
    // let current turn = x
    // check if Bot
        // if so getRandomChoice
    // check if Player
        // if so clicklistener
    
    // loop until winner


// MAIN GAME FUNCTIONALITY
const Player = (sign) => {
    this.sign = sign

    const getSign = () => {
        return sign
    }

    return { getSign }
};

const Gameboard = (() => {
    let board = ['','','','','','','','',''];

    const setField = (index, sign) => {
        if (index > board.length) return
        board[index] = sign
    }
    const getField = (index) => {
        if (index > board.length) return
        return board[index]
    }
    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = ''
        }
    }

    return { board, setField, getField, reset }
})();


// DISPLAY
const displayController = (() => {
    const mainText = document.getElementById('main-text')
    const gameCells = document.querySelectorAll('.game-cell')
    const xScoreDisplay = document.getElementById('x-score-display')
    const oScoreDisplay = document.getElementById('o-score-display')
    const roundDisplay = document.getElementById('round-display')
    const newRoundButton = document.getElementById('new-round-button')
    const newGameButton = document.getElementById('new-game-button')

    gameCells.forEach(cell => 
        cell.addEventListener('click', (e) => {
            if (gameController.getIsOver() || e.target.textContent !== '') return
            gameController.playRound(parseInt(e.target.dataset.index))
            updateGameboard()
        }))

    newRoundButton.onclick = () => {
        statsController.addRoundCount()
        resetGame()
    }

    newGameButton.onclick = () => {
        statsController.clear()
        resetGame()
    }
    
    const resetGame = () => {
        Gameboard.reset()
        gameController.reset()
        updateGameboard()
        setMainText("Player X's turn")
    }

    const updateGameboard = () => {
        for (let i = 0; i < gameCells.length; i++) {
            gameCells[i].textContent = Gameboard.getField(i)
        }
    }

    const setResultMessage = (winner) => {
        setMainText(`Player ${winner} has won!`)
    }

    const setMainText = (message) => {
        mainText.textContent = message
    }

    const updateStats = (xScore, oScore, roundCount) => {
        xScoreDisplay.innerText = xScore
        oScoreDisplay.innerText = oScore
        roundDisplay.innerText = roundCount
    }

    return { setResultMessage, setMainText, updateStats }
})();

// GAME CONTROLLER
const gameController = (() => {
    const playerX = Player('X')
    const playerO = Player('O')
    let round = 1
    let isOver = false

    const playRound = (index) => {
        
        Gameboard.setField(index, getCurrentPlayerSign())

        if (checkWinner(index)) {
            displayController.setResultMessage(getCurrentPlayerSign())
            if (getCurrentPlayerSign() === 'X') {
                statsController.addXScore()
            } 
            if (getCurrentPlayerSign() === 'O') {
                statsController.addOScore()
            }
            isOver = true
            return
        }
        if (round === 9) {
            displayController.setMainText('Draw game')
            isOver = true
            return
        }
        round++
        displayController.setMainText(`Player ${getCurrentPlayerSign()}'s turn`)
    }

    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign()
    }

    const checkWinner = (index) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]

        return winConditions
            .filter(combination => combination.includes(index))
            .some(possibleCombination => 
                possibleCombination.every(
                    i => Gameboard.getField(i) === getCurrentPlayerSign()
                )
            )
    }

    const getIsOver = () => {
        return isOver
    }

    const reset = () => {
        round = 1
        isOver = false
    }

    return { playRound, getIsOver, reset }
})();

const statsController = (() => {
    let xScore = 0
    let oScore = 0
    let roundCount = 1

    const addXScore = () => {
        xScore++
        updateStats()
    }

    const addOScore = () => {
        oScore++
        updateStats()
    }

    const addRoundCount = () => {
        roundCount++
        updateStats()
    }

    const updateStats = () => {
        displayController.updateStats(xScore, oScore, roundCount)
    }

    const clear = () => {
        xScore = 0
        oScore = 0
        roundCount = 1
        updateStats()
    }

    return { addXScore, addOScore, addRoundCount, clear}
})();


// INIT
displayController.setMainText("Player X's turn")
displayController.updateStats(0, 0, 1)