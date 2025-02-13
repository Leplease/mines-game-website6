document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const currentBalanceText = document.getElementById("currentBalance");
  const balanceInput = document.getElementById("balanceInput");
  const setBalanceBtn = document.getElementById("setBalance");
  const addBalanceInput = document.getElementById("addBalanceInput");
  const addBalanceBtn = document.getElementById("addBalanceBtn");
  const betInput = document.getElementById("betInput");
  const minesInput = document.getElementById("mines");
  const startGameBtn = document.getElementById("startGame");
  const cashOutBtn = document.getElementById("cashOut");
  const multiplierText = document.getElementById("multiplier");

  let balance = 100;
  let betAmount = 0;
  let multiplier = 1.00;
  let playing = false;
  let minePositions = [];
  let revealedCells = 0;
  const gridSize = 25;

  // Update displayed balance
  function updateBalance() {
    currentBalanceText.textContent = balance.toFixed(2);
  }

  // Set new balance
  setBalanceBtn.addEventListener("click", () => {
    let newBalance = parseFloat(balanceInput.value);
    if (newBalance > 0) {
      balance = newBalance;
      updateBalance();
    }
  });

  // Add balance without affecting game state
  addBalanceBtn.addEventListener("click", () => {
    let addAmount = parseFloat(addBalanceInput.value);
    if (addAmount > 0) {
      balance += addAmount;
      updateBalance();
    }
  });

  // Create the grid
  function createGrid() {
    grid.innerHTML = "";
    for (let i = 0; i < gridSize; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      cell.addEventListener("click", () => handleCellClick(cell));
      grid.appendChild(cell);
    }
  }

  // Randomly place mines based on the user-chosen number
  function placeMines() {
    let mineCount = parseInt(minesInput.value);
    minePositions = [];
    while (minePositions.length < mineCount) {
      let randomIndex = Math.floor(Math.random() * gridSize);
      if (!minePositions.includes(randomIndex)) {
        minePositions.push(randomIndex);
      }
    }
  }

  // Compute the multiplier using an exponential formula
  function computeMultiplier(safeClicks, mineCount) {
    // These parameters can be tweaked to adjust the progression
    let baseIncrement = 0.03;           // Base increase per safe click
    let mineFactor = 0.002 * mineCount;   // Additional factor per mine chosen
    let factor = 1 + baseIncrement + mineFactor;
    return Math.pow(factor, safeClicks);
  }

  // Update the multiplier display
  function updateMultiplier() {
    let mineCount = parseInt(minesInput.value);
    multiplier = computeMultiplier(revealedCells, mineCount);
    multiplierText.textContent = multiplier.toFixed(2) + "x";
  }

  // Handle clicking on a cell
  function handleCellClick(cell) {
    if (!playing || cell.classList.contains("revealed")) return;
    cell.classList.add("revealed");
    const index = parseInt(cell.dataset.index);
    if (minePositions.includes(index)) {
      cell.classList.add("mine");
      endGame(false);
    } else {
      cell.classList.add("gem");
      revealedCells++;
      updateMultiplier();
    }
  }

  // End the game: if won, cash out winnings; if lost, the bet is forfeited
  function endGame(won) {
    playing = false;
    if (won) {
      balance += betAmount * multiplier;
    }
    updateBalance();
  }

  // Start the game: deduct bet, reset state, create grid, and place mines
  startGameBtn.addEventListener("click", () => {
    betAmount = parseFloat(betInput.value);
    if (isNaN(betAmount) || betAmount <= 0) {
      alert("Please enter a valid bet amount.");
      return;
    }
    if (betAmount > balance) {
      alert("Bet amount cannot exceed current balance.");
      return;
    }
    balance -= betAmount;
    updateBalance();
    multiplier = 1.00;
    revealedCells = 0;
    playing = true;
    updateMultiplier();
    createGrid();
    placeMines();
  });

  // Cash Out button: ends the game and applies winnings
  cashOutBtn.addEventListener("click", () => {
    if (playing) {
      endGame(true);
    }
  });

  // Initialize display
  createGrid();
  updateBalance();
});
