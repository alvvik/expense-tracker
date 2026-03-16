const expenseName = document.querySelector("#expenseName");

const expensePrice = document.querySelector("#expensePrice");

const expenseSelect = document.querySelector("#expenseSelect");

const submitForm = document.querySelector("#submitForm");
const formElement = document.querySelector("form");
const expenseList = document.querySelector("#expenseList");

const sort = document.querySelector("#sort");
const sortBtns = document.querySelectorAll("#sort button");
const statsAmount = document.querySelector("#statsAmount");

const toggleModal = document.querySelectorAll(".toggleModal");

const modal = document.querySelector("#modal");
//localstorage

let savedData = JSON.parse(localStorage.getItem("savedData")) || [];

function saveToStorage() {
  localStorage.setItem("savedData", JSON.stringify(savedData));
}

// ui

function render(data = savedData) {
  expenseList.innerHTML = ``;

  let list = "";

  data.forEach(({ id, expenseName, expenseAmount, expenseCategory }) => {
    list += `<div class="flex justify-between items-center my-4 bg-sky-900/20 ring ring-sky-800/50 rounded-2xl hover:bg-sky-900/40 transition-colors p-4  "><span class="text-lg font-semibold text-white"> ${expenseName}</span> <span class="text-sm text-sky-400/80">${expenseCategory}</span> ${expenseAmount}zł  <button class="w-12 h-12 bg-red-500/20 rounded-full active:bg-red-500 transition-colors delete" data-id="${id}">x</button> </div> `;
  });

  expenseList.innerHTML = list;
}

function expenseSort(sort = "all") {
  const filteredData = savedData.filter((item) => {
    if (sort === "all") return true;

    return item.expenseCategory.toLowerCase() === sort.toLowerCase();
  });

  render(filteredData);

  calcAmount(filteredData);
}

function renderAmount(amount) {
  statsAmount.innerText = ``;

  statsAmount.innerText = `Łączne wydatki: ${amount.toFixed(2)}zł`;
}

//logic

function addTask(name, amount, category) {
  if (!name.trim() || !amount || amount <= 0) {
    return false;
  }
  const data = {
    id: self.crypto.randomUUID(),

    expenseName: name,

    expenseAmount: amount,

    expenseCategory: category,
  };

  savedData = [...savedData, data];
  saveToStorage();

  return true;
}

function deleteTask(idToDelete) {
  savedData = savedData.filter((item) => item.id !== idToDelete);

  saveToStorage();

  console.log(`usunieto ${idToDelete}`);

  render();
}

function calcAmount(data = savedData) {
  let sum = 0;

  const amount = data.forEach(
    (item) => (sum += parseFloat(item.expenseAmount)),
  );

  renderAmount(sum);
}

//click manager
submitForm.addEventListener("click", (e) => {
  e.preventDefault();

  const name = expenseName.value;
  const amount = expensePrice.value;
  const checkedInput = document.querySelector(
    "input[name='expenseSelect']:checked",
  );
  const category = checkedInput ? checkedInput.value : "Inne";

  const success = addTask(name, amount, category);

  if (!success) {
    // BŁĄD: Pokazujemy czerwone ramki i NIC WIĘCEJ (modal zostaje otwarty)
    expenseName.classList.add("border-red-500", "animate-pulse");
    expensePrice.classList.add("border-red-500", "animate-pulse");
  } else {
    // SUKCES: Czyścimy, renderujemy i FORSUJEMY zamknięcie modalu
    render();
    calcAmount();
    formElement.reset();

    // Używamy .add("hidden") zamiast .toggle() - to bezpieczniejsze
    modal.classList.add("hidden");

    // Czyścimy ramki błędów (na wypadek gdyby przy poprzedniej próbie wystąpiły)
    expenseName.classList.remove("border-red-500", "animate-pulse");
    expensePrice.classList.remove("border-red-500", "animate-pulse");
  }
});
expenseList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const idToDelete = e.target.dataset.id;

    console.log(idToDelete);

    deleteTask(idToDelete);
  }
});

sort.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) {
    sortBtns.forEach((btn) => {
      btn.classList.remove("sort-active");
    });
    const category = btn.id;
    btn.classList.add("sort-active");
    expenseSort(category);
    console.log("Wybrany filtr:", category);
  }
});
toggleModal.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.classList.toggle("hidden");
  });
});

render();
calcAmount();
