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
    let aiScore = 0;
    let playerScore = 0;
    let gameMode = 'single-player';
    let player2Icon = '0';

    if(gameMode === 'single-player'){
      if(playerIcon === 'X'){
        playerTurn = 'player';
      }
      else{
        playerTurn = 'AI';
      }
    }

    const aiGoesFirst = () => {
      if(playerTurn === 'AI'){
        setAiMove();
      }
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
      if(gameMode === 'single-player'){
        if(playerTurn === 'player')
        {
          playerTurn = 'AI';
          setAiMove();
        }
        else if(playerTurn === 'AI')
        {
          playerTurn = 'player';
        }
      }
      else if(gameMode === 'multi-player'){
        if(playerTurn === 'player'){
          playerTurn = 'player2';
        }
        else if(playerTurn === 'player2'){
          playerTurn = 'player';
        }
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
          const victory = checkVictory(playerIcon);
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
      else if(playerTurn === 'player2'){
        let selection = event.target.classList[1];
        selection = selection[selection.length-1];
        let validMove = checkValidMove(selection);

        if(validMove)
        {
          gameboard.setBoardCell(selection, player2Icon);
          DOM.setUiCell(selection, player2Icon);
          let victory = checkVictory(player2Icon);
          if(victory){
            DOM.showWinnerUI(player2Icon);
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
        aiGoesFirst();
      }
    }

    const getPlayerIcon = () => {
      return playerIcon;
    }

    const getAiIcon = () => {
      return aiIcon;
    }

    const increaseScore = (player) => {
      if(player === 'AI'){
        aiScore++;
        DOM.updateScoreUI('AI', aiScore);
      }
      else if(player === 'player'){
        playerScore++;
        DOM.updateScoreUI('player', playerScore);
      }
    }

    const setUserIcon = (event) => {
      playerIcon = event.target.textContent;
  
      if(playerIcon === 'X'){
        aiIcon = '0';
      }
      else if(playerIcon === '0'){
        aiIcon = 'X';
      }

      DOM.setUserSelection(event.target);

      resetGame();
    }

    const setMultiplayerGameMode = (event) => {
      resetGame();
      gameMode = 'multi-player';
      DOM.setGameMode(event.target);
      DOM.hideScore();
      DOM.hideSelectionUi();
    }

    const setSinglePlayerGameMode = (event) => {
      resetGame();
      gameMode = 'single-player';
      DOM.setGameMode(event.target);
      DOM.showScore();
      DOM.displaySelectionUi();
    }

    const getGameMode = () => {
      return gameMode;
    }

    const getPlayer2Icon = () => {
      return player2Icon;
    }

    return {setMove, resetGame, getPlayerIcon, getAiIcon, increaseScore, setUserIcon, setMultiplayerGameMode, setSinglePlayerGameMode, getGameMode, getPlayer2Icon};
  })();

  const DOM = (() => {
    const gameCells = document.querySelectorAll(".cell");
    const overlay = document.querySelector(".overlay");
    const resultContainer = document.querySelector('.result-container');
    const game = document.querySelector(".game");
    const sidebar = document.querySelector(".sidebar");
    const playerScore = document.querySelector('.score__player-value');
    const aiScore = document.querySelector('.score__ai-value');
    const selectionX = document.querySelector('.selection__x');
    const selection0 = document.querySelector('.selection__0');
    const gameModeMultiplayerBtn = document.querySelector('.game-mode__playervsplayer');
    const gameModeSinglePlayerBtn = document.querySelector('.game-mode__playervsai');
    const scoresContainer = document.querySelector('.scores-container');
    const selectionContainer = document.querySelector('.selection-container');

    gameCells.forEach(cell => {
      cell.addEventListener('click', controller.setMove);
    })

    selectionX.addEventListener('click', controller.setUserIcon);
    selection0.addEventListener('click', controller.setUserIcon);

    gameModeMultiplayerBtn.addEventListener('click', controller.setMultiplayerGameMode);
    gameModeSinglePlayerBtn.addEventListener('click', controller.setSinglePlayerGameMode);

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
        if(controller.getGameMode() === 'single-player'){
          if(controller.getPlayerIcon() === icon){
            controller.increaseScore('player');
          }
          else if(controller.getAiIcon() === icon){
            controller.increaseScore('AI');
          }
        }
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

    const updateScoreUI = (player, scoreValue) => {
      if(player === 'player'){
        playerScore.textContent = scoreValue;
      }
      else if(player === 'AI'){
        aiScore.textContent = scoreValue;
      }
    }


    const setUserSelection = (element) => {
      if(element === selectionX){
        selectionX.style.border = '2px solid #000';
        selection0.style.border = 'none';
      }
      else if(element === selection0){
        selection0.style.border = '2px solid #000';
        selectionX.style.border = 'none';
      }
    }

    const setGameMode = (element) => {
      if(element === gameModeMultiplayerBtn){
        gameModeMultiplayerBtn.style.border = '2px solid #000';
        gameModeSinglePlayerBtn.style.border = 'none';
      }
      else if(element === gameModeSinglePlayerBtn){
        gameModeSinglePlayerBtn.style.border = '2px solid #000';
        gameModeMultiplayerBtn.style.border = 'none';
      }
    }

    const hideScore = () => {
      hideElements(scoresContainer);
    }

    const showScore = () => {
      displayElements(scoresContainer);
    }

    const hideSelectionUi = () => {
      hideElements(selectionContainer);
    }

    const displaySelectionUi = () => {
      displayElements(selectionContainer);
    }
    
    return {setUiCell, showWinnerUI, resetUI, updateScoreUI, setUserSelection, hideScore, showScore, setGameMode, hideSelectionUi, displaySelectionUi};
  })();


})();