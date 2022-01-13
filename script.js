const xClass = 'x'
const circleClass = 'circle'
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
const cells = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessage = document.getElementById('winning-message')
const restartButton = document.getElementById('restart-button')
const winningMessageText = document.getElementById('winning-message-text')
let circleTurn

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
    cells.forEach(cell => {
    cell.classList.remove(xClass)
    cell.classList.remove(circleClass)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true})
    })
    setBoardHoverClass()
    winningMessage.classList.remove('show')
}

function handleClick(e) {
    const cell = e.target
    const currentClass = circleTurn ? circleClass : xClass
    placeMark(cell, currentClass)
    if (checkWin(currentClass)) {
        endGame(false)
    } else if (isDraw()) {
        endGame(true)
    } else {
        swapTurns()
        setBoardHoverClass()
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageText.innerText = 'Draw!'
    } else {
        winningMessageText.innerText = `${circleTurn ? "O" : "X"} Wins!`
    }
    winningMessage.classList.add('show')
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(xClass) || 
        cell.classList.contains(circleClass)
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
}

function swapTurns() {
    circleTurn = !circleTurn
}

function setBoardHoverClass() {
    board.classList.remove(xClass)
    board.classList.remove(circleClass)
    if (circleTurn) {
        board.classList.add(circleClass)
    } else {
        board.classList.add(xClass)
    }
}

function checkWin(currentClass) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass)
        })
    })
}