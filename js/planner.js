// Academic Planner controller using localStorage

const STORAGE_KEY = 'esther_academic_tasks';

// Default tasks to pre-populate board if empty
const DEFAULT_TASKS = [
  {
    id: 't-default-1',
    name: 'Verify Miva Open University Enrollment & Courseware Access',
    category: 'Admin',
    priority: 'high',
    dueDate: '2026-06-30',
    completed: true
  },
  {
    id: 't-default-2',
    name: 'Design and Develop Responsive Student Portfolio Website',
    category: 'Project',
    priority: 'high',
    dueDate: '2026-06-25',
    completed: false
  },
  {
    id: 't-default-3',
    name: 'Review Chapter 1 of threat mitigation principles',
    category: 'Study',
    priority: 'medium',
    dueDate: '2026-07-01',
    completed: false
  }
];

let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
  initDateInput();
  loadTasks();
  setupFormListener();
  renderTasks();
});

// Set default date in task form to today
function initDateInput() {
  const dateInput = document.getElementById('task-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }
}

// Load tasks from storage or load defaults
function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      tasks = JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored tasks, resetting defaults.", e);
      tasks = [...DEFAULT_TASKS];
      saveTasks();
    }
  } else {
    tasks = [...DEFAULT_TASKS];
    saveTasks();
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Setup Form submit listener
function setupFormListener() {
  const form = document.getElementById('task-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('task-name');
    const categorySelect = document.getElementById('task-category');
    const prioritySelect = document.getElementById('task-priority');
    const dateInput = document.getElementById('task-date');

    const newTask = {
      id: 'task-' + Date.now(),
      name: nameInput.value.trim(),
      category: categorySelect.value,
      priority: prioritySelect.value,
      dueDate: dateInput.value,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    // Reset input fields
    nameInput.value = '';
    initDateInput();
  });
}

// Delete a task by ID
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Toggle status of a task by ID
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

// Render tasks to DOM and update statistics
function renderTasks() {
  const activeList = document.getElementById('active-tasks-list');
  const completedList = document.getElementById('completed-tasks-list');

  const activeCountBadge = document.getElementById('active-count');
  const completedCountBadge = document.getElementById('completed-count');
  const statsText = document.getElementById('completion-stats');
  const pctText = document.getElementById('completion-pct');
  const progressBar = document.getElementById('progress-bar');

  if (!activeList || !completedList) return;

  // Clear lists
  activeList.innerHTML = '';
  completedList.innerHTML = '';

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Update badges
  if (activeCountBadge) activeCountBadge.textContent = activeTasks.length;
  if (completedCountBadge) completedCountBadge.textContent = completedTasks.length;

  // Render active tasks
  if (activeTasks.length === 0) {
    activeList.innerHTML = `
      <div class="empty-state">
        <p>No active tasks! Enjoy the downtime or create a new task below.</p>
      </div>
    `;
  } else {
    // Sort active tasks: high priority first, then medium, then low
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    const sortedActive = [...activeTasks].sort((a, b) => {
      return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
    });

    sortedActive.forEach(task => {
      activeList.appendChild(createTaskElement(task));
    });
  }

  // Render completed tasks
  if (completedTasks.length === 0) {
    completedList.innerHTML = `
      <div class="empty-state">
        <p>No tasks completed yet. You can do it!</p>
      </div>
    `;
  } else {
    completedTasks.forEach(task => {
      completedList.appendChild(createTaskElement(task));
    });
  }

  // Update statistics widget
  const total = tasks.length;
  const completed = completedTasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (statsText) statsText.textContent = `${completed} of ${total} tasks completed`;
  if (pctText) pctText.textContent = `${pct}%`;
  if (progressBar) progressBar.style.width = `${pct}%`;
}

// Create individual HTML task card element
function createTaskElement(task) {
  const item = document.createElement('div');
  item.className = `task-item ${task.completed ? 'completed' : ''}`;
  
  // Format Date for humans
  const dateObj = new Date(task.dueDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  item.innerHTML = `
    <label class="task-checkbox-wrapper">
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
      <span class="checkmark"></span>
    </label>
    
    <div class="task-body">
      <div class="task-title">${escapeHTML(task.name)}</div>
      <div class="task-meta">
        <span class="task-tag tag-priority-${task.priority}">${task.priority}</span>
        <span class="task-tag tag-category">${task.category}</span>
        <span class="task-date">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${formattedDate}
        </span>
      </div>
    </div>
    
    <button class="task-delete-btn" aria-label="Delete task">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
    </button>
  `;

  // Bind checkbox toggle event
  const checkbox = item.querySelector('.task-checkbox');
  checkbox.addEventListener('change', () => {
    // Small delay before re-rendering for visual smooth transitions
    setTimeout(() => {
      toggleTask(task.id);
    }, 200);
  });

  // Bind delete button event
  const deleteBtn = item.querySelector('.task-delete-btn');
  deleteBtn.addEventListener('click', () => {
    deleteTask(task.id);
  });

  return item;
}

// Escape helper to prevent HTML Injection
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
