export class TodoStore {
  constructor(storageKey = 'todos') {
    this._storageKey = storageKey;
    this._todos = this._load();
  }

  _load() {
    try {
      return JSON.parse(localStorage.getItem(this._storageKey)) || [];
    } catch {
      return [];
    }
  }

  _save() {
    localStorage.setItem(this._storageKey, JSON.stringify(this._todos));
  }

  getAll() {
    return [...this._todos];
  }

  getFiltered(filter) {
    if (filter === 'active') return this._todos.filter((t) => !t.completed);
    if (filter === 'completed') return this._todos.filter((t) => t.completed);
    return [...this._todos];
  }

  add(text, dueDate) {
    const todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      dueDate,
      createdAt: new Date().toISOString()
    };
    this._todos.push(todo);
    this._save();
    return todo;
  }

  toggle(id) {
    const todo = this._todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this._save();
    }
  }

  edit(id, newText) {
    const todo = this._todos.find((t) => t.id === id);
    if (todo && newText.trim()) {
      todo.text = newText.trim();
      this._save();
      return false;
    }
    if (todo && !newText.trim()) {
      this.delete(id);
      return true;
    }
    return false;
  }

  delete(id) {
    this._todos = this._todos.filter((t) => t.id !== id);
    this._save();
  }

  clearCompleted() {
    this._todos = this._todos.filter((t) => !t.completed);
    this._save();
  }

  reorder(fromId, toId) {
    const fromIdx = this._todos.findIndex((t) => t.id === fromId);
    const toIdx = this._todos.findIndex((t) => t.id === toId);
    if (fromIdx === -1 || toIdx === -1) return;
    const [moved] = this._todos.splice(fromIdx, 1);
    this._todos.splice(toIdx, 0, moved);
    this._save();
  }

  hasCompleted() {
    return this._todos.some((t) => t.completed);
  }

  get count() {
    return this._todos.length;
  }
}
