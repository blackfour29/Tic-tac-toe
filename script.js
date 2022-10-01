(function() {

  const gameboard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];
    let winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    
    const setBoardCell = (cellNumber, icon) => {
      board[cellNumber] = icon;
    }

    const getCell = (cellNumber) => {
      return board[cellNumber];
    }

    const hasThreeInARow = (icon) => {

      for(combination of winningCombinations)
      {
        if(board[combination[0]] === icon && board[combination[1]] === icon && board[combination[2]] === icon)
        {
          return true;
        }
      }
      return false;
    }

    const clearBoard = () => {
      for(let i=0; i <= board.length-1; i++){
        board[i] = '';
      }
    }

    const boardIsFull = () => {
      for(let i=0; i<=board.length-1; i++){
        if(!board[i]){
          return false;
        }
      }
      return true;
    }

    return {setBoardCell, getCell, hasThreeInARow, clearBoard, boardIsFull}
  })();

  const controller = (() => {
    let playerIcon = 'X';
    let aiIcon = '0';
    let playerTurn;

    if(playerIcon === 'X'){
      playerTurn = 'player';
    }
    else{
      playerTurn = 'AI';
    }

    const setPlayerIcon = (option) => {
      playerIcon = option;
    }

    const checkValidMove = (choice) =>
    {
      if(gameboard.getCell(choice)){
        return false;
      }
      return true;
    };

    const getAiChoice = () => {
      return Math.floor(Math.random() * 9);
    };

    const checkVictory = (icon) => {
      if(gameboard.hasThreeInARow(icon))
      {
        return 1;
      }
      return 0;
    }

    const setAiMove = () => {
        let aiChoice = getAiChoice();
        let validMove = checkValidMove(aiChoice);
        while(!validMove)
        {
          aiChoice = getAiChoice();
          validMove = checkValidMove(aiChoice);
        }
        gameboard.setBoardCell(aiChoice, aiIcon);
        DOM.setUiCell(aiChoice, aiIcon);
        let victory = checkVictory(aiIcon);
        if(victory){
          DOM.showWinnerUI(aiIcon);
        }
        else if(gameboard.boardIsFull()){
          DOM.showWinnerUI();
        }
        else{
          swapTurns();
        }
    };

    const swapTurns = () => {
      if(playerTurn === 'player')
      {
        playerTurn = 'AI';
        setAiMove();
      }
      else if(playerTurn === 'AI')
      {
        playerTurn = 'player';
      }
    };

    const setMove = (event) => {
      if(playerTurn === 'player')
      {
        let selection = event.target.classList[1]; // cell class that was picked eg. cell5, cell6
        selection = selection[selection.length-1]; // number of the cell that was picked, eg. 5, 6
        let validMove = checkValidMove(selection);
        if(validMove)
        {
          gameboard.setBoardCell(selection, playerIcon);
          DOM.setUiCell(selection, playerIcon);
          let victory = checkVictory(playerIcon);
          if(victory){
            DOM.showWinnerUI(playerIcon);
          }
          else if(gameboard.boardIsFull()){
            DOM.showWinnerUI();
          }
          else{
            swapTurns();
          }
        }
      }
    };

    const resetGame = () => {
      DOM.resetUI();
      gameboard.clearBoard();
      if(playerIcon === 'X'){
        playerTurn = 'player';
      }
      else{
        playerTurn = 'AI';
      }
    }

    return {setMove, resetGame};
  })();

  const DOM = (() => {
    const gameCells = document.querySelectorAll(".cell");
    const overlay = document.querySelector(".overlay");
    const container = document.querySelector(".container");
    const resultContainer = document.querySelector('.result-container');
    const game = document.querySelector(".game");
    const sidebar = document.querySelector(".sidebar");

    gameCells.forEach(cell => {
      cell.addEventListener('click', controller.setMove);
    })

    const setUiCell = (cellNumber, icon) => {
      gameCells[cellNumber].textContent = `${icon}`;
    }

    const displayElements = (...elements) => {
      for(let element of elements){
        element.classList.remove('hidden');
      }
    }

    const blurElements = (...elements) => {
      for(let element of elements){
        element.style.filter = 'blur(8px)';
      }
    }
    
    const hideElements = (...elements) => {
      for(let element of elements){
        element.classList.add('hidden');
      }
    }

    const removeBlur = (...elements) => {
      for(let element of elements){
        element.style.filter = 'blur(0)';
      }
    }

    const setInteraction = (type, ...elements) => {
      for(let element of elements){
        if(type === 'true'){
          element.style.pointerEvents = 'all';
        }
        else if(type === 'false'){
          element.style.pointerEvents = 'none';
        }
      }
    }

    const clearUiCells = () => {
      for(let cell of gameCells){
        cell.textContent = '';
      }
    }

    const showWinnerUI = (icon = '') => {      
      if(!icon){
        resultContainer.textContent = "It's a tie!";
      }
      else{
        resultContainer.textContent = `${icon} wins !`;
      }
      displayElements(overlay, resultContainer);
      setInteraction('false', game, sidebar);
      blurElements(game, sidebar);

      overlay.addEventListener('click', controller.resetGame);
    }

    const resetUI = () => {
      hideElements(overlay, resultContainer);
      removeBlur(game, sidebar);
      setInteraction('true', game, sidebar);
      clearUiCells();
    }

    return {setUiCell, showWinnerUI, resetUI};
  })();


})();