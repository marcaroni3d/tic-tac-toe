const Gameboard = (() => {
    let board = ['1','2','3','4','5','6','7','8','9'];

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
    return { setField, getField, reset }
})();

const Player = (name, sign) => {
    const getName = () => name;
    const getSign = () => sign;
    return { getName, getSign }
}

const displayController = (() => {
    const gameCells = document.querySelectorAll('.game-cell')

    const updateGameboard = () => {
        for (let i = 0; i < gameCells.length; i++) {
            gameCells[i].textContent = Gameboard.getField(i)
        }
    }

    updateGameboard()
})

// INIT
displayController()