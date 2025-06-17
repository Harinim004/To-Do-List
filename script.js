let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  tasks.push({
    text: taskText,
    completed: false,
    time: new Date().toLocaleString()
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const filtered = tasks.filter(task =>
    currentFilter === "all" ||
    (currentFilter === "completed" && task.completed) ||
    (currentFilter === "pending" && !task.completed)
  );

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-text" onclick="openModal(\`${task.text.replace(/`/g, "\\`")}\`, '${task.time}')">
  <div class="preview">${marked.parse(task.text.split('\n')[0] || '')}</div>
  <small>${task.time}</small>
</div>


      <div class="task-actions">
        <button onclick="toggleComplete(${index})">${task.completed ? '✅' : '✔️'}</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;

    list.appendChild(li);
  });
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText;
    tasks[index].time = new Date().toLocaleString();
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

function filterTasks(type) {
  currentFilter = type;
  document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.filters button[onclick*="${type}"]`).classList.add("active");
  renderTasks();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

(function initTheme() {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
    document.getElementById("darkToggle").checked = true;
  }
})();

renderTasks();

function openModal(text, time) {
  const modal = document.getElementById("modalOverlay");
  const body = document.getElementById("modalBody");
  body.innerHTML = `
    <div>${marked.parse(text)}</div>
    <small style="display:block;margin-top:10px;">${time}</small>
  `;
  modal.classList.add("active");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active");
}

