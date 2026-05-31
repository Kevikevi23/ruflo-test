import { TodoStore } from './TodoStore.js';
import { TodoRenderer } from './TodoRenderer.js';

const store = new TodoStore('todos');

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const listEl = document.getElementById('todo-list');
const emptyStateEl = document.getElementById('empty-state');
const filtersEl = document.getElementById('filters');
const clearBtn = document.getElementById('clear-completed');

let currentFilter = 'all';
let dragSourceId = null;

const renderer = new TodoRenderer({ listEl, emptyStateEl, filtersEl, clearBtn });

function refresh() {
  renderer.render(
    store.getFiltered(currentFilter),
    store.getAll(),
    currentFilter,
    {
      onToggle: (id) => { store.toggle(id); refresh(); },
      onEdit: (id, text) => { const deleted = store.edit(id, text); if (deleted) refresh(); },
      onDelete: (id) => { store.delete(id); refresh(); },
      onDragStart: (id) => { dragSourceId = id; },
      onDragEnd: () => { dragSourceId = null; },
      onDrop: (toId) => {
        if (dragSourceId && dragSourceId !== toId) {
          store.reorder(dragSourceId, toId);
          refresh();
        }
        dragSourceId = null;
      }
    }
  );
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  store.add(text, dateInput.value || null);
  input.value = '';
  dateInput.value = '';
  input.focus();
  refresh();
});

filtersEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  filtersEl.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  refresh();
});

clearBtn.addEventListener('click', () => {
  store.clearCompleted();
  refresh();
});

refresh();
