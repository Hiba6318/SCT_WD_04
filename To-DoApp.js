let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    let taskText = document.getElementById("taskInput").value;
    let taskDate = document.getElementById("taskDate").value;

    if (taskText.trim() === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        text: taskText,
        date: taskDate,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    document.getElementById("taskInput").value = "";
    document.getElementById("taskDate").value = "";
}

function renderTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "task" + (task.completed ? " completed" : "");

        li.innerHTML = `
            <div class="task-info">
                <span>${task.text}</span>
                <span class="task-date">${task.date ? task.date.replace("T", " | ") : ""}</span>
            </div>

            <div class="actions">
                <button class="complete-btn" onclick="toggleComplete(${index})">✓</button>
                <button class="edit-btn" onclick="editTask(${index})">✎</button>
                <button class="delete-btn" onclick="deleteTask(${index})">🗑</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function editTask(index) {
    let newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(index) {
    if (confirm("Delete this task?")) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

// Initial render
renderTasks();
