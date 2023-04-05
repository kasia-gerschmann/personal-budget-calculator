"use strict";
import { sum, clearInputs } from "./utils.js";

let counter = 0;
const formErrors = {
  income: new Set(),
  expense: new Set(),
};

class Entry {
  constructor(id, name, amount, type, elementRef) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.type = type;
    this.elementRef = elementRef;
  }
}

const incomes = [];
const expenses = [];

const formatAmount = (amount) => {
  return amount.toLocaleString(navigator.language, {
    style: "currency",
    currency: "PLN",
  });
};

const onPageLoad = () => {
  const zeroFormatted = formatAmount(0);
  const totalSumEl = document.querySelector("#money-left");
  const incomeSumEl = document.querySelector("#income-sum");
  const expenseSumEl = document.querySelector("#expense-sum");
  totalSumEl.textContent = `Możesz jeszcze wydać ${zeroFormatted}`;
  incomeSumEl.textContent = zeroFormatted;
  expenseSumEl.textContent = zeroFormatted;
};
onPageLoad();

const addIncome = () => {
  addEntry("income");
};

const addExpense = () => {
  addEntry("expense");
};

window.addIncome = addIncome;
window.addExpense = addExpense;

const addEntry = (type) => {
  const nameInput = document.getElementById(`${type}-name`);
  const amountInput = document.getElementById(`${type}-amount`);

  const li = document.createElement("li");
  li.classList.add("list-item");

  const entries = getEntriesByType(type);
  const entry = new Entry(
    counter++,
    nameInput.value.trim(),
    Number(amountInput.value),
    type,
    li
  );
  entries.push(entry);
  li.id = `${type}-${entry.id}`;

  const liContainer = document.createElement("div");
  liContainer.classList.add("list-item__container");
  const amountFormatted = formatAmount(entry.amount);
  liContainer.textContent = `${entry.name}: ${amountFormatted}`;
  li.appendChild(liContainer);

  const divForButtons = document.createElement("div");
  divForButtons.classList.add("icons-container");
  liContainer.appendChild(divForButtons);

  const editButton = document.createElement("a");
  editButton.classList.add("action-edit");
  editButton.addEventListener("click", () =>
    editEntry(entry, nameInput, amountInput)
  );
  divForButtons.appendChild(editButton);

  const editButtonIcon = document.createElement("ion-icon");
  editButtonIcon.name = "pencil-outline";
  editButton.appendChild(editButtonIcon);

  const deleteButton = document.createElement("a");
  deleteButton.classList.add("action-delete");
  deleteButton.addEventListener("click", () => deleteEntry(entry));
  divForButtons.appendChild(deleteButton);

  const deleteButtonIcon = document.createElement("ion-icon");
  deleteButtonIcon.name = "trash-outline";
  deleteButton.appendChild(deleteButtonIcon);

  const ul = document.getElementById(`${type}-list`);
  ul.appendChild(li);

  clearInputs(nameInput, amountInput);
  updateSum(type);
  updateTotalSum();
  const button = document.getElementById(`${entry.type}-btn`);
  button.textContent = "dodaj";
};

const calculateEntriesSum = (type) => {
  const entries = getEntriesByType(type);
  return sum(entries.map((entry) => entry.amount));
};

const updateSum = (type) => {
  const sumEl = document.getElementById(`${type}-sum`);
  const sumFormatted = formatAmount(calculateEntriesSum(type));
  sumEl.textContent = sumFormatted;
};

const deleteEntryWithoutRecalculation = (entry) => {
  entry.elementRef.remove();
  const entries = getEntriesByType(entry.type);
  const entryIndex = entries.indexOf(entry);
  entries.splice(entryIndex, 1);
};

const deleteEntry = (entry) => {
  deleteEntryWithoutRecalculation(entry);
  updateSum(entry.type);
  updateTotalSum();
};

const editEntry = (entry, nameInput, amountInput) => {
  const button = document.getElementById(`${entry.type}-btn`);
  nameInput.value = entry.name;
  amountInput.value = entry.amount;
  deleteEntryWithoutRecalculation(entry);
  button.textContent = "zmień";
};

const getEntriesByType = (type) => {
  return type === "income" ? incomes : expenses;
};

const updateTotalSum = () => {
  const headerSumEl = document.getElementById("money-left");
  const finalSum =
    calculateEntriesSum("income") - calculateEntriesSum("expense");
  const finalSumFormatted = formatAmount(finalSum);
  if (finalSum > 0) {
    headerSumEl.style.color = "white";
    headerSumEl.textContent = `Możesz jeszcze wydać ${finalSumFormatted}`;
  } else if (finalSum < 0) {
    headerSumEl.style.color = "rgb(190,61,56)";
    headerSumEl.textContent = `Bilans jest ujemny. Jesteś na minusie ${finalSumFormatted}`;
  } else {
    headerSumEl.style.color = "white";
    headerSumEl.textContent = `Bilans wynosi zero`;
  }
};

const onIncomeNameInput = () => {
  onNameInput("income");
};
window.onIncomeNameInput = onIncomeNameInput;

const onIncomeAmountInput = () => {
  onAmountInput("income");
};
window.onIncomeAmountInput = onIncomeAmountInput;

const onExpenseNameInput = () => {
  onNameInput("expense");
};
window.onExpenseNameInput = onExpenseNameInput;

const onExpenseAmountInput = () => {
  onAmountInput("expense");
};
window.onExpenseAmountInput = onExpenseAmountInput;

function onNameInput(type) {
  let invalid = false;
  let errorText = ``;
  let name = document.forms[`${type}-form`][`${type}-name`].value;

  if (!name || !name.trim()) {
    invalid = true;
    errorText += `Nazwa nie może być pusta!`;
  }

  const nameError = document.getElementById(`${type}-name-error`);
  if (invalid) {
    formErrors[type].add("name");
    nameError.textContent = errorText;
    nameError.classList.remove("hidden");
  } else {
    formErrors[type].delete("name");
    nameError.textContent = ``;
    nameError.classList.add("hidden");
  }

  toggleAddButton(type);
}

function onAmountInput(type) {
  let invalid = false;
  let errorText = ``;
  let amount = document.forms[`${type}-form`][`${type}-amount`].value;

  if (!amount || Number(amount) === 0) {
    invalid = true;
    errorText += `Kwota nie może być pusta!`;
  }

  if (amount < 0) {
    invalid = true;
    errorText += `Kwota nie może być ujemna!`;
  }

  if (amount > 1000000000) {
    invalid = true;
    errorText += `Kwota nie może przekraczać PLN 1MLD!`;
  }

  const amountError = document.getElementById(`${type}-amount-error`);
  if (invalid) {
    formErrors[type].add("amount");
    amountError.textContent = errorText;
    amountError.classList.remove("hidden");
  } else {
    formErrors[type].delete("amount");
    amountError.textContent = ``;
    amountError.classList.add("hidden");
  }

  toggleAddButton(type);
}

function toggleAddButton(type) {
  const addButton = document.getElementById(`${type}-btn`);
  const invalid = formErrors[type].size !== 0;
  if (invalid) {
    addButton.classList.add("no-pointer-events");
  } else {
    addButton.classList.remove("no-pointer-events");
  }
}
