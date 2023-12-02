document.addEventListener('DOMContentLoaded', function () {
  const board = document.getElementById('board');
  let currentPlayer = 'black';
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
              // Remove the opponent's piece
              jumpedPiece.remove();
              return true; // The jump is valid
          } else {
              return false; // The jump is not valid (no piece to jump)
          }
      }

      // Check the direction of movement based on the player's color
      const direction = color === 'white' ? -1 : 1;

      if (
          (direction * (endRow - startRow) === -1 || (color === 'white' && endRow < startRow) || (color === 'black' && endRow > startRow)) &&
          Math.abs(endCol - startCol) === 1
      ) {
          // Move one cell in the correct direction or move backward if on the opponent's side
          return true;
      }

      return false; // Invalid move (backward movement or other invalid moves)
  }

  function handleCellClick() {
      const clickedCell = this;
      const clickedRow = parseInt(clickedCell.dataset.row);
      const clickedCol = parseInt(clickedCell.dataset.col);

      // Check if the clicked cell already contains a piece
      const isOccupied = clickedCell.querySelector('.piece');

      if (selectedPiece && !isOccupied) {
          const startRow = parseInt(selectedPiece.parentElement.dataset.row);
          const startCol = parseInt(selectedPiece.parentElement.dataset.col);

          // Check if the move is valid
          if (isValidMove(startRow, startCol, clickedRow, clickedCol, currentPlayer)) {
              // Move with a slight delay to allow the transition effect
              selectedPiece.style.transition = 'transform 0.3s ease'; // Apply transition
              selectedPiece.style.transform = `translate(${(clickedCol - startCol) * 60}px, ${(clickedRow - startRow) * 60}px)`;

              // Switch to the next player after the transition is complete
              setTimeout(() => {
                  clickedCell.appendChild(selectedPiece);

                  // Check if a piece reaches the opposite edge and promote it to a Queen
                  if ((currentPlayer === 'white' && clickedRow === 7) || (currentPlayer === 'black' && clickedRow === 0)) {
                      selectedPiece.classList.add('queen', currentPlayer);
                  }

                  selectedPiece.classList.remove('selected');
                  selectedPiece.style.transition = ''; // Reset transition
                  selectedPiece.style.transform = 'translate(0, 0)'; // Reset transform
                  selectedPiece = null;
                  currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
              }, 300); // 300 milliseconds is the duration of the transition
          }
      } else {
          const clickedPiece = clickedCell.querySelector('.piece');

          if (clickedPiece && clickedPiece.classList.contains(currentPlayer)) {
              // Toggle the selected state
              if (selectedPiece) {
                  selectedPiece.classList.remove('selected');
              }
              selectedPiece = clickedPiece;
              selectedPiece.classList.add('selected');
          }
      }
  }

  for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
          const cell = document.createElement('div');
          cell.className = `cell ${row % 2 === col % 2 ? 'even' : 'odd'}`;
          cell.dataset.row = row;
          cell.dataset.col = col;

          if ((row + col) % 2 === 1 && row < 3) {
              cell.appendChild(createPiece('white'));
          } else if ((row + col) % 2 === 1 && row > 4) {
              cell.appendChild(createPiece('black'));
          }

          cell.addEventListener('click', handleCellClick);
          board.appendChild(cell);
      }
  }
});
