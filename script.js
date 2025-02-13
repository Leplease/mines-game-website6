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

  function updateBalance() {
    currentBalanceText.textContent = balance.toFixed(2);
  }

  setBalanceBtn.addEventListener("click", () => {
    let newBalance = parseFloat(balanceInput.value);
    if (newBalance > 0) {
      balance = newBalance;
      updateBalance();
    }
  });

  addBalanceBtn.addEventListener("click", () => {
    let addAmount = parseFloat(addBalanceInput.value);
    if (addAmount > 0) {
      balance += addAmount;
      updateBalance();
    }
  });

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

  function computeMultiplier(safeClicks, mineCount) {
    let totalSafeCells = gridSize - mineCount;
    return (1 + (mineCount / totalSafeCells)) ** safeClicks;
  }

  function updateMultiplier() {
    let mineCount = parseInt(minesInput.value);
    multiplier = computeMultiplier(revealedCells, mineCount);
    multiplierText.textContent = multiplier.toFixed(2) + "x";
  }

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

  function endGame(won) {
    playing = false;
    if (won) {
      balance += betAmount * multiplier;
    }
    updateBalance();
  }

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

  cashOutBtn.addEventListener("click", () => {
    if (playing) {
      endGame(true);
    }
  });

  createGrid();
  updateBalance();
});
