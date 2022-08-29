const darkIcon = document.getElementById("darkIcon");
const createInput = document.getElementById("create-input");
const listBtn = document.getElementById("listBtn");
const toBeDone = document.getElementById("toBeDone");
const doneBtn = document.getElementById("done");
const clearbtn = document.getElementById("clear");
const content = document.getElementById("content");
const deleteBtn = document.getElementById("delete");
const editBtn = document.getElementById("edit");
const contentEdit = document.getElementById("contentEdit");
const updateBtn = document.getElementById("update");
const storedText = document.getElementById("storedText");
const doneStatus = document.getElementById("doneStatus");
const resultContainer = document.querySelector("ul");

document.body.classList.add(localStorage.getItem("dark"));

if (document.body.classList.contains("dark")) {
  // document.body.classList.add("dark");
  darkIcon.innerText = "light_mode";
  const canvas = document.getElementById("canvas");
  canvas.style.display = "block";
  const starback = new Starback(canvas, {
    type: "dot",
    quantity: 100,
    direction: 225,
    backgroundColor: ["#0e1118", "#232b3e"],
    randomOpacity: true,
    speed: 0.4,
  });
}

darkIcon.addEventListener("click", function (e) {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
    document.getElementById("canvas").style.display = "none";
    localStorage.removeItem("dark");
    this.innerText = "dark_mode";
  } else {
    localStorage.setItem("dark", "dark");
    document.body.classList.add("dark");
    this.innerText = "light_mode";
    const canvas = document.getElementById("canvas");
    canvas.style.display = "block";
    const starback = new Starback(canvas, {
      type: "dot",
      quantity: 100,
      direction: 225,
      backgroundColor: ["#0e1118", "#232b3e"],
      randomOpacity: true,
      speed: 0.4,
    });
  }
});

let allTasks = [];

class ToDoList {
  constructor(id, text) {
    this.id = id;
    this.text = text;
    this.isCompleted = false;
  }

  static boilerPlate(id, text, isCompleted) {
    const li = document.createElement("li");
    li.innerHTML = `
                <div>
                    <span class="material-symbols-outlined circle" data-id=${id}>circle</span>
                    <span class="taskText" data-id=${id}>${text}</span>
                </div>
                <div>
                    <span class="material-symbols-outlined edit" data-id=${id}>edit</span>
                    <span class="material-symbols-outlined delete" data-id=${id}>close</span>
                </div>
        `;
    li.className = "single-result";
    resultContainer.appendChild(li);
  }

  addTaskToList(task) {
    ToDoList.boilerPlate(task.id, task.text, task.isCompleted);
    return this;
  }

  storeTask(task) {
    const allTasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
    allTasks.push({
      id: task.id,
      text: task.text,
      isCompleted: false,
    });
    localStorage.setItem("tasks", JSON.stringify(allTasks));
  }

  static getAllTasks() {
    if (localStorage.getItem("tasks")) {
      JSON.parse(localStorage.getItem("tasks")).forEach((task) => {
        ToDoList.boilerPlate(task.id, task.text, task.isCompleted);
      });
    } else {
      resultContainer.innerHTML = `
        <li>Create Your First Task.</li>
      `;
    }
  }

  getCompletedTasks() {
    if (localStorage.getItem("tasks")) {
      JSON.parse(localStorage.getItem("tasks")).forEach((task) => {
        if (task.isCompleted) {
          ToDoList.boilerPlate(task.id, task.text, task.isCompleted);
        }
      });
    }
  }

  toBeDoneTasks() {
    if (localStorage.getItem("tasks")) {
      JSON.parse(localStorage.getItem("tasks")).forEach((task) => {
        if (!task.isCompleted) {
          ToDoList.boilerPlate(task.id, task.text, task.isCompleted);
        }
      });
    }
  }

  updateTask(id) {
    const newTask = {
      id: id,
      text: createInput.value,
      isCompleted: storedText.value,
    };
    const updatedData = JSON.parse(localStorage.getItem("tasks")).map(
      (item) => {
        if (Number(item.id) === Number(id)) {
          return newTask;
        }
        return item;
      }
    );
    localStorage.setItem("tasks", JSON.stringify(updatedData));
  }

  doneTask(id) {
    const done = JSON.parse(localStorage.getItem("tasks")).map((item) => {
      if (Number(item.id) === Number(id)) {
        item.isCompleted == false
          ? (item.isCompleted = true)
          : (item.isCompleted = false);
        document.querySelectorAll("li .taskText").forEach((item) => {
          if (Number(item.getAttribute("data-id")) == Number(id)) {
            item.classList.add("done");
          }
        });
      }

      return item;
    });
    localStorage.setItem("tasks", JSON.stringify(done));
  }

  deleteAllTasks() {
    localStorage.clear();
  }

  clearFields() {
    createInput.value = "";
  }
}

ToDoList.getAllTasks();

createInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    if (!contentEdit.value) {
      e.preventDefault();
      let id = Math.floor(Math.random() * 1000);
      const text = createInput.value;
      const task = new ToDoList(id, text);
      const todolist = new ToDoList();
      if (text === "" || text === null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "please fill the input",
        });
      } else {
        todolist.addTaskToList(task).storeTask(task);
        todolist.clearFields();
        Swal.fire({
          icon: "success",
          title: "Greate!",
          text: "Task Added Successfully",
        });
      }
    } else {
      const id = contentEdit.value;
      const todolist = new ToDoList();
      todolist.updateTask(id);
      resultContainer.innerHTML = "";
      ToDoList.getAllTasks();
    }
  }
});

resultContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const id = +e.target.getAttribute("data-id");
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const newTasks = tasks.filter((task) => Number(task.id) !== id);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    e.target.parentElement.parentElement.remove();
  }

  if (e.target.classList.contains("edit")) {
    const id = +e.target.getAttribute("data-id");
    const item = JSON.parse(localStorage.getItem("tasks")).find(
      (item) => Number(item.id) === id
    );
    createInput.value = item.text;
    contentEdit.value = id;
    storedText.value = item.isCompleted;
  }

  if (e.target.classList.contains("circle")) {
    location.reload();
    const parentLi = e.target.parentElement
      .closest("li")
      .querySelector(".taskText");
    const id = +e.target.getAttribute("data-id");
    const item = JSON.parse(localStorage.getItem("tasks")).find(
      (item) => Number(item.id) === id
    );
    contentEdit.value = item.id;
    if (parentLi.classList.contains("done")) {
      e.target.innerText = "check_circle";
    } else {
      e.target.innerText = "circle";
    }

    parentLi.classList.toggle("done");
    const todolist = new ToDoList();
    todolist.doneTask(id);
  }
});

function getDoneTasks() {
  if (localStorage.getItem("tasks")) {
    JSON.parse(localStorage.getItem("tasks")).map((task) => {
      if (task.isCompleted) {
        document.querySelectorAll("li .taskText").forEach((item) => {
          if (Number(item.getAttribute("data-id")) == task.id) {
            item.classList.add("done");
            item.previousElementSibling.innerText = "check_circle";
          }
        });
      }
    });
  }
}

doneBtn.addEventListener("click", (e) => {
  const todolist = new ToDoList();
  resultContainer.innerHTML = "";
  todolist.getCompletedTasks();
  getDoneTasks();
});

listBtn.addEventListener("click", (e) => {
  resultContainer.innerHTML = "";
  ToDoList.getAllTasks();
  getDoneTasks();
});

toBeDone.addEventListener("click", (e) => {
  const todolist = new ToDoList();
  resultContainer.innerHTML = "";
  todolist.toBeDoneTasks();
});
clearbtn.addEventListener("click", (e) => {
  const todolist = new ToDoList();
  todolist.deleteAllTasks();
  resultContainer.innerHTML = `
        <li>Create Your First Task.</li>
      `;
});
getDoneTasks();
