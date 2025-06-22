//Todo List Class with Animations, Modal, Loader, and Accessibility
class TodoList {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem("todos")) || [];
    this.todoInput = document.getElementById("todoInput");
    this.addTodoBtn = document.getElementById("addTodo");
    this.todoList = document.getElementById("todoList");
    this.categoryBtns = document.querySelectorAll(".category-btn");
    this.currentCategory = "all";
    this.loader = document.getElementById("loader");
    this.emptyState = document.getElementById("emptyState");
    this.editModal = document.getElementById("editModal");
    this.editInput = document.getElementById("editInput");
    this.saveEditBtn = document.getElementById("saveEdit");
    this.cancelEditBtn = document.getElementById("cancelEdit");
    this.editingId = null;
    this.initializeEventListeners();
    this.showLoader();
    setTimeout(() => {
      this.hideLoader();
      this.renderTodos();
      this.updateStats();
    }, 600);
  }

  initializeEventListeners() {
    // Add todo
    this.addTodoBtn.addEventListener("click", () => this.addTodo());
    this.todoInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addTodo();
    });
    // Category filters
    this.categoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.categoryBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCategory = btn.dataset.category;
        this.renderTodos();
      });
    });
    // Modal events
    this.saveEditBtn.addEventListener("click", () => this.saveEdit());
    this.cancelEditBtn.addEventListener("click", () => this.closeEditModal());
    this.editInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.saveEdit();
    });
    window.addEventListener("keydown", (e) => {
      if (this.editModal.style.display === "flex" && e.key === "Escape") {
        this.closeEditModal();
      }
    });
  }

  showLoader() {
    this.loader.style.display = "flex";
  }
  hideLoader() {
    this.loader.style.display = "none";
  }

  addTodo() {
    const text = this.todoInput.value.trim();
    if (text) {
      const todo = {
        id: Date.now(),
        text,
        completed: false,
        date: new Date().toISOString(),
        category: this.getCategory(),
      };
      this.todos.push(todo);
      this.saveTodos();
      this.renderTodos(true);
      this.updateStats();
      this.todoInput.value = "";
      this.todoInput.focus();
    }
  }

  getCategory() {
    const today = new Date().toISOString().split("T")[0];
    const todoDate = new Date().toISOString().split("T")[0];
    if (todoDate === today) return "today";
    return "upcoming";
  }

  toggleTodo(id) {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    this.saveTodos();
    this.renderTodos();
    this.updateStats();
  }

  deleteTodo(id) {
    const item = document.querySelector(`.todo-item[data-id='${id}']`);
    if (item) {
      item.classList.add("removing");
      setTimeout(() => {
        this.todos = this.todos.filter((todo) => todo.id !== id);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
      }, 400);
    } else {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      this.saveTodos();
      this.renderTodos();
      this.updateStats();
    }
  }

  openEditModal(id, text) {
    this.editingId = id;
    this.editInput.value = text;
    this.editModal.style.display = "flex";
    setTimeout(() => this.editInput.focus(), 100);
  }
  closeEditModal() {
    this.editModal.style.display = "none";
    this.editingId = null;
  }
  saveEdit() {
    const newText = this.editInput.value.trim();
    if (newText && this.editingId !== null) {
      this.todos = this.todos.map((todo) => {
        if (todo.id === this.editingId) {
          return { ...todo, text: newText };
        }
        return todo;
      });
      this.saveTodos();
      this.renderTodos();
      this.closeEditModal();
    }
  }

  saveTodos() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
    updateProgressSection();
  }

  getFilteredTodos() {
    switch (this.currentCategory) {
      case "today":
        const today = new Date().toISOString().split("T")[0];
        return this.todos.filter((todo) => todo.date.split("T")[0] === today);
      case "upcoming":
        const tomorrow = new Date(Date.now() + 86400000)
          .toISOString()
          .split("T")[0];
        return this.todos.filter((todo) => todo.date.split("T")[0] > tomorrow);
      case "completed":
        return this.todos.filter((todo) => todo.completed);
      default:
        return this.todos;
    }
  }

  renderTodos(animate = false) {
    const filteredTodos = this.getFilteredTodos();
    this.todoList.innerHTML = "";
    if (filteredTodos.length === 0) {
      this.emptyState.style.display = "flex";
    } else {
      this.emptyState.style.display = "none";
    }
    filteredTodos.forEach((todo, idx) => {
      const item = document.createElement("div");
      item.className = "todo-item" + (todo.completed ? " completed" : "");
      item.setAttribute("data-id", todo.id);
      item.style.animationDelay = animate ? idx * 0.07 + "s" : "0s";
      item.innerHTML = `
                <div class="todo-checkbox${
                  todo.completed ? " checked" : ""
                }" tabindex="0" aria-label="Mark as completed" role="button"></div>
                <div class="todo-content">
                    <div class="todo-text">${todo.text}</div>
                    <div class="todo-date">${new Date(
                      todo.date
                    ).toLocaleDateString()}</div>
                </div>
                <div class="todo-actions">
                    <button aria-label="Edit task" tabindex="0"><i class="fas fa-edit"></i></button>
                    <button aria-label="Delete task" tabindex="0"><i class="fas fa-trash"></i></button>
                </div>
            `;
      // Checkbox
      item.querySelector(".todo-checkbox").onclick = () =>
        this.toggleTodo(todo.id);
      item.querySelector(".todo-checkbox").onkeypress = (e) => {
        if (e.key === "Enter" || e.key === " ") this.toggleTodo(todo.id);
      };
      // Edit
      item.querySelector(".todo-actions button:nth-child(1)").onclick = () =>
        this.openEditModal(todo.id, todo.text);
      // Delete
      item.querySelector(".todo-actions button:nth-child(2)").onclick = () =>
        this.deleteTodo(todo.id);
      this.todoList.appendChild(item);
    });
  }

  updateStats() {
    document.getElementById("totalTasks").textContent = this.todos.length;
    document.getElementById("completedTasks").textContent = this.todos.filter(
      (todo) => todo.completed
    ).length;
    document.getElementById("pendingTasks").textContent = this.todos.filter(
      (todo) => !todo.completed
    ).length;
  }
}

