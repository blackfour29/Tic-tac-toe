(function() {

  const gameboard = (() => {
    let board = [null, null, null, null, null, null, null, null, null];

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

    const getBoardCell = (cellNumber) => {
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
        board[i] = null;
      }
    }

    const boardIsFull = () => {
      for(let i=0; i <= board.length-1; i++){
        if(!board[i]){
          return false;
        }
      }
      return true;
    }

    const getBoard = () => {
      return board;
    }

    return {setBoardCell, getBoardCell, hasThreeInARow, clearBoard, boardIsFull, getBoard}
  })();

  const controller = (() => {
    let userIcon = 'X';
    let aiIcon = 'O';
    let playerTurn;
    let aiScore = 0;
    let userScore = 0;
    let gameMode = 'single-player';
    let user2Icon = 'O';
    let botDifficulty = 'easy';

    if(gameMode === 'single-player'){
      if(userIcon === 'X'){
        playerTurn = 'user';
      }
      else{
        playerTurn = 'AI';
      }
    }

    const aiGoesFirst = () => {
        setAiMove();
    }

    const checkValidMove = (choice) =>
    {
      if(gameboard.getBoardCell(choice)){ // if it has a value in it
        return false;
      }
      return true;
    };

    const getAiChoice = () => {
      if(botDifficulty === 'easy' || botDifficulty === 'hard'){
        let randomOption = Math.floor(Math.random() * 9); // 0 - 8
        if(botDifficulty === 'easy'){
          return randomOption;
        }
        else if(botDifficulty === 'hard'){
          let randomChance = Math.floor(Math.random() * 11) // 0 - 10
          if(randomChance <= 7){ // 70% chance of making a perfect move
            return bestMove();
          }
          else{
            return randomOption; // 30% change of a random move
          }
        }
      }
      else if(botDifficulty === 'unbeatable'){
        return bestMove();
      }
    };

    const setAiMove = () => {
      let aiChoice = getAiChoice();
      let validMove = checkValidMove(aiChoice);
      while(!validMove)
      {
        aiChoice = getAiChoice();
        validMove = checkValidMove(aiChoice);
      }
      gameboard.setBoardCell(aiChoice, aiIcon);
      DOM.setUICell(aiChoice, aiIcon);
      const victory = checkWinner(aiIcon);
      if(victory){
        DOM.showWinnerUI(aiIcon);
      }
      else if(checkWinner() === 'tie'){
        DOM.showWinnerUI();
      }
      else{
        swapTurns();
      }
    };

    const swapTurns = () => {
      if(gameMode === 'single-player'){
        if(playerTurn === 'user')
        {
          playerTurn = 'AI';
          setAiMove();
        }
        else if(playerTurn === 'AI')
        {
          playerTurn = 'user';
        }
      }
      else if(gameMode === 'multi-player'){
        if(playerTurn === 'user'){
          playerTurn = 'user2';
        }
        else if(playerTurn === 'user2'){
          playerTurn = 'user';
        }
      }
    };

    const setMove = (event) => {
      if(playerTurn === 'user')
      {
        let playerChoice = event.target.classList[1]; // cell class that was picked eg. cell5, cell6
        playerChoice = playerChoice[playerChoice.length-1]; // number of the cell that was picked, eg. 5, 6
        let validMove = checkValidMove(playerChoice);
        if(validMove)
        {
          gameboard.setBoardCell(playerChoice, userIcon);
          DOM.setUICell(playerChoice, userIcon);
          const victory = checkWinner(userIcon);
          if(victory){
            DOM.showWinnerUI(userIcon);
          }
          else if(checkWinner() === 'tie'){
            DOM.showWinnerUI();
          }
          else{
            swapTurns();
          }
        }
      }
      else if(playerTurn === 'user2'){
        let user2Choice = event.target.classList[1];
        user2Choice = user2Choice[user2Choice.length-1];
        let validMove = checkValidMove(user2Choice);

        if(validMove)
        {
          gameboard.setBoardCell(user2Choice, user2Icon);
          DOM.setUICell(user2Choice, user2Icon);
          let victory = checkWinner(user2Icon);
          if(victory){
            DOM.showWinnerUI(user2Icon);
          }
          else if(checkWinner() === 'tie'){
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

      if(gameMode === 'single-player')
      {
        if(userIcon === 'X'){
          playerTurn = 'user';
        }
        else{
          playerTurn = 'AI';
          aiGoesFirst();
        }
      }
      else if(gameMode === 'multi-player'){
        userIcon = 'X';
        user2Icon = 'O';
      }
    }

    const getUserIcon = () => {
      return userIcon;
    }

    const getAiIcon = () => {
      return aiIcon;
    }

    const increaseScore = (player) => {
      if(player === 'AI'){
        aiScore++;
        DOM.updateScoreUI('AI', aiScore);
      }
      else if(player === 'user'){
        userScore++;
        DOM.updateScoreUI('user', userScore);
      }
    }

    const setUserIcon = (event) => {
      userIcon = event.target.textContent; // X / 0
  
      if(userIcon === 'X'){
        aiIcon = 'O';
      }
      else if(userIcon === 'O'){
        aiIcon = 'X';
      }

      DOM.setUserSelectionUI(event.target);
      resetGame();
    }

    const updateDifficulty = (event) => {
      botDifficulty = event.target.value; // 'easy' / 'hard' / 'unbeatable'
      resetGame();
    }

    const setMultiplayerGameMode = (event) => {
      gameMode = 'multi-player';
      userIcon = 'X';
      aiIcon = 'O'; // if the game mode is changed, the ai's icon needs to reset
      resetGame();
      DOM.setGameModeUI(event.target);
      DOM.hideScoreUI();
      DOM.hideSelectionUI();
      DOM.hideDifficulty();
    }

    const setSinglePlayerGameMode = (event) => {
      gameMode = 'single-player';
      resetGame();
      DOM.setGameModeUI(event.target);
      DOM.showScoreUI();
      DOM.setUserSelectionUI();
      DOM.displaySelectionUI();
      DOM.showDifficulty();
    }

    const getGameMode = () => {
      return gameMode;
    }

    const getUser2Icon = () => {
      return user2Icon;
    }


    const checkWinner = (icon = null) => { // will check if a given player icon won, or in absence of it, the end status of the game
      if(icon){
        if(gameboard.hasThreeInARow(icon)){
          return 1;
        }
        return 0;
      }
      else{
        if(gameboard.hasThreeInARow('X')){
          return 'X';
        }
        else if(gameboard.hasThreeInARow('O')){
          return 'O';
        }
        else if(gameboard.boardIsFull()){
          return 'tie';
        }
        return null;
      }
    }

// minimax implementation below.
// Resource used: https://www.youtube.com/watch?v=trKjYdBASyQ 
// Few improvements by me

    const bestMove = () => { 
      let bestScore = -1000;
      let optimalMove;
      let aiIcon = getAiIcon();
      let userIcon = getUserIcon();

      scores[aiIcon] = 100;
      scores[userIcon] = -100;

      for(let i=0; i <= 8; i++)
      {
        if(!gameboard.getBoardCell(i))
        {
          gameboard.setBoardCell(i, aiIcon);
          let newboard = gameboard.getBoard();
          let score = minimax(newboard, 0, false);
          gameboard.setBoardCell(i, null);
          if(score > bestScore)
          {
            bestScore = score;
            optimalMove = i;
          }
        }
      }
      return optimalMove;
    }

    let scores = {
      O: 100,
      X: -100,
      tie: 0
    }

    const minimax = (board, depth, isMaximizing) => {
      let result = checkWinner(); // returns null, winner or tie
      if(result !== null)
      {
          return scores[result] - depth;
      }

      if(isMaximizing)
      {
        let bestScore = -1000;
        for(let i=0; i <= 8; i++)
        {
          if(!gameboard.getBoardCell(i))  // if the spot is empty
          {
            gameboard.setBoardCell(i, aiIcon);
            let newboard = gameboard.getBoard();
            let score = minimax(newboard, depth+1, false);
            gameboard.setBoardCell(i, null);
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      }
      else
      {
        let bestScore = 1000;
        for(let i=0; i <= 8; i++)
        {
          if(!gameboard.getBoardCell(i))
          {
            gameboard.setBoardCell(i, userIcon);
            let newboard = gameboard.getBoard();
            let score = minimax(newboard, depth+1, true);
            gameboard.setBoardCell(i, null);
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    }

    return {setMove, resetGame, getUserIcon, getAiIcon, increaseScore, setUserIcon, updateDifficulty, setMultiplayerGameMode, setSinglePlayerGameMode, getGameMode, getUser2Icon};
  })();

  const DOM = (() => {
    const gameCells = document.querySelectorAll(".cell");
    const overlay = document.querySelector(".overlay");
    const resultContainer = document.querySelector('.result-container');
    const game = document.querySelector(".game");
    const sidebar = document.querySelector(".sidebar");
    const userScore = document.querySelector('.score__player-value');
    const aiScore = document.querySelector('.score__ai-value');
    const selectionX = document.querySelector('.selection__x');
    const selectionO = document.querySelector('.selection__O');
    const gameModeMultiplayerBtn = document.querySelector('.game-mode__playervsplayer');
    const gameModeSinglePlayerBtn = document.querySelector('.game-mode__playervsai');
    const scoresContainer = document.querySelector('.scores-container');
    const selectionContainer = document.querySelector('.selection-container');
    const difficultyContainer = document.querySelector('.difficulty-container');
    const restartBtn = document.querySelector('.restart-btn');
    const playAgainBtn = document.querySelector('.play-again-btn');
    const selectEl = document.querySelector('#difficulty__options');

    gameCells.forEach(cell => {
      cell.addEventListener('click', controller.setMove);
    })

    selectionX.addEventListener('click', controller.setUserIcon);
    selectionO.addEventListener('click', controller.setUserIcon);

    gameModeMultiplayerBtn.addEventListener('click', controller.setMultiplayerGameMode);
    gameModeSinglePlayerBtn.addEventListener('click', controller.setSinglePlayerGameMode);

    restartBtn.addEventListener('click', controller.resetGame);
    playAgainBtn.addEventListener('click', controller.resetGame);

    selectEl.addEventListener('input', controller.updateDifficulty);

    const setUICell = (cellNumber, icon) => {
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

    const clearUICells = () => {
      for(let cell of gameCells){
        cell.textContent = '';
      }
    }

    const showWinnerUI = (icon = '') => {     // if no icon is passed => no winner => tie
      if(!icon){
        resultContainer.textContent = "It's a tie!";
      }
      else{
        resultContainer.textContent = `${icon} wins !`;
        if(controller.getGameMode() === 'single-player'){
          if(controller.getUserIcon() === icon){
            controller.increaseScore('user');
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
      clearUICells();
    }

    const updateScoreUI = (player, scoreValue) => {
      if(player === 'user'){
        userScore.textContent = scoreValue;
      }
      else if(player === 'AI'){
        aiScore.textContent = scoreValue;
      }
    }

    const setUserSelectionUI = (element = '') => { // no argument passe => default case with X selected
      if(element === selectionX || !element){
        selectionX.style.border = '2px solid #000';
        selectionO.style.border = 'none';
      }
      else if(element === selectionO){
        selectionO.style.border = '2px solid #000';
        selectionX.style.border = 'none';
      }
    }

    const setGameModeUI = (element) => {
      if(element === gameModeMultiplayerBtn){
        gameModeMultiplayerBtn.style.border = '2px solid #000';
        gameModeSinglePlayerBtn.style.border = 'none';
      }
      else if(element === gameModeSinglePlayerBtn){
        gameModeSinglePlayerBtn.style.border = '2px solid #000';
        gameModeMultiplayerBtn.style.border = 'none';
      }
    }

    const hideScoreUI = () => {
      hideElements(scoresContainer);
    }

    const showScoreUI = () => {
      displayElements(scoresContainer);
    }

    const hideSelectionUI = () => {
      hideElements(selectionContainer);
    }

    const displaySelectionUI = () => {
      displayElements(selectionContainer);
    }

    const hideDifficulty = () => {
      hideElements(difficultyContainer);
    }

    const showDifficulty = () => {
      displayElements(difficultyContainer);
    }
    
    return {setUICell, showWinnerUI, resetUI, updateScoreUI, setUserSelectionUI, hideScoreUI, showScoreUI, setGameModeUI, hideSelectionUI, displaySelectionUI, hideDifficulty, showDifficulty};
  })();

})();
