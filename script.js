// Lav et tomt array til toDoObjects
let toDoArray = [];
let deletedArr = [];
let isNotDone;

deletedArr = toDoArray;

function setItem() {
  let objects = JSON.stringify(deletedArr);
  localStorage.setItem("objects", objects);
}

const toDoNum = document.querySelector("#toDoNum");

// Definer hvor objekter skal skrives ud i DOM'en
const toDoList = document.querySelector("#to-do-list");

// Definer submit knap
const submit = document.querySelector("#submit");

// Definer input felt
const input = document.querySelector("input");

// Når der klikkes på "input", lav et toDoObject
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.querySelector("h3").textContent = "Tasks";

    // Gem input værdien i en variabel
    const inputValue = input.value;

    // Tøm input feltet når der trykkes enter
    input.value = "";

    const toDoObject = {
      // Description skal være hvad der bliver skrevet i "input"
      description: inputValue,

      // ID skal være et tilfældig tal mellem 1 og 5000
      id: Math.floor(Math.random() * 5000) + 1,

      // isCompleted er false som udgangspunkt
      isCompleted: false,

      // isImportant er false som udgangspunkt
      isImportant: false,

      // dueDate sættes tom, da den beriges senere
      dueDate: ``,

      // Objektet er som udgangspunkt deleted: false
      deleted: false,
    };

    // 'toDoObject pushes til toDoArray
    toDoArray.push(toDoObject);

    console.log(toDoArray);
    setItem();

    const isNotDone = toDoArray.filter((task) => task.isCompleted === false);

    // Funktion til at vise i DOM'en erklæres
    displayArray(isNotDone);

    // const completedCount = toDoArray.reduce((count, task) => {
    //   if (task.isCompleted === false) {
    //     return count + 1;
    //   }
    //   return count;
    // }, 0);

    toDoNum.textContent = `(${isNotDone.length})`;
  }
});

function getItem() {
  const retrievedObjects = localStorage.getItem("objects");
  const retrievedArray = JSON.parse(retrievedObjects);
  deletedArr = retrievedArray;
}

function displayArray(taskList = toDoArray) {
  // Definer hvor opgaverne skal vises henne

  if (toDoList.children.length > 0) {
    toDoList.innerHTML = "";
  }

  // forEach toDoObject'er ud i en ny funktion, der skal skabe li elementer i "to-do-list" ul'
  taskList.forEach(displayTasks);
}

