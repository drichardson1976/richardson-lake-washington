const express = require('express');
const Database = require('better-sqlite3');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new Database(path.join(__dirname, 'data.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    correction_index INTEGER DEFAULT 0,
    city_comment TEXT NOT NULL,
    owner TEXT NOT NULL,
    informed TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL REFERENCES tasks(id),
    author TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER REFERENCES tasks(id),
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    detail TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL REFERENCES tasks(id),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    uploaded_by TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// --- API ---

app.get('/api/tasks', (req, res) => {
  const { owner, informed_for, category, status } = req.query;
  let sql = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];
  if (owner) { sql += ' AND owner = ?'; params.push(owner); }
  if (informed_for) { sql += ' AND (owner = ? OR informed LIKE ?)'; params.push(informed_for, `%${informed_for}%`); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (status) { sql += ' AND status = ?'; params.push(status); }
  sql += ' ORDER BY sort_order, id';
  res.json(db.prepare(sql).all(...params));
});

app.get('/api/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  task.comments = db.prepare('SELECT * FROM comments WHERE task_id = ? ORDER BY created_at ASC').all(req.params.id);
  task.attachments = db.prepare('SELECT * FROM attachments WHERE task_id = ? ORDER BY created_at ASC').all(req.params.id);
  task.history = db.prepare('SELECT * FROM activity_log WHERE task_id = ? ORDER BY created_at ASC').all(req.params.id);
  res.json(task);
});

// Get all tasks with inline history (for task list view)
app.get('/api/tasks-full', (req, res) => {
  const { owner, informed_for, category, status } = req.query;
  let sql = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];
  if (owner) { sql += ' AND owner = ?'; params.push(owner); }
  if (informed_for) { sql += ' AND (owner = ? OR informed LIKE ?)'; params.push(informed_for, `%${informed_for}%`); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (status) { sql += ' AND status = ?'; params.push(status); }
  sql += ' ORDER BY sort_order, id';
  const tasks = db.prepare(sql).all(...params);

  // Batch load comments, attachments, history for all tasks
  const taskIds = tasks.map(t => t.id);
  if (taskIds.length) {
    const placeholders = taskIds.map(() => '?').join(',');
    const comments = db.prepare(`SELECT * FROM comments WHERE task_id IN (${placeholders}) ORDER BY created_at ASC`).all(...taskIds);
    const attachments = db.prepare(`SELECT * FROM attachments WHERE task_id IN (${placeholders}) ORDER BY created_at ASC`).all(...taskIds);
    const history = db.prepare(`SELECT * FROM activity_log WHERE task_id IN (${placeholders}) ORDER BY created_at ASC`).all(...taskIds);

    const byTask = (arr) => {
      const map = {};
      arr.forEach(r => { if (!map[r.task_id]) map[r.task_id] = []; map[r.task_id].push(r); });
      return map;
    };
    const commentsMap = byTask(comments);
    const attachmentsMap = byTask(attachments);
    const historyMap = byTask(history);

    tasks.forEach(t => {
      t.comments = commentsMap[t.id] || [];
      t.attachments = attachmentsMap[t.id] || [];
      t.history = historyMap[t.id] || [];
    });
  }
  res.json(tasks);
});

app.patch('/api/tasks/:id', (req, res) => {
  const { status, notes, owner, informed, actor } = req.body;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  const updates = []; const params = [];
  if (status && status !== task.status) {
    updates.push('status = ?'); params.push(status);
    db.prepare('INSERT INTO activity_log (task_id, actor, action, detail) VALUES (?,?,?,?)').run(req.params.id, actor || 'Unknown', 'status_change', `${task.status} → ${status}`);
  }
  if (notes !== undefined) { updates.push('notes = ?'); params.push(notes); }
  if (owner !== undefined && owner !== task.owner) {
    updates.push('owner = ?'); params.push(owner);
    db.prepare('INSERT INTO activity_log (task_id, actor, action, detail) VALUES (?,?,?,?)').run(req.params.id, actor || 'Unknown', 'owner_change', `${task.owner} → ${owner}`);
  }
  if (informed !== undefined) { updates.push('informed = ?'); params.push(informed); }
  if (updates.length) {
    updates.push("updated_at = datetime('now')"); params.push(req.params.id);
    db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }
  res.json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id));
});

app.post('/api/tasks', (req, res) => {
  const { category, city_comment, owner, informed, notes, actor } = req.body;
  if (!category || !city_comment || !owner) return res.status(400).json({ error: 'category, city_comment, owner required' });
  const maxOrder = db.prepare('SELECT MAX(sort_order) as m FROM tasks WHERE category = ?').get(category);
  const result = db.prepare('INSERT INTO tasks (category, city_comment, owner, informed, status, notes, sort_order) VALUES (?,?,?,?,?,?,?)').run(category, city_comment, owner, informed || '', 'pending', notes || '', (maxOrder && maxOrder.m) || 0);
  db.prepare('INSERT INTO activity_log (task_id, actor, action, detail) VALUES (?,?,?,?)').run(result.lastInsertRowid, actor || 'Unknown', 'created', `Assigned to ${owner}`);
  res.status(201).json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid));
});

