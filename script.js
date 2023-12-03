document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('board');
    let currentPlayer = 'noirs';
    let selectedPiece = null;
  
    function createPiece(color) {
      const piece = document.createElement('div');
      piece.className = `piece ${color}`;
      return piece;
    }
  
    function isValidMove(startRow, startCol, endRow, endCol, color) {
      const isJump = Math.abs(endRow - startRow) === 2 && Math.abs(endCol - startCol) === 2;
      const jumpedRow = (startRow + endRow) / 2;
      const jumpedCol = (startCol + endCol) / 2;
  
      if (isJump) {
        const jumpedCell = document.querySelector(`.cell[data-row="${jumpedRow}"][data-col="${jumpedCol}"]`);
        const jumpedPiece = jumpedCell.querySelector('.piece');
  
        if (jumpedPiece && !jumpedPiece.classList.contains(color)) {
          jumpedPiece.remove();
          return true;
        } else {
          return false;
        }
      }
  
      const direction = color === 'blancs' ? -1 : 1;
  
      if (
        (direction * (endRow - startRow) === -1 || (color === 'blancs' && endRow < startRow) || (color === 'noirs' && endRow > startRow)) &&
        Math.abs(endCol - startCol) === 1
      ) {
        return true;
      }
  
      return false;
    }
  
    function handleCellClick() {
      const clickedCell = this;
      const clickedRow = parseInt(clickedCell.dataset.row);
      const clickedCol = parseInt(clickedCell.dataset.col);
  
      const isOccupied = clickedCell.querySelector('.piece');
  
      if (selectedPiece && !isOccupied) {
        const startRow = parseInt(selectedPiece.parentElement.dataset.row);
        const startCol = parseInt(selectedPiece.parentElement.dataset.col);
  
        if (isValidMove(startRow, startCol, clickedRow, clickedCol, currentPlayer)) {
          selectedPiece.style.transition = 'transform 0.3s ease';
          selectedPiece.style.transform = `translate(${(clickedCol - startCol) * 60}px, ${(clickedRow - startRow) * 60}px)`;
  
          setTimeout(() => {
            clickedCell.appendChild(selectedPiece);
  
            if ((currentPlayer === 'blancs' && clickedRow === 7) || (currentPlayer === 'noirs' && clickedRow === 0)) {
              selectedPiece.classList.add('queen', currentPlayer);
            }
  
            selectedPiece.classList.remove('selected');
            selectedPiece.style.transition = '';
            selectedPiece.style.transform = 'translate(0, 0)';
            selectedPiece = null;
            currentPlayer = currentPlayer === 'blancs' ? 'noirs' : 'blancs';
  
            checkEndGame();
          }, 300);
        }
      } else {
        const clickedPiece = clickedCell.querySelector('.piece');
  
        if (clickedPiece && clickedPiece.classList.contains(currentPlayer)) {
          if (selectedPiece) {
            selectedPiece.classList.remove('selected');
          }
          selectedPiece = clickedPiece;
          selectedPiece.classList.add('selected');
        }
      }
    }
  
    function checkEndGame() {
      const blancsPieces = document.querySelectorAll('.piece.blancs');
      const noirsPieces = document.querySelectorAll('.piece.noirs');
  
      if (blancsPieces.length === 0) {
        showEndGame('noirs');
      } else if (noirsPieces.length === 0) {
        showEndGame('blancs');
      }
    }
  
    function showEndGame(winner) {
      document.body.classList.add('endgame');
  
      const endgameMessage = document.createElement('h1');
      endgameMessage.classList.add('endgame');
      endgameMessage.textContent = `Victoire des pions ${winner}`;
      document.body.appendChild(endgameMessage);
    }
  
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const cell = document.createElement('div');
        cell.className = `cell ${row % 2 === col % 2 ? 'even' : 'odd'}`;
        cell.dataset.row = row;
        cell.dataset.col = col;
  
        if ((row + col) % 2 === 1 && row < 3) {
          cell.appendChild(createPiece('blancs'));
        } else if ((row + col) % 2 === 1 && row > 4) {
          cell.appendChild(createPiece('noirs'));
        }
  
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
      }
    }
  });
  