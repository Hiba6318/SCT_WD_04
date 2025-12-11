const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const prioritySelect = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");
const progressBar = document.getElementById("progressBar");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

// Add Task
addTaskBtn.addEventListener("click", () => {
  if (taskInput.value.trim() === "") return;

  const task = {
    id: Date.now(),
    text: taskInput.value,
    priority: prioritySelect.value,
    due: dueDateInput.value,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
});

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task priority-${task.priority}`;
    li.draggable = true;
    li.dataset.id = task.id;

    li.innerHTML = `
      <span class="${task.completed ? "complete" : ""}">
        ${task.text} <small>(${task.due || "No date"})</small>
      </span>
      <div>
        <button onclick="toggleComplete(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">✖</button>
      </div>
    `;

    addDragEvents(li);
    taskList.appendChild(li);
  });

  updateProgress();
}

// Toggle Complete
function toggleComplete(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// Save to LocalStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update Progress Bar
function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  progressBar.style.width = total ? `${(done / total) * 100}%` : "0%";
}

// Drag & Drop
let draggedItem = null;

function addDragEvents(item) {
  item.addEventListener("dragstart", () => {
    draggedItem = item;
    item.style.opacity = "0.5";
  });

  item.addEventListener("dragend", () => {
    draggedItem = null;
    item.style.opacity = "1";
  });

  item.addEventListener("dragover", (e) => e.preventDefault());

  item.addEventListener("drop", () => {
    if (draggedItem !== item) {
      let draggedId = draggedItem.dataset.id;
      let targetId = item.dataset.id;

      let from = tasks.findIndex(t => t.id == draggedId);
      let to = tasks.findIndex(t => t.id == targetId);

      const moved = tasks.splice(from, 1)[0];
      tasks.splice(to, 0, moved);

      saveTasks();
      renderTasks();
    }
  });
}

