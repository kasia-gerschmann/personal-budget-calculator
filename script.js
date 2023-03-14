/*
* 1) input tabeli 1) Nazwa i 2) Amount
* 2) wyswietlenie powyzszych w liscie, w  jednej linii
* 3) wyswietlenie sumy na dole kazdego blocku
* 4) wyswietlenie sumy dwoch blokow (wydatki z minusem) w
primary headerze
* 5) mozliwosc edycji i usuniecia inputu z tabeli
*
* */
"use strict";
import {sum, clearInputs} from './utils.js';
//************* GENERAL *************//

let counter = 0;

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
    return amount.toLocaleString(navigator.language, {style: "currency", currency: "PLN"});
}

const onPageLoad = () => {
    const zeroFormatted = formatAmount(0);
    const totalSumEl = document.querySelector("#money-left");
    const incomeSumEl = document.querySelector("#income-sum");
    const expenseSumEl = document.querySelector("#expense-sum");
    totalSumEl.textContent = `Możesz jeszcze wydać ${zeroFormatted}`;
    incomeSumEl.textContent = zeroFormatted;
    expenseSumEl.textContent = zeroFormatted;
}
onPageLoad();

//************* INCOME PART *************//

const addIncome = () => {
    addEntry("income");
}

const addExpense = () => {
    addEntry("expense");
}

window.addIncome = addIncome;
window.addExpense = addExpense;

const addEntry = (type) => {
    // polaczyc sie z formularzem
    const nameInput = document.getElementById(`${type}-name`);
    const amountInput = document.getElementById(`${type}-amount`);

    // stworzyc li
    const li = document.createElement("li");
    li.classList.add("list-item");

    const entries = getEntriesByType(type);
    const entry = new Entry(counter++, nameInput.value, Number(amountInput.value), type, li);
    entries.push(entry);
    li.id = `${type}-${entry.id}`;

    const liContainer = document.createElement("div");
    liContainer.classList.add("list-item__container");
    const amountFormatted = formatAmount(entry.amount);
    liContainer.textContent = `${entry.name}: ${amountFormatted}`;
    li.appendChild(liContainer);

    const divForButtons = document.createElement("div");
    liContainer.appendChild(divForButtons);

    // dodac button edit
    const editButton = document.createElement("a");
    editButton.classList.add("action-edit");
    editButton.addEventListener("click", () => editEntry(entry, nameInput, amountInput));
    divForButtons.appendChild(editButton);

    const editButtonSpan = document.createElement("span");
    editButton.appendChild(editButtonSpan);

    const editButtonSpanIcon = document.createElement("ion-icon");
    editButtonSpanIcon.name = "create-outline";
    editButtonSpan.appendChild(editButtonSpanIcon);

    // dodac button delete
    const deleteButton = document.createElement("a");
    deleteButton.classList.add("action-delete");
    deleteButton.addEventListener("click", () => deleteEntry(entry));
    divForButtons.appendChild(deleteButton);

    const deleteButtonSpan = document.createElement("span");
    deleteButton.appendChild(deleteButtonSpan);

    const deleteButtonSpanIcon = document.createElement("ion-icon");
    deleteButtonSpanIcon.name = "trash-outline";
    deleteButtonSpan.appendChild(deleteButtonSpanIcon);

    // to na koncu zeby bylo bardziej perfomant
    const ul = document.getElementById(`${type}-list`);
    ul.appendChild(li);

    clearInputs(nameInput, amountInput);
    updateSum(type);
    updateTotalSum();
};

const calculateEntriesSum = (type) => {
    const entries = getEntriesByType(type);
    return sum(entries.map(entry => entry.amount));
};

const updateSum = (type) => {
    const sumEl = document.getElementById(`${type}-sum`);
    const sumFormatted = formatAmount(calculateEntriesSum(type));
    sumEl.textContent = sumFormatted;
};

const deleteEntry = (entry) => {
    entry.elementRef.remove();
    const entries = getEntriesByType(entry.type);
    const entryIndex = entries.indexOf(entry);
    entries.splice(entryIndex, 1);
    updateSum(entry.type);
    updateTotalSum();
};

const editEntry = (entry, nameInput, amountInput) => {
    nameInput.value = entry.name;
    amountInput.value = entry.amount;
    deleteEntry(entry);
};

const getEntriesByType = (type) => {
    return type === "income" ? incomes : expenses;
};

//************* HEADER SUM PART *************//

const updateTotalSum = () => {
    const headerSumEl = document.getElementById("money-left");
    const finalSum = calculateEntriesSum("income") - calculateEntriesSum("expense");
    const finalSumFormatted = formatAmount(finalSum);
    if (finalSum >= 0) {
        headerSumEl.style.color = "white";
        headerSumEl.textContent = `Możesz jeszcze wydać ${finalSumFormatted}`;
    } else {
        headerSumEl.style.color = "rgb(190,61,56)";
        headerSumEl.textContent = `Budżet przekroczony o ${finalSumFormatted}`;
    }
};