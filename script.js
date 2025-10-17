// ...existing code...
//
// Getting Elements from the page
//

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");

const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");
const clearCompletedBtn = document.getElementById("clearCompleted");

//
// In-memory data
//
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let filter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  const newTask = { id: generateId(), text, done: false };
  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
}

function toggleDone(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  renderTasks();
}

function setFilter(f) {
  filter = f;
  renderTasks();
}

function renderTasks() {
  const visible = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "active") return !t.done;
    if (filter === "completed") return t.done;
  });

  taskList.innerHTML = "";
  if (visible.length === 0) {
    if (filter === "completed") {
      emptyMsg.textContent = "No Completed Tasks";
    } else if (filter === "active") {
      emptyMsg.textContent = "No Active Tasks";
    } else {
      emptyMsg.textContent = "No tasks";
    }
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
  }

  visible.forEach((task) => {
    // ...existing code...
  });

  visible.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "8px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggleDone(task.id));

    const span = document.createElement("span");
    span.className = "task-text";
    if (task.done) span.classList.add("completed");
    span.textContent = task.text;

    left.appendChild(checkbox);
    left.appendChild(span);

    const delBtn = document.createElement("button");
    delBtn.className = "icon-btn";
    delBtn.innerHTML = "🗑️";
    delBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(left);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });

  // update filter button active state
  document.querySelectorAll(".filter").forEach((btn) => btn.classList.remove("active"));
  if (filter === "all") allBtn.classList.add("active");
  if (filter === "active") activeBtn.classList.add("active");
  if (filter === "completed") completedBtn.classList.add("active");
}

// Event listeners
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

allBtn.addEventListener("click", () => setFilter("all"));
activeBtn.addEventListener("click", () => setFilter("active"));
completedBtn.addEventListener("click", () => setFilter("completed"));
clearCompletedBtn.addEventListener("click", clearCompleted);

// initial render
renderTasks();