function displayTasks(task) {
  // Laver li elementet
  const listItem = document.createElement("li");
  listItem.setAttribute("data-field", task.id);

  // Laver description element
  const taskDescription = document.createElement("p");
  taskDescription.classList.add("description");
  taskDescription.textContent = task.description;

  // Laver date input element og lytter på change i inputtet, tilføjer derefter en dueDate til objektet.

  // Label til dato input laves
  const inputLabel = document.createElement("label");
  inputLabel.classList.add("dueDateTxt");

  inputLabel.textContent = "Assign due date";

  // Selve inputtet laves
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  console.log(dateInput.value);

  // Element der indeholder due date i sig
  const dueDateDescription = document.createElement("p");
  dueDateDescription.classList.add("dueDateTxt");
  // Hvis due date ikke er defineret, lad strengen være tom
  if (task.dueDate === "") {
    dueDateDescription.textContent = "";
    // Hvis due date er defineret, skriv det ud i DOM'en
  } else {
    dueDateDescription.textContent = `Due date: ${task.dueDate}`;
  }

  // Der lyttes på change, hvor værdien af dateInput tilføjes til objektet som dueDate
  dateInput.addEventListener("change", () => {
    // Hvis dato input ændres, bliver objectets dueDate den værdi, der står i dato inputtet
    task.dueDate = dateInput.value;
    console.log(task.dueDate);

    // Her kaldes en funktion der sorterer opgaverne i arrayet efter dueDate
    toDoArray.sort(compareTasks);
    const isNotDone = deletedArr.filter((task) => task.isCompleted === false);
    displayArray(isNotDone);
    setItem();
  });

  // Laver en "done" knap der kan sende objektet videre til "done" ul listen
  const doneButton = document.createElement("button");
  doneButton.classList.add("done-button");
  doneButton.textContent = "Done";

  const undoneButton = document.createElement("button");
  undoneButton.classList.add("undone-button");
  undoneButton.textContent = "Undone";

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "Delete";
  deleteButton.dataset.id = task.id;

  // Laver en "important" knap der kan sende objektet videre til "done" ul listen
  const importantButton = document.createElement("button");
  importantButton.classList.add("important-button");

  importantButton.textContent = "Important";

  // Appender alle elementer til DOM'en under li'en
  listItem.appendChild(taskDescription);
  listItem.appendChild(inputLabel);
  listItem.appendChild(dateInput);
  listItem.appendChild(dueDateDescription);
  listItem.appendChild(doneButton);
  listItem.appendChild(undoneButton);
  listItem.appendChild(importantButton);
  listItem.appendChild(deleteButton);

  // Appender li elementet til ul'en "to-do-list"
  toDoList.appendChild(listItem);

  // Hvis opgaven ikke er markeret færdig skal undoneButton ikke vises
  if (task.isCompleted === false) {
    undoneButton.style.display = "none";
  }

  // Hvis opgaven er markeret færdig skal undoneButton vises
  if (task.isCompleted === true) {
    doneButton.style.display = "none";
    importantButton.style.display = "none";
    dateInput.style.display = "none";
    inputLabel.innerHTML = "";
  }

  // Der lyttes på at når doneButton klikkes, toggles der mellem true og false på isCompleted
  doneButton.addEventListener("click", () => {
    task.isCompleted = !task.isCompleted;

    // Hvis en opgave ikke er markeret "done", skal arrayet filtrere kun på de opgaver, der er klikket "done på"
    isNotDone = deletedArr.filter((task) => task.isCompleted === false);
    document.querySelector("h3").textContent = "Tasks";
    displayArray(isNotDone);

    // Denne funktion tæller hvor mange objekter i arrayet der har isCompleted === true og printer tallet i knappen der viser "completed" tasks
    const completedCount = toDoArray.reduce((count, task) => {
      if (task.isCompleted === true) {
        return count + 1;
      }
      return count;
    }, 0);
    compNum.textContent = `(${completedCount})`;

    toDoNum.textContent = `(${isNotDone.length})`;
    setItem();
    // toDoNum.textContent = `(${toDoArray.length--})`;
  });

  // console.log(isNotDone.length);
  // submit.addEventListener("click", () => {
  //   taskNum = isNotDone.length;
  // });

  // Der lyttes på undoneButton, og hvis der klikkes på den, sendes opgaven tilbage til "to-do-list"
  undoneButton.addEventListener("click", () => {
    task.isCompleted = !task.isCompleted;
    // Hvis en opgave ikke er markeret "done", skal arrayet filtrere kun på de opgaver, der er klikket "done på"
    const isDone = deletedArr.filter((task) => task.isCompleted === true);
    displayArray(isDone);

    const completedCount = toDoArray.reduce((count, task) => {
      if (task.isCompleted === true) {
        return count + 1;
      }
      return count;
    }, 0);
    compNum.textContent = `(${completedCount})`;

    // toDoNum.textContent = `(${isNotDone.length})`;
    // toDoNum.textContent = `(${toDoArray.length})`;

    // Filter the array to get objects with isCompleted: false
    const incompleteTasks = toDoArray.filter((task) => !task.isCompleted);

    // Set the text content to the count of incomplete tasks
    toDoNum.textContent = `(${incompleteTasks.length})`;
    setItem();
  });

  // Der lyttes på at når importantButton klikkes, toggles der mellem true og false på isImportant
  importantButton.addEventListener("click", (e) => {
    task.isImportant = !task.isImportant;

    console.log(task);

    // Arrayet sorteres efter den funktion, der tjekker for om en opgave er vigtig eller har en dato.
    toDoArray.sort(compareTasks);
    const isNotDone = deletedArr.filter((task) => task.isCompleted === false);

    displayArray(isNotDone);
    console.log(toDoArray);

    // const completedCount = toDoArray.reduce((count, task) => {
    //   if (task.isImportant === true) {
    //     return count + 1;
    //   } else {
    //     return count - 1;
    //   }
    // }, 0);

    // impNum.textContent = `(${completedCount})`;

    const completedCount = toDoArray.reduce((count, task) => {
      if (task.isCompleted === true) {
        return count + 1;
      }
      return count;
    }, 0);
    compNum.textContent = `(${completedCount})`;
    setItem();
  });

  // Der lyttes på når deleteButton klikkes. Hvis den klikkes, sætter den deleted property til true, og herefter kaldes et filter der viser alle objekter der har deleted = false
  deleteButton.addEventListener("click", () => {
    //   //TODO TEST DET HER AF
    const id = task.id;
    const found = deletedArr.filter((task) => task.id !== id);
    deletedArr = found;

    displayArray(found);
    console.log(found);

    console.log(deletedArr);
  });
}