app.post('/api/tasks/:id/comments', (req, res) => {
  const { author, body } = req.body;
  if (!author || !body) return res.status(400).json({ error: 'author and body required' });
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  const result = db.prepare('INSERT INTO comments (task_id, author, body) VALUES (?,?,?)').run(req.params.id, author, body);
  db.prepare('INSERT INTO activity_log (task_id, actor, action, detail) VALUES (?,?,?,?)').run(req.params.id, author, 'comment', body.substring(0, 100));
  res.status(201).json(db.prepare('SELECT * FROM comments WHERE id = ?').get(result.lastInsertRowid));
});

app.delete('/api/comments/:id', (req, res) => {
  const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(req.params.id);
  if (!comment) return res.status(404).json({ error: 'Not found' });
  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.delete('/api/activity/:id', (req, res) => {
  const entry = db.prepare('SELECT * FROM activity_log WHERE id = ?').get(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Not found' });
  db.prepare('DELETE FROM activity_log WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.delete('/api/attachments/:id', (req, res) => {
  const att = db.prepare('SELECT * FROM attachments WHERE id = ?').get(req.params.id);
  if (!att) return res.status(404).json({ error: 'Not found' });
  // Delete the file from disk
  const filePath = path.join(uploadsDir, att.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  db.prepare('DELETE FROM attachments WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.post('/api/tasks/:id/attachments', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  const uploadedBy = req.body.uploaded_by || 'Unknown';
  const result = db.prepare('INSERT INTO attachments (task_id, filename, original_name, uploaded_by) VALUES (?,?,?,?)').run(req.params.id, req.file.filename, req.file.originalname, uploadedBy);
  db.prepare('INSERT INTO activity_log (task_id, actor, action, detail) VALUES (?,?,?,?)').run(req.params.id, uploadedBy, 'attachment', `Uploaded: ${req.file.originalname}`);
  res.status(201).json(db.prepare('SELECT * FROM attachments WHERE id = ?').get(result.lastInsertRowid));
});

app.get('/api/activity', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(db.prepare('SELECT a.*, t.category, t.city_comment FROM activity_log a LEFT JOIN tasks t ON a.task_id = t.id ORDER BY a.created_at DESC LIMIT ?').all(limit));
});

app.get('/api/stats', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as c FROM tasks').get().c;
  const completed = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE status='completed'").get().c;
  const inProgress = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE status='in_progress'").get().c;
  const pending = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE status='pending'").get().c;
  const blocked = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE status='blocked'").get().c;
  const allTasks = db.prepare('SELECT owner, informed, status FROM tasks').all();
  const byPerson = {};
  allTasks.forEach(t => {
    if (!byPerson[t.owner]) byPerson[t.owner] = { owned: 0, open: 0, completed: 0, pending: 0, in_progress: 0, blocked: 0 };
    byPerson[t.owner].owned++;
    if (t.status === 'completed') byPerson[t.owner].completed++;
    else {
      byPerson[t.owner].open++;
      if (t.status === 'pending') byPerson[t.owner].pending++;
      else if (t.status === 'in_progress') byPerson[t.owner].in_progress++;
      else if (t.status === 'blocked') byPerson[t.owner].blocked++;
    }
  });
  res.json({ total, completed, inProgress, pending, blocked, byPerson });
});

app.get('/api/people', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT owner FROM tasks').all();
  const people = new Set(rows.map(r => r.owner));
  db.prepare('SELECT DISTINCT informed FROM tasks').all().forEach(r => {
    if (r.informed) r.informed.split(',').forEach(n => { const t = n.trim(); if (t) people.add(t); });
  });
  res.json([...people].sort());
});

app.get('/api/documents/corrections', (req, res) => {
  const dir = path.join(__dirname, 'public', 'corrections');
  if (!fs.existsSync(dir)) return res.json([]);
  res.json(fs.readdirSync(dir).filter(f => f.endsWith('.pdf')).map(f => ({ name: f, url: `/corrections/${encodeURIComponent(f)}` })));
});

app.get('/api/documents/submitted-plans', (req, res) => {
  const dir = path.join(__dirname, 'public', 'submitted-plans');
  if (!fs.existsSync(dir)) return res.json([]);
  res.json(fs.readdirSync(dir).filter(f => f.endsWith('.pdf')).map(f => ({ name: f, url: `/submitted-plans/${encodeURIComponent(f)}` })));
});

app.get('/api/documents/comment-attachments', (req, res) => {
  const attachments = db.prepare(`
    SELECT a.*, t.id as task_id, t.category, t.city_comment
    FROM attachments a
    JOIN tasks t ON a.task_id = t.id
    ORDER BY a.created_at DESC
  `).all();
  res.json(attachments);
});

app.listen(PORT, () => console.log(`Richardson Plan Review tracker running at http://localhost:${PORT}`));