// --- WEEKLY SCHEDULE LOGIC ---
const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getCurrentDayName() {
  const now = new Date();
  return WEEK_DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1]; // JS: 0=Sunday
}

class WeeklySchedule {
  constructor() {
    this.schedule =
      JSON.parse(localStorage.getItem("weeklySchedule")) ||
      this.getDefaultSchedule();
    this.container = document.getElementById("weekSchedule");
    this.currentDay = getCurrentDayName();
    this.currentDayIndex = WEEK_DAYS.indexOf(this.currentDay);
    this.render();
    this.setupMidnightSwitch();
  }

  getDefaultSchedule() {
    const obj = {};
    WEEK_DAYS.forEach((day) => (obj[day] = []));
    return obj;
  }

  save() {
    localStorage.setItem("weeklySchedule", JSON.stringify(this.schedule));
    updateProgressSection();
  }

  addTask(day, text) {
    if (text.trim()) {
      this.schedule[day].push({
        id: Date.now(),
        text: text.trim(),
        completed: false,
      });
      this.save();
      this.render();
    }
  }

  deleteTask(day, id) {
    this.schedule[day] = this.schedule[day].filter((task) => task.id !== id);
    this.save();
    this.render();
  }

  toggleTask(day, id) {
    this.schedule[day] = this.schedule[day].map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.save();
    this.render();
  }

  getDayColor(dayIndex) {
    const colors = [
      "#6c63ff", // Monday - Purple
      "#48c6ef", // Tuesday - Blue
      "#43e97b", // Wednesday - Green
      "#a770ef", // Thursday - Purple
      "#f6d365", // Friday - Yellow
      "#ff6a88", // Saturday - Pink
      "#ff99ac", // Sunday - Light Pink
    ];
    return colors[dayIndex];
  }

  isDayOver(dayIndex) {
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const adjustedCurrentDay =
      currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // Convert to Monday = 0
    return dayIndex < adjustedCurrentDay;
  }

