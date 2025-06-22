// DOM Elements
const workoutButtons = document.querySelectorAll(".start-workout");
const modals = document.querySelectorAll(".modal");
const closeButtons = document.querySelectorAll(".close-btn");
const categoryButtons = document.querySelectorAll(".category-btn");
const workoutCards = document.querySelectorAll(".workout-card");
const progressCards = document.querySelectorAll(".progress-card");
const modal = document.getElementById("workoutModal");
const closeModal = document.querySelector(".close-modal");
const workoutVideo = document.getElementById("workoutVideo");
const workoutTitle = document.getElementById("workoutTitle");
const workoutDuration = document.getElementById("workoutDuration");
const workoutLevel = document.getElementById("workoutLevel");
const workoutSteps = document.getElementById("workoutSteps");
const themeToggle = document.querySelector(".theme-toggle");

// Progress Stats Elements
const weeklyWorkoutsEl = document.getElementById("weeklyWorkouts");
const caloriesBurnedEl = document.getElementById("caloriesBurned");
const totalMinutesEl = document.getElementById("totalMinutes");
const achievementsEl = document.getElementById("achievements");

// Workout History
let workoutHistory = [];

// Initialize Progress Stats
let progressStats = {
  weeklyWorkouts: 0,
  caloriesBurned: 0,
  totalMinutes: 0,
  achievements: 0,
  lastWorkoutDate: null,
};

// Load Progress Stats from Local Storage
function loadProgressStats() {
  const savedStats = localStorage.getItem("workoutProgress");
  if (savedStats) {
    progressStats = JSON.parse(savedStats);
    // Check if we need to reset weekly stats
    checkWeeklyReset();
    updateProgressDisplay();
  }
}

// Check if we need to reset weekly stats
function checkWeeklyReset() {
  const now = new Date();
  const lastWorkout = progressStats.lastWorkoutDate
    ? new Date(progressStats.lastWorkoutDate)
    : null;

  if (lastWorkout) {
    const daysDiff = Math.floor((now - lastWorkout) / (1000 * 60 * 60 * 24));
    if (daysDiff >= 7) {
      // Reset weekly stats
      progressStats.weeklyWorkouts = 0;
      progressStats.caloriesBurned = 0;
      progressStats.totalMinutes = 0;
      saveProgressStats();
    }
  }
}

// Save Progress Stats to Local Storage
function saveProgressStats() {
  localStorage.setItem("workoutProgress", JSON.stringify(progressStats));
}

// Update Progress Display with Animation
function updateProgressDisplay() {
  // Animate weekly workouts
  animateValue(weeklyWorkoutsEl, progressStats.weeklyWorkouts);

  // Animate calories burned
  animateValue(caloriesBurnedEl, progressStats.caloriesBurned);

  // Animate total minutes
  animateValue(totalMinutesEl, progressStats.totalMinutes);

  // Animate achievements
  animateValue(achievementsEl, progressStats.achievements);

  // Add pulse animation to progress cards
  progressCards.forEach((card) => {
    card.classList.add("pulse");
    setTimeout(() => card.classList.remove("pulse"), 1000);
  });
}

// Animate number value
function animateValue(element, end) {
  const start = parseInt(element.textContent) || 0;
  const duration = 1000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * easeOutQuart);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Load Workout History from Local Storage
function loadWorkoutHistory() {
  const savedHistory = localStorage.getItem("workoutHistory");
  if (savedHistory) {
    workoutHistory = JSON.parse(savedHistory);
  }
}

// Save Workout History to Local Storage
function saveWorkoutHistory() {
  localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory));
}

// Add workout to history
function addToHistory(workoutType) {
  const workout = getWorkoutData(workoutType);
  if (!workout) return;

  const workoutRecord = {
    type: workoutType,
    date: new Date().toISOString(),
    duration: workout.duration,
    calories: workout.calories,
  };

  workoutHistory.unshift(workoutRecord); // Add to beginning of array
  saveWorkoutHistory();
}