// Denne funktion sorterer opgaverne efter deres dueDate. Funktionen gør også at de opgaver hvor isImportant = true, vil den altid rykke op i toppen
function compareTasks(a, b) {
  if (a.isImportant && !b.isImportant) {
    return -1; // Move tasks with isImportant = true to the top
  } else if (!a.isImportant && b.isImportant) {
    return 1; // Move tasks with isImportant = false to the bottom
  } else if (a.dueDate === "" && b.dueDate === "") {
    return 0; // If both have no dueDate, leave their order unchanged
  } else if (a.dueDate === "") {
    return 1; // Move tasks with no dueDate to the bottom
  } else if (b.dueDate === "") {
    return -1; // Move tasks with no dueDate to the bottom
  } else if (a.dueDate < b.dueDate) {
    return -1; // Sort by dueDate if both have dueDates defined
  } else {
    return 1;
  }
}

// Denne funktion gør at arrayet sorteres efter om opgaven er markeret færdig, og vil kun vise dem der er færdige ved at klikke på "Done" filterknappen
const completedFilter = document.querySelector("#completedFilter");
completedFilter.addEventListener("click", () => {
  const isDone = deletedArr.filter((task) => task.isCompleted === true);
  displayArray(isDone);
  document.querySelector("h3").textContent = "Completed";
});

// Denne funktion gør at arrayet sorteres efter om opgaven ikke er markeret færdig, og vil kun vise dem der ikke er færdige ved at klikke på "To-Do-List" filterknappen
const toDoFilter = document.querySelector("#toDoFilter");
toDoFilter.addEventListener("click", () => {
  const isNotDone = deletedArr.filter((task) => task.isCompleted === false);
  displayArray(isNotDone);
  document.querySelector("h3").textContent = "Tasks";
});

// Denne funktion gør at arrayet sorteres efter om opgaven iikke er vigtig, og vil kun vise dem der er vigtige ved at klikke på "Important" filterknappen
const importantFilter = document.querySelector("#importantFilter");
importantFilter.addEventListener("click", () => {
  const isImportant = deletedArr.filter((task) => task.isImportant === true);
  displayArray(isImportant);
  document.querySelector("h3").textContent = "Important tasks";
});

window.addEventListener("load", () => {
  const retrievedArray = JSON.parse(localStorage.getItem("objects"));
  if (retrievedArray) {
    deletedArr = retrievedArray;
  }
  const isNotDone = deletedArr.filter((task) => task.isCompleted === false);

  displayArray(isNotDone);
});

// Hvis der klikkes på "done" skal toDoObject's isCompleted ændres til true og føres over i en ul der hedder "done-list"

// Hvis der klikkes på "important" skal toDoObject's isImportant ændres til true og føres over i en ul der hedder "important-list"

// Hvis der klikkes på "delete" skal objektet fjernes fra arrayet
