export class TodoRenderer {
  constructor({ listEl, emptyStateEl, filtersEl, clearBtn }) {
    this._list = listEl;
    this._emptyState = emptyStateEl;
    this._filters = filtersEl;
    this._clearBtn = clearBtn;
  }

  render(filtered, allTodos, currentFilter, handlers) {
    this._list.innerHTML = '';
    const total = allTodos.length;
    const hasCompleted = allTodos.some((t) => t.completed);

    this._filters.hidden = total === 0;
    this._clearBtn.hidden = !hasCompleted;

    if (total === 0) {
      this._emptyState.textContent = 'No to-dos yet. Add one above!';
      this._emptyState.hidden = false;
    } else if (filtered.length === 0) {
      this._emptyState.textContent = `No ${currentFilter} to-dos.`;
      this._emptyState.hidden = false;
    } else {
      this._emptyState.hidden = true;
    }

    filtered.forEach((todo) => {
      this._list.appendChild(this._createItem(todo, handlers));
    });
  }

  _createItem(todo, handlers) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');
    li.draggable = true;
    li.dataset.id = todo.id;

    const handle = document.createElement('span');
    handle.className = 'drag-handle';
    handle.textContent = '\u2261';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`);
    checkbox.addEventListener('change', () => handlers.onToggle(todo.id));

    const content = document.createElement('div');
    content.className = 'todo-content';

    const textEl = document.createElement('span');
    textEl.className = 'todo-text';
    textEl.textContent = todo.text;
    textEl.contentEditable = !todo.completed;
    textEl.setAttribute('role', 'textbox');
    textEl.setAttribute('aria-label', `Edit "${todo.text}"`);
    textEl.addEventListener('blur', () => handlers.onEdit(todo.id, textEl.textContent));
    textEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); textEl.blur(); }
      if (e.key === 'Escape') { textEl.textContent = todo.text; textEl.blur(); }
    });
    content.appendChild(textEl);

    const dueInfo = this._formatDueDate(todo.dueDate);
    if (dueInfo) {
      const dueEl = document.createElement('div');
      dueEl.className = 'todo-due ' + dueInfo.className;
      dueEl.textContent = dueInfo.label;
      content.appendChild(dueEl);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '\u00d7';
    deleteBtn.setAttribute('aria-label', `Delete "${todo.text}"`);
    deleteBtn.addEventListener('click', () => handlers.onDelete(todo.id));

    this._attachDragEvents(li, todo.id, handlers);

    li.append(handle, checkbox, content, deleteBtn);
    return li;
  }

  _attachDragEvents(li, todoId, handlers) {
    li.addEventListener('dragstart', (e) => {
      handlers.onDragStart(todoId);
      li.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      handlers.onDragEnd();
      this._list.querySelectorAll('.drag-over').forEach((el) => el.classList.remove('drag-over'));
    });
    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      li.classList.add('drag-over');
    });
    li.addEventListener('dragleave', () => li.classList.remove('drag-over'));
    li.addEventListener('drop', (e) => {
      e.preventDefault();
      li.classList.remove('drag-over');
      handlers.onDrop(todoId);
    });
  }

  _formatDueDate(dateStr) {
    if (!dateStr) return null;
    const due = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((due - today) / (1000 * 60 * 60 * 24));
    const label = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (diff < 0) return { label: `Overdue: ${label}`, className: 'overdue' };
    if (diff === 0) return { label: 'Today', className: 'today' };
    if (diff === 1) return { label: 'Tomorrow', className: '' };
    return { label, className: '' };
  }
}
