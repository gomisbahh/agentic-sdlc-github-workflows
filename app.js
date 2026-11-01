/**
 * Task Manager Web App - Mock Frontend Prototype
 * Baseline implementation for SDLC workflows and future enhancements.
 * Pure HTML5 / Vanilla JavaScript (No backend APIs required).
 */

(function () {
  'use strict';

  // Storage key
  const STORAGE_KEY = 'mock_task_manager_items_v1';

  // Seed sample mock tasks
  const INITIAL_TASKS = [
    {
      id: 'task-1',
      title: 'Define requirements for SDLC workflow demo',
      priority: 'high',
      category: 'SDLC / CI',
      completed: true,
      createdAt: '2026-11-01'
    },
    {
      id: 'task-2',
      title: 'Review wireframe mock UI for Task Manager',
      priority: 'medium',
      category: 'Feature',
      completed: false,
      createdAt: '2026-11-01'
    },
    {
      id: 'task-3',
      title: 'Set up automated linting and validation workflow',
      priority: 'high',
      category: 'SDLC / CI',
      completed: false,
      createdAt: '2026-11-01'
    },
    {
      id: 'task-4',
      title: 'Document project structure in README',
      priority: 'low',
      category: 'Docs',
      completed: true,
      createdAt: '2026-11-01'
    }
  ];

  // Application State
  let tasks = [];
  let currentFilter = 'all'; // 'all' | 'pending' | 'completed'

  // DOM Elements
  const taskListEl = document.getElementById('task-list');
  const emptyStateEl = document.getElementById('empty-state');
  const taskFormEl = document.getElementById('new-task-form');
  const titleInputEl = document.getElementById('task-title-input');
  const prioritySelectEl = document.getElementById('task-priority-select');
  const categorySelectEl = document.getElementById('task-category-select');
  const titleErrorEl = document.getElementById('title-error');
  const statTotalEl = document.getElementById('stat-total');
  const statPendingEl = document.getElementById('stat-pending');
  const statCompletedEl = document.getElementById('stat-completed');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const notificationBannerEl = document.getElementById('notification-banner');
  const notificationTextEl = document.getElementById('notification-text');

  let notificationTimeoutId = null;

  /**
   * Load stored tasks from localStorage or initialize defaults
   */
  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          tasks = parsed;
          return;
        }
      }
    } catch {
      // Fallback if localStorage access is denied or disabled
    }
    tasks = [...INITIAL_TASKS];
    saveTasks();
  }

  /**
   * Save current tasks state to localStorage
   */
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Non-fatal if localStorage is restricted
    }
  }

  /**
   * Show notification message without native alert/prompt
   */
  function showNotification(message) {
    if (!notificationBannerEl || !notificationTextEl) return;

    if (notificationTimeoutId) {
      clearTimeout(notificationTimeoutId);
    }

    notificationTextEl.textContent = message;
    notificationBannerEl.classList.remove('hidden');

    notificationTimeoutId = setTimeout(() => {
      notificationBannerEl.classList.add('hidden');
      notificationTimeoutId = null;
    }, 3000);
  }

  /**
   * Calculate and update dashboard statistics
   */
  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    statTotalEl.textContent = String(total);
    statPendingEl.textContent = String(pending);
    statCompletedEl.textContent = String(completed);
  }

  /**
   * Safe DOM rendering of a single task item
   */
  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' is-completed' : '');
    li.setAttribute('data-id', task.id);

    // Left main wrapper (checkbox + text + tags)
    const mainDiv = document.createElement('div');
    mainDiv.className = 'task-main';

    // Status Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = Boolean(task.completed);
    checkbox.setAttribute('aria-label', `Mark task "${task.title}" as ${task.completed ? 'pending' : 'completed'}`);
    checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
    mainDiv.appendChild(checkbox);

    // Details wrapper
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'task-details';

    // Title
    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-title-text';
    titleSpan.textContent = task.title;
    detailsDiv.appendChild(titleSpan);

    // Meta (Priority & Category)
    const metaDiv = document.createElement('div');
    metaDiv.className = 'task-meta';

    // Priority badge
    const priorityBadge = document.createElement('span');
    const safePriority = ['low', 'medium', 'high'].includes(task.priority) ? task.priority : 'medium';
    priorityBadge.className = `badge badge-${safePriority}`;
    priorityBadge.textContent = safePriority;
    metaDiv.appendChild(priorityBadge);

    // Category tag
    const categoryTag = document.createElement('span');
    categoryTag.className = 'category-tag';
    categoryTag.textContent = `#${task.category || 'General'}`;
    metaDiv.appendChild(categoryTag);

    detailsDiv.appendChild(metaDiv);
    mainDiv.appendChild(detailsDiv);
    li.appendChild(mainDiv);

    // Actions wrapper
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn-danger btn-small';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', `Delete task "${task.title}"`);
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(actionsDiv);
    return li;
  }

  /**
   * Render tasks list based on current filter
   */
  function renderTasks() {
    updateStats();

    const filtered = tasks.filter(task => {
      if (currentFilter === 'pending') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    });

    // Clear existing children safely
    taskListEl.replaceChildren();

    if (filtered.length === 0) {
      emptyStateEl.classList.remove('hidden');
    } else {
      emptyStateEl.classList.add('hidden');
      filtered.forEach(task => {
        const taskNode = createTaskElement(task);
        taskListEl.appendChild(taskNode);
      });
    }
  }

  /**
   * Toggle task completion status
   */
  function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    showNotification(`Task marked as ${task.completed ? 'completed' : 'pending'}.`);
  }

  /**
   * Delete a task by ID
   */
  function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return;

    const removed = tasks.splice(index, 1)[0];
    saveTasks();
    renderTasks();
    showNotification(`Deleted task: "${removed.title}".`);
  }

  /**
   * Handle form submission to add new task
   */
  function handleAddTask(e) {
    e.preventDefault();

    titleErrorEl.textContent = '';
    const rawTitle = titleInputEl.value;
    const sanitizedTitle = (rawTitle || '').trim();

    if (!sanitizedTitle) {
      titleErrorEl.textContent = 'Please enter a task title.';
      titleInputEl.focus();
      return;
    }

    if (sanitizedTitle.length > 120) {
      titleErrorEl.textContent = 'Task title cannot exceed 120 characters.';
      titleInputEl.focus();
      return;
    }

    const newTask = {
      id: 'task-' + Date.now(),
      title: sanitizedTitle,
      priority: prioritySelectEl.value || 'medium',
      category: categorySelectEl.value || 'Feature',
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();

    // Reset form fields
    taskFormEl.reset();
    showNotification('New task added successfully.');
  }

  /**
   * Handle filter button clicks
   */
  function handleFilterClick(event) {
    const target = event.target;
    if (!target.classList.contains('filter-btn')) return;

    filterBtns.forEach(btn => btn.classList.remove('active'));
    target.classList.add('active');

    currentFilter = target.getAttribute('data-filter') || 'all';
    renderTasks();
  }

  /**
   * Initialize event handlers and render
   */
  function init() {
    loadTasks();
    renderTasks();

    taskFormEl.addEventListener('submit', handleAddTask);

    filterBtns.forEach(btn => {
      btn.addEventListener('click', handleFilterClick);
    });
  }

  // Run on DOM content loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
