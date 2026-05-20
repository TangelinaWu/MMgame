const GRID_SIZE = 8;
const GRID_SLOTS = GRID_SIZE * GRID_SIZE;

const FOOD_GROUPS = [
  {
    key: "fruit",
    title: "Fruit",
    chain: ["Apple", "Sliced Apple", "Apple Mix", "Apple Pie"],
  },
  {
    key: "bakery",
    title: "Bakery",
    chain: ["Dough", "Sweet Dough", "Pastry Base", "Croissant"],
  },
  {
    key: "protein",
    title: "Protein",
    chain: ["Egg", "Whisked Egg", "Egg Mix", "Omelette"],
  },
  {
    key: "veggie",
    title: "Veggie",
    chain: ["Carrot", "Sliced Carrot", "Veggie Mix", "Carrot Soup"],
  },
];

const state = {
  level: 1,
  coins: 0,
  deliveriesThisLevel: 0,
  selectedCell: null,
  grid: Array.from({ length: GRID_SLOTS }, () => null),
  customers: [],
};

const refs = {
  stats: document.getElementById("stats"),
  customers: document.getElementById("customers"),
  generators: document.getElementById("generators"),
  grid: document.getElementById("grid"),
  message: document.getElementById("message"),
};

function unlockedGroupCount() {
  return Math.min(FOOD_GROUPS.length, 1 + Math.floor((state.level - 1) / 20));
}

function availableGroups() {
  return FOOD_GROUPS.slice(0, unlockedGroupCount());
}

function customerCountForLevel() {
  return Math.min(6, 1 + Math.floor((state.level - 1) / 5));
}

function targetDeliveriesForLevel() {
  return 2 + Math.floor(state.level / 2);
}

function maxOrderTierForLevel() {
  return Math.min(3, Math.floor((state.level - 1) / 10) + 1);
}

function orderPool() {
  const maxTier = maxOrderTierForLevel();
  return availableGroups().flatMap((group) =>
    group.chain.slice(Math.max(1, maxTier - 1), maxTier + 1).map((name) => ({
      name,
      groupKey: group.key,
    }))
  );
}

function randomOrder() {
  const pool = orderPool();
  return pool[Math.floor(Math.random() * pool.length)];
}

function resetCustomers() {
  state.customers = Array.from({ length: customerCountForLevel() }, (_, index) => ({
    id: `${state.level}-${index + 1}`,
    order: randomOrder(),
  }));
}

function showMessage(text) {
  refs.message.textContent = text;
}

function itemLabel(item) {
  return `${item.name}`;
}

function renderStats() {
  refs.stats.textContent = `Level ${state.level} | Coins ${state.coins} | Delivered ${state.deliveriesThisLevel}/${targetDeliveriesForLevel()} | Food Groups ${unlockedGroupCount()}`;
}

function renderCustomers() {
  refs.customers.innerHTML = "";
  state.customers.forEach((customer) => {
    const row = document.createElement("div");
    row.className = "customer";

    const text = document.createElement("span");
    text.textContent = `Order: ${customer.order.name}`;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Deliver";
    button.addEventListener("click", () => deliverOrder(customer.id));

    row.append(text, button);
    refs.customers.append(row);
  });
}

function renderGenerators() {
  refs.generators.innerHTML = "";
  availableGroups().forEach((group) => {
    const row = document.createElement("div");
    row.className = "generator";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${group.title} Generator`;
    button.addEventListener("click", () => spawnIngredient(group.key));

    row.append(button);
    refs.generators.append(row);
  });
}

function renderGrid() {
  refs.grid.innerHTML = "";
  state.grid.forEach((item, index) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = `cell ${item ? "" : "empty"} ${state.selectedCell === index ? "selected" : ""}`.trim();
    cell.textContent = item ? itemLabel(item) : "+";
    cell.addEventListener("click", () => handleGridClick(index));
    refs.grid.append(cell);
  });
}

function rerender() {
  renderStats();
  renderCustomers();
  renderGenerators();
  renderGrid();
}

function firstEmptyCellIndex() {
  return state.grid.findIndex((item) => item === null);
}

function spawnIngredient(groupKey) {
  const targetIndex = firstEmptyCellIndex();
  if (targetIndex === -1) {
    showMessage("Grid is full. Merge or deliver to clear space.");
    return;
  }

  const group = FOOD_GROUPS.find((entry) => entry.key === groupKey);
  state.grid[targetIndex] = {
    groupKey,
    tier: 0,
    name: group.chain[0],
  };
  state.selectedCell = null;
  showMessage(`${group.title} ingredient spawned.`);
  renderGrid();
}

function handleGridClick(index) {
  const item = state.grid[index];
  if (!item) {
    state.selectedCell = null;
    renderGrid();
    return;
  }

  if (state.selectedCell === null) {
    state.selectedCell = index;
    renderGrid();
    return;
  }

  if (state.selectedCell === index) {
    state.selectedCell = null;
    renderGrid();
    return;
  }

  mergeCells(state.selectedCell, index);
}

function mergeCells(fromIndex, toIndex) {
  const source = state.grid[fromIndex];
  const target = state.grid[toIndex];

  if (!source || !target) {
    state.selectedCell = null;
    renderGrid();
    return;
  }

  if (source.groupKey !== target.groupKey || source.tier !== target.tier) {
    showMessage("Only matching ingredients can merge.");
    state.selectedCell = null;
    renderGrid();
    return;
  }

  const group = FOOD_GROUPS.find((entry) => entry.key === source.groupKey);
  const nextTier = source.tier + 1;
  if (nextTier >= group.chain.length) {
    showMessage("This item is already max tier.");
    state.selectedCell = null;
    renderGrid();
    return;
  }

  state.grid[toIndex] = {
    groupKey: source.groupKey,
    tier: nextTier,
    name: group.chain[nextTier],
  };
  state.grid[fromIndex] = null;
  state.selectedCell = null;
  showMessage(`Merged into ${group.chain[nextTier]}!`);
  renderGrid();
}

function deliverOrder(customerId) {
  const customer = state.customers.find((entry) => entry.id === customerId);
  if (!customer) {
    return;
  }

  const itemIndex = state.grid.findIndex((item) => item && item.name === customer.order.name);
  if (itemIndex === -1) {
    showMessage("Requested dish not ready yet.");
    return;
  }

  state.grid[itemIndex] = null;
  state.coins += 10 + state.level;
  state.deliveriesThisLevel += 1;
  customer.order = randomOrder();
  showMessage("Order delivered!");

  if (state.deliveriesThisLevel >= targetDeliveriesForLevel()) {
    levelUp();
  }

  rerender();
}

function levelUp() {
  state.level += 1;
  state.deliveriesThisLevel = 0;

  const previousGroups = unlockedGroupCountForLevel(state.level - 1);
  const nowGroups = unlockedGroupCount();

  resetCustomers();
  if (nowGroups > previousGroups) {
    showMessage(`Level ${state.level}! New food group unlocked.`);
  } else {
    showMessage(`Level ${state.level}! More customers and harder orders.`);
  }
}

function unlockedGroupCountForLevel(level) {
  return Math.min(FOOD_GROUPS.length, 1 + Math.floor((level - 1) / 20));
}

function init() {
  resetCustomers();
  rerender();
  showMessage("Merge ingredients to cook and serve customer orders.");
}

init();
