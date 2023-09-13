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
        gameSetupController.removeActiveSelections()
        gameSetupController.showModal()
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


// GAME SETUP MODAL
const gameSetupController = (() => {
    let xUserType = 'Player'
    let oUserType = 'Bot'

    const getXUserType = () => {
        return xUserType
    }
    const getOUserType = () => {
        return oUserType
    }

    const xButtons = document.querySelectorAll('.x-button')
    const oButtons = document.querySelectorAll('.o-button')
    const xPic = document.getElementById('x-pic')
    const oPic = document.getElementById('o-pic')
    const selectionButtons = document.querySelectorAll('.selection-button')
    const startGameButton = document.getElementById('start-game-button')
    const gameSetupModal = document.getElementById('game-setup-modal')

    const showModal = () => {
        gameSetupModal.style.visibility = 'visible'
    }

    const hideModal = () => {
        gameSetupModal.style.visibility = 'hidden'
    }
    
    selectionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const choice = e.target.innerText
            const user = e.target.parentNode.parentNode.id

            if (user === 'x-container') {
                xButtons.forEach(btn => btn.classList.remove('selection-button-active'))
                xUserType = choice
                if (xUserType === 'Player') {
                    xPic.src = 'images/account.svg'
                }
                if (xUserType === 'Bot') {
                    xPic.src = 'images/robot.svg'
                }
            }
            if (user === 'o-container') {
                oButtons.forEach(btn => btn.classList.remove('selection-button-active'))
                oUserType = choice
                if (oUserType === 'Player') {
                    oPic.src = 'images/account.svg'
                }
                if (oUserType === 'Bot') {
                    oPic.src = 'images/robot.svg'
                } 
            }

            button.classList.add('selection-button-active')
        })
    })

    const removeActiveSelections = () => {
        xButtons.forEach(button => {
            button.classList.remove('selection-button-active')
        })
        oButtons.forEach(button => {
            button.classList.remove('selection-button-active')
        })
    }

    startGameButton.addEventListener('click', () => {
        // check that selections are made for both x and o, or default, or give error and return
        gameController.init()
        hideModal()
    })

    return { getXUserType, getOUserType, showModal, hideModal, removeActiveSelections }
})();


// GAME CONTROLLER
const gameController = (() => {
    const playerX = Player('X')
    const playerO = Player('O')
    let currentTurn = 'X'
    let playerXType
    let playerOType
    let round = 1
    let isOver = false

    // game init function to be fired on modal start game button click:
    // grab x & o player types
  
    // trigger getComputerChoice if currentplayer is a bot

    const init = () => {
        playerXType = gameSetupController.getXUserType()
        playerOType = gameSetupController.getOUserType()
    }

    const playRound = (index) => {
        if ((currentTurn === 'X' && playerXType === 'Player') || 
            (currentTurn === 'O' && playerOType === 'Player')) {
            Gameboard.setField(index, getCurrentPlayerSign())
        }
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

    return { init, playRound, getIsOver, reset }
})();

// BOTS
// const bots = (() => {
//     const possibleMoves = [];
//     Gameboard.board.filter((el, i) => {
//         if(el === null) {
//             possibleMoves.push(i)
//         }
//     })
//     const randNum = Math.floor(Math.random() * 9)
//     playRound(randNum)
// })();

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