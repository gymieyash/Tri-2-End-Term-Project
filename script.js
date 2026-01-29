const STORAGE_KEY = "lazy_ahh_tasks";

let tasks = [];
let selectedPriority = null;


const addTaskModal = document.getElementById("addTaskModal");
const priorityModal = document.getElementById("priorityModal");
const loginPage = document.getElementById("loginPage");

const openAddTaskBtn = document.getElementById("openAddTask");
const closeAddTaskBtn = document.getElementById("closeAddTask");
const selectPriorityBtn = document.getElementById("selectPriority");
const closePriorityBtn = document.getElementById("closePriority");

const loginBtn = document.getElementById("loginBtn");
const closeLoginBtn = document.getElementById("closeLogin");

const taskTitleInput = document.getElementById("taskTitle");
const taskDescInput = document.getElementById("taskDesc");
const taskDeadlineInput = document.getElementById("taskDeadline");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");
const filterSelect = document.getElementById("filter");


function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored) : [];
}


openAddTaskBtn.onclick = () => addTaskModal.classList.remove("hidden");
closeAddTaskBtn.onclick = () => addTaskModal.classList.add("hidden");

selectPriorityBtn.onclick = () => priorityModal.classList.remove("hidden");
closePriorityBtn.onclick = () => priorityModal.classList.add("hidden");

loginBtn.onclick = () => loginPage.classList.remove("hidden");
closeLoginBtn.onclick = () => loginPage.classList.add("hidden");


priorityModal.addEventListener("click", e => {
  if (e.target.dataset.priority) {
    selectedPriority = e.target.dataset.priority;
    priorityModal.classList.add("hidden");
  }
});


addTaskBtn.addEventListener("click", () => {
  const title = taskTitleInput.value.trim();
  if (!title) return alert("Task name cannot be empty");

  const task = {
    id: Date.now(),
    title,
    description: taskDescInput.value.trim(),
    priority: selectedPriority || "low",
    deadline: taskDeadlineInput.value,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks(tasks);

  taskTitleInput.value = "";
  taskDescInput.value = "";
  taskDeadlineInput.value = "";
  selectedPriority = null;

  addTaskModal.classList.add("hidden");
});


filterSelect.addEventListener("change", () => {
  let filtered = tasks;

  if (filterSelect.value === "completed")
    filtered = tasks.filter(t => t.completed);

  if (filterSelect.value === "pending")
    filtered = tasks.filter(t => !t.completed);

  renderTasks(filtered);
});


function renderTasks(list) {
  taskList.innerHTML = "";

  list.forEach(task => {
    const card = document.createElement("div");
    card.className = `task-card ${task.priority}`;

    const label =
      task.priority === "high" ? "💀 Do or Die" :
      task.priority === "medium" ? "🧠 Brain Rot" :
      "😴 Kal Dekhenge";

    let timeInfo = "";
    if (task.deadline) {
      const diff = new Date(task.deadline) - new Date();
      timeInfo = diff < 0
        ? "<span class='overdue'>⏰ Overdue</span>"
        : `⏳ ${Math.floor(diff / 36e5)}h left`;
    }

    card.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}/>
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <small>${label}</small>
      <div>${timeInfo}</div>
    `;

    card.querySelector("input").onchange = e => {
      task.completed = e.target.checked;
      saveTasks();
    };

    taskList.appendChild(card);
  });
}


loadTasks();
renderTasks(tasks);