// Display workout history
function displayWorkoutHistory() {
  const historyContainer = document.createElement("div");
  historyContainer.className = "workout-history";
  historyContainer.innerHTML = `
        <h2>Workout History</h2>
        <div class="history-list"></div>
    `;

  const historyList = historyContainer.querySelector(".history-list");
  workoutHistory.forEach((record, index) => {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    const date = new Date(record.date).toLocaleDateString();
    historyItem.innerHTML = `
            <div class="history-date">${date}</div>
            <div class="history-details">
                <span class="workout-type">${record.type}</span>
                <span class="workout-duration">${record.duration} min</span>
                <span class="workout-calories">${record.calories} cal</span>
                <button class="delete-btn" data-index="${index}" title="Delete Record">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    historyList.appendChild(historyItem);
  });

  // Add delete event listeners
  const deleteButtons = historyContainer.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = parseInt(button.getAttribute("data-index"));
      deleteWorkoutRecord(index);
    });
  });

  // Add refresh button
  const refreshButton = document.createElement("button");
  refreshButton.className = "refresh-btn";
  refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
  refreshButton.onclick = refreshWorkoutData;
  historyContainer.appendChild(refreshButton);

  // Add to page
  const workoutSection = document.querySelector(".workout-section .container");
  workoutSection.appendChild(historyContainer);
}

// Delete workout record
function deleteWorkoutRecord(index) {
  // Remove from history array
  workoutHistory.splice(index, 1);
  // Save updated history
  saveWorkoutHistory();
  // Refresh display
  refreshWorkoutData();
}

// Refresh workout data
function refreshWorkoutData() {
  // Reload progress stats
  loadProgressStats();
  // Reload workout history
  loadWorkoutHistory();
  // Update display
  updateProgressDisplay();
  // Update history display
  const existingHistory = document.querySelector(".workout-history");
  if (existingHistory) {
    existingHistory.remove();
  }
  displayWorkoutHistory();
}

// Track Workout Progress
function trackWorkout(workoutType) {
  const workout = getWorkoutData(workoutType);
  if (!workout) return;

  // Update stats
  progressStats.weeklyWorkouts++;
  progressStats.caloriesBurned += workout.calories;
  progressStats.totalMinutes += workout.duration;
  progressStats.lastWorkoutDate = new Date().toISOString();

  // Add to history
  addToHistory(workoutType);

  // Check for achievements
  checkAchievements();

  // Save and update display
  saveProgressStats();
  updateProgressDisplay();
}

// Check for new achievements
function checkAchievements() {
  const newAchievements = [];

  // Weekly workout achievements
  if (progressStats.weeklyWorkouts === 1) newAchievements.push("First Workout");
  if (progressStats.weeklyWorkouts === 5)
    newAchievements.push("Weekly Warrior");
  if (progressStats.weeklyWorkouts === 10)
    newAchievements.push("Fitness Master");

  // Calorie achievements
  if (progressStats.caloriesBurned >= 1000)
    newAchievements.push("Calorie Crusher");
  if (progressStats.caloriesBurned >= 5000) newAchievements.push("Fat Burner");

  // Time achievements
  if (progressStats.totalMinutes >= 100) newAchievements.push("Time Warrior");
  if (progressStats.totalMinutes >= 500) newAchievements.push("Endurance King");

  // Update achievements if new ones earned
  if (newAchievements.length > 0) {
    progressStats.achievements += newAchievements.length;
    showAchievementNotification(newAchievements);
  }
}

// Show achievement notification
function showAchievementNotification(achievements) {
  achievements.forEach((achievement) => {
    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.innerHTML = `
            <i class="fas fa-trophy"></i>
            <span>Achievement Unlocked: ${achievement}</span>
        `;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add("show"), 100);

    // Remove notification after animation
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  });
}

// Get workout data
function getWorkoutData(workoutType) {
  const workoutData = {
    strength: { duration: 30, calories: 300 },
    upperBody: { duration: 40, calories: 350 },
    cardio: { duration: 20, calories: 250 },
    running: { duration: 35, calories: 450 },
    yoga: { duration: 45, calories: 200 },
    powerYoga: { duration: 50, calories: 300 },
    hiit: { duration: 25, calories: 300 },
    coreHiit: { duration: 20, calories: 250 },
    pilates: { duration: 40, calories: 250 },
    advancedPilates: { duration: 50, calories: 300 },
    dance: { duration: 45, calories: 400 },
    boxing: { duration: 35, calories: 450 },
  };

  return workoutData[workoutType];
}

// Add click event to each workout button
workoutButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const workoutId = button.getAttribute("data-workout");
    const modal = document.getElementById(workoutId + "Modal");
    if (modal) {
      modal.style.display = "flex";
      modal.classList.add("show");
      // Track workout when started
      trackWorkout(workoutId);
    }
  });
});

// Add click event to close buttons
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    if (modal) {
      modal.style.display = "none";
      modal.classList.remove("show");
    }
  });
});

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
      modal.classList.remove("show");
    }
  });
});

// Category filtering
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    // Add active class to clicked button
    button.classList.add("active");

    const category = button.getAttribute("data-category");

    // Show/hide workout cards based on category
    workoutCards.forEach((card) => {
      if (
        category === "all" ||
        card.getAttribute("data-category") === category
      ) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Start Workout
workoutCards.forEach((card) => {
  const startButton = card.querySelector(".start-workout");
  startButton.addEventListener("click", () => {
    const workoutType = startButton.dataset.workout;
    const workout = getWorkoutData(workoutType);

    // Update modal content
    workoutTitle.textContent =
      workoutType.charAt(0).toUpperCase() + workoutType.slice(1);
    workoutDuration.textContent = workout.duration + " min";
    workoutLevel.textContent =
      workoutType.charAt(0).toUpperCase() +
      workoutType.slice(1).substring(0, workoutType.length - 1);
    workoutVideo.src = "videos/" + workoutType + "-workout.mp4";

    // Clear previous steps
    workoutSteps.innerHTML = "";

    // Add new steps
    const steps = [
      "Warm up with 5 minutes of light cardio",
      "Perform 3 sets of 12 reps for each exercise",
      "Rest 60 seconds between sets",
      "Complete all exercises in sequence",
      "Cool down with stretching",
    ];
    steps.forEach((step, index) => {
      const stepElement = document.createElement("div");
      stepElement.className =
        "workout-step animate__animated animate__fadeInRight";
      stepElement.style.animationDelay = `${index * 0.2}s`;
      stepElement.innerHTML = `
                <div class="step-number">${index + 1}</div>
                <p>${step}</p>
            `;
      workoutSteps.appendChild(stepElement);
    });

    // Show modal
    modal.style.display = "block";
    document.body.style.overflow = "hidden";

    // Track workout start
    trackWorkout(workoutType);
  });
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Update icon
  themeToggle.innerHTML =
    newTheme === "dark"
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
});

// Reset all progress
function resetAllProgress() {
  // Show confirmation dialog
  if (
    confirm(
      "Are you sure you want to reset all progress? This will delete all workout history and achievements."
    )
  ) {
    // Reset progress stats
    progressStats = {
      weeklyWorkouts: 0,
      caloriesBurned: 0,
      totalMinutes: 0,
      achievements: 0,
      lastWorkoutDate: null,
    };

    // Clear workout history
    workoutHistory = [];

    // Save changes to local storage
    saveProgressStats();
    saveWorkoutHistory();

    // Update display
    updateProgressDisplay();

    // Remove and recreate history section
    const existingHistory = document.querySelector(".workout-history");
    if (existingHistory) {
      existingHistory.remove();
    }
    displayWorkoutHistory();

    // Show success message
    showNotification("All progress has been reset successfully!");
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "achievement-notification";
  notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => notification.classList.add("show"), 100);

  // Remove notification after animation
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Initialize
function init() {
  loadProgressStats();
  loadWorkoutHistory();
  displayWorkoutHistory();
  updateProgressDisplay();

  // Add reset button event listener
  const resetButton = document.getElementById("resetProgress");
  if (resetButton) {
    resetButton.addEventListener("click", resetAllProgress);
  }

  // Set saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggle.innerHTML =
    savedTheme === "dark"
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';

  // Set current year in footer
  document.getElementById("year").textContent = new Date().getFullYear();
}

// Call init when DOM is loaded
document.addEventListener("DOMContentLoaded", init);

// Modal Functionality
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("workoutModal");
  const btn = document.getElementById("startWorkoutBtn");
  const closeBtn = document.getElementById("closeModal");

  if (btn && modal && closeBtn) {
    btn.addEventListener("click", () => {
      modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});