  render() {
    this.container.innerHTML = "";
    this.currentDayIndex = WEEK_DAYS.indexOf(this.currentDay);

    // Show all 7 days
    WEEK_DAYS.forEach((day, dayIndex) => {
      const isOver = this.isDayOver(dayIndex);
      const isToday = day === this.currentDay;
      const dayColor = this.getDayColor(dayIndex);

      const card = document.createElement("div");
      card.className = `day-card ${isToday ? "today" : ""} ${
        isOver ? "day-over" : ""
      }`;
      card.style.setProperty("--day-color", dayColor);
      card.style.opacity = isOver ? "0.6" : "1";

      card.innerHTML = `
                <div class="day-header" style="background: ${dayColor}">
                    <span class="day-name">${day}</span>
                    ${isToday ? '<span class="today-badge">Today</span>' : ""}
                    ${isOver ? '<span class="over-badge">Completed</span>' : ""}
                </div>
                <div class="day-todo-list" id="${day}-todo-list"></div>
                <form class="day-add-form" autocomplete="off" aria-label="Add task for ${day}" ${
        isOver ? 'style="display:none;"' : ""
      }>
                    <input class="day-add-input" type="text" placeholder="Add task..." aria-label="Add task for ${day}">
                    <button class="day-add-btn" type="submit" aria-label="Add" style="background: ${dayColor}"><i class="fas fa-plus"></i></button>
                </form>
            `;

      // Render tasks
      const list = card.querySelector(".day-todo-list");
      this.schedule[day].forEach((task) => {
        const item = document.createElement("div");
        item.className = `day-todo-item ${task.completed ? "completed" : ""}`;
        item.innerHTML = `
                    <span class="task-text">${task.text}</span>
                    <div class="task-actions">
                        <button class="day-todo-complete" aria-label="Mark as completed" tabindex="0">
                            ${
                              task.completed
                                ? '<i class="fas fa-check-circle"></i>'
                                : '<i class="far fa-circle"></i>'
                            }
                        </button>
                        <button class="day-todo-delete" aria-label="Delete task" tabindex="0">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;

        item.querySelector(".day-todo-delete").onclick = () =>
          this.deleteTask(day, task.id);
        item.querySelector(".day-todo-delete").onkeypress = (e) => {
          if (e.key === "Enter" || e.key === " ") this.deleteTask(day, task.id);
        };
        item.querySelector(".day-todo-complete").onclick = () =>
          this.toggleTask(day, task.id);
        item.querySelector(".day-todo-complete").onkeypress = (e) => {
          if (e.key === "Enter" || e.key === " ") this.toggleTask(day, task.id);
        };
        list.appendChild(item);
      });

      // Add task form
      const form = card.querySelector(".day-add-form");
      const input = card.querySelector(".day-add-input");
      form.onsubmit = (e) => {
        e.preventDefault();
        this.addTask(day, input.value);
        input.value = "";
        input.focus();
      };

      this.container.appendChild(card);
    });

    updateProgressSection();
  }

  setupMidnightSwitch() {
    const msToMidnight = (() => {
      const now = new Date();
      const next = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        1,
        0
      );
      return next - now;
    })();
    setTimeout(() => {
      this.handleDaySwitch();
      this.setupMidnightSwitch();
    }, msToMidnight);
  }

  handleDaySwitch() {
    const newDay = getCurrentDayName();
    if (newDay === "Monday") {
      this.schedule = this.getDefaultSchedule();
      this.save();
    }
    this.currentDay = newDay;
    this.render();
  }
}

function updateProgressSection() {
  // Main To-Do
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const totalMain = todos.length;
  const completedMain = todos.filter((t) => t.completed).length;
  // Weekly Schedule
  const weekly = JSON.parse(localStorage.getItem("weeklySchedule")) || {};
  let totalWeekly = 0,
    completedWeekly = 0;
  Object.values(weekly).forEach((dayArr) => {
    totalWeekly += dayArr.length;
    completedWeekly += dayArr.filter((task) => task.completed).length;
  });
  // Progress
  const total = totalMain + totalWeekly;
  const completed = completedMain + completedWeekly;
  const pending = total - completed;
  const percent = Math.round((completed / total) * 100);
  progressBarFill.style.width = percent + "%";
  progressPercent.textContent = percent + "%";

  // Update progress stats
  document.getElementById("progressTotal").textContent = total;
  document.getElementById("progressCompleted").textContent = completed;
  document.getElementById("progressPending").textContent = pending;
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TodoList();
  new WeeklySchedule();
  updateProgressSection();

  // Set current year in footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // Responsive Navbar Hamburger
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
  hamburger.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      navLinks.classList.toggle("open");
    }
  });
});
