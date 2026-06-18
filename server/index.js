require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const pool     = require('./db');
const initDb   = require('./init.db');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── helpers ────────────────────────────────────────────────────
function formatDate(dt) {
  return new Date(dt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function rowToBatch(r) {
  return {
    id:           r.batch_id,
    batchId:      r.batch_id,
    batchNo:      r.batch_no,
    grade:        r.grade,
    noOfBags:     r.no_of_bags || null,
    perBagWeight: r.per_bag_weight ? String(r.per_bag_weight) : null,
    totalKgs:     String(r.total_kgs),
    mfgDate:      r.mfg_date ? new Date(r.mfg_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null,
    status:       r.status,
    createdAt:    formatDate(r.created_at),
    addedById:    r.added_by_id,
    addedBy:      r.added_by_name,
    brandId:      r.mark_id || null,
  };
}

function rowToSale(r) {
  return {
    id:           r.sales_id,
    salesId:      r.sales_id,
    dispatchedId: r.dispatched_id,
    batchId:      r.batch_id,
    batchNo:      r.batch_no,
    grade:        r.grade,
    totalKgs:     String(r.total_kgs),
    partyName:    r.party_name,
    remark:       r.remark || '',
    createdAt:    formatDate(r.created_at),
    addedById:    r.added_by_id,
    addedBy:      r.added_by_name,
    rate:         r.sale_rate ? String(r.sale_rate) : (r.dispatch_rate ? String(r.dispatch_rate) : null),
    locationId:   r.location_id || null,
    locationName: r.location_name || null,
    agentId:      r.agent_id || null,
    agentName:    r.agent_name || null,
  };
}

function rowToDispatched(r) {
  return {
    id:           r.dispatched_id,
    dispatchedId: r.dispatched_id,
    batchId:      r.batch_id,
    batchNo:      r.batch_no,
    grade:        r.grade,
    totalKgs:     String(r.total_kgs),
    rate:         r.rate ? String(r.rate) : null,
    remark:       r.remark || '',
    dispatchedAt: formatDate(r.dispatched_at),
    dispatchedBy: r.dispatched_by,
    locationId:   r.location_id || null,
    locationName: r.location_name || null,
    agentId:      r.agent_id || null,
    agentName:    r.agent_name || null,
    partyName:    r.party_name || null,
  };
}

// ── Batches ────────────────────────────────────────────────────
app.get('/api/batches', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, u.name AS added_by_name
      FROM batches b
      LEFT JOIN users u ON b.added_by_id = u.id
      ORDER BY b.created_at DESC
    `);
    res.json(rows.map(rowToBatch));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/batches', async (req, res) => {
  const { batchNo, grade, totalKgs, noOfBags, perBagWeight, mfgDate, userId, brandId } = req.body;
  try {
    const [[{ maxId }]] = await pool.query('SELECT COALESCE(MAX(batch_id + 0), 0) AS maxId FROM batches');
    const id = String(Number(maxId) + 1);
    await pool.query(
      'INSERT INTO batches (batch_id, batch_no, grade, no_of_bags, per_bag_weight, total_kgs, mfg_date, added_by_id, mark_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, batchNo, grade, noOfBags || null, perBagWeight ? parseFloat(perBagWeight) : null, parseFloat(totalKgs), mfgDate || null, userId || null, brandId || null]
    );
    const [rows] = await pool.query(`
      SELECT b.*, u.name AS added_by_name
      FROM batches b LEFT JOIN users u ON b.added_by_id = u.id
      WHERE b.batch_id = ?
    `, [id]);
    res.status(201).json(rowToBatch(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Sales ──────────────────────────────────────────────────────
app.get('/api/sales', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, b.batch_no, u.name AS added_by_name, s.rate AS sale_rate, d.rate AS dispatch_rate, l.name AS location_name, a.name AS agent_name
      FROM sales s
      LEFT JOIN batches b ON s.batch_id = b.batch_id
      LEFT JOIN users u ON s.added_by_id = u.id
      LEFT JOIN sales_dispatched d ON s.dispatched_id = d.dispatched_id
      LEFT JOIN locations l ON s.location_id = l.id
      LEFT JOIN agents a ON s.agent_id = a.id
      ORDER BY s.created_at DESC
    `);
    res.json(rows.map(rowToSale));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sales', async (req, res) => {
  const { dispatchedId, partyName, remark, userId, locationId, agentId, rate } = req.body;
  if (!dispatchedId) return res.status(400).json({ error: 'dispatchedId is required' });
  if (!partyName?.trim()) return res.status(400).json({ error: 'Party name is required' });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[dispatch]] = await conn.query(
      'SELECT d.*, b.batch_no, b.grade, b.total_kgs FROM sales_dispatched d LEFT JOIN batches b ON d.batch_id = b.batch_id WHERE d.dispatched_id = ?',
      [dispatchedId]
    );
    if (!dispatch) { await conn.rollback(); return res.status(404).json({ error: 'Dispatched record not found' }); }
    const [[{ maxId }]] = await conn.query('SELECT COALESCE(MAX(sales_id + 0), 0) AS maxId FROM sales');
    const id = String(Number(maxId) + 1);
    await conn.query(
      'INSERT INTO sales (sales_id, dispatched_id, batch_id, grade, total_kgs, party_name, remark, added_by_id, location_id, agent_id, rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, dispatchedId, dispatch.batch_id, dispatch.grade, dispatch.total_kgs, partyName.trim(), remark || '', userId || null, locationId || null, agentId || null, rate ? parseFloat(rate) : null]
    );
    await conn.query('DELETE FROM sales_dispatched WHERE dispatched_id = ?', [dispatchedId]);
    await conn.commit();
    const [rows] = await conn.query(`
      SELECT s.*, b.batch_no, u.name AS added_by_name, s.rate AS sale_rate, d.rate AS dispatch_rate, l.name AS location_name, a.name AS agent_name
      FROM sales s
      LEFT JOIN batches b ON s.batch_id = b.batch_id
      LEFT JOIN users u ON s.added_by_id = u.id
      LEFT JOIN sales_dispatched d ON s.dispatched_id = d.dispatched_id
      LEFT JOIN locations l ON s.location_id = l.id
      LEFT JOIN agents a ON s.agent_id = a.id
      WHERE s.sales_id = ?
    `, [id]);
    res.status(201).json(rowToSale(rows[0]));
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// ── Sales Dispatched ───────────────────────────────────────────
app.get('/api/dispatched', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, b.batch_no, b.grade, b.total_kgs, l.name AS location_name, a.name AS agent_name
      FROM sales_dispatched d
      LEFT JOIN batches b ON d.batch_id = b.batch_id
      LEFT JOIN locations l ON d.location_id = l.id
      LEFT JOIN agents a ON d.agent_id = a.id
      ORDER BY d.dispatched_at DESC
    `);
    res.json(rows.map(rowToDispatched));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dispatched', async (req, res) => {
  const { batchId, rate, remark, dispatchedBy, locationId, agentId, partyName } = req.body;
  if (!batchId) return res.status(400).json({ error: 'batchId is required' });
  if (!rate || isNaN(rate) || Number(rate) <= 0) return res.status(400).json({ error: 'A valid rate is required' });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[{ maxId }]] = await conn.query('SELECT COALESCE(MAX(dispatched_id + 0), 0) AS maxId FROM sales_dispatched');
    const id = String(Number(maxId) + 1);
    await conn.query(
      'INSERT INTO sales_dispatched (dispatched_id, batch_id, rate, remark, dispatched_by, location_id, agent_id, party_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, batchId, parseFloat(rate), remark || '', dispatchedBy, locationId || null, agentId || null, partyName?.trim() || null]
    );
    await conn.query("UPDATE batches SET status = 'sold' WHERE batch_id = ?", [batchId]);
    await conn.commit();
    const [rows] = await conn.query(`
      SELECT d.*, b.batch_no, b.grade, b.total_kgs, l.name AS location_name, a.name AS agent_name
      FROM sales_dispatched d
      LEFT JOIN batches b ON d.batch_id = b.batch_id
      LEFT JOIN locations l ON d.location_id = l.id
      LEFT JOIN agents a ON d.agent_id = a.id
      WHERE d.dispatched_id = ?
    `, [id]);
    res.status(201).json(rowToDispatched(rows[0]));
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// ── Brands ─────────────────────────────────────────────────────
app.get('/api/marks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM marks ORDER BY name ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/marks', async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Mark name is required' });
  try {
    const [[{ maxId }]] = await pool.query('SELECT COALESCE(MAX(id + 0), 0) AS maxId FROM marks');
    const id = String(Number(maxId) + 1);
    await pool.query('INSERT INTO marks (id, name) VALUES (?, ?)', [id, name.trim()]);
    const [rows] = await pool.query('SELECT * FROM marks WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Mark already exists' });
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/marks/:id', async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Mark name is required' });
  try {
    await pool.query('UPDATE marks SET name = ? WHERE id = ?', [name.trim(), req.params.id]);
    const [rows] = await pool.query('SELECT * FROM marks WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/marks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM marks WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Agents ─────────────────────────────────────────────────────
app.get('/api/agents', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM agents ORDER BY name ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/agents', async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Agent name is required' });
  try {
    const [[{ maxId }]] = await pool.query('SELECT COALESCE(MAX(id + 0), 0) AS maxId FROM agents');
    const id = String(Number(maxId) + 1);
    await pool.query('INSERT INTO agents (id, name) VALUES (?, ?)', [id, name.trim()]);
    const [rows] = await pool.query('SELECT * FROM agents WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Agent already exists' });
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/agents/:id', async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Agent name is required' });
  try {
    await pool.query('UPDATE agents SET name = ? WHERE id = ?', [name.trim(), req.params.id]);
    const [rows] = await pool.query('SELECT * FROM agents WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/agents/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM agents WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Grades ─────────────────────────────────────────────────────
app.get('/api/grades', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM grades ORDER BY id ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/grades', async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Grade name is required' });
  try {
    const [[{ maxId }]] = await pool.query('SELECT COALESCE(MAX(id + 0), 0) AS maxId FROM grades');
    const id = String(Number(maxId) + 1);
    await pool.query('INSERT INTO grades (id, name) VALUES (?, ?)', [id, name.trim()]);
    const [rows] = await pool.query('SELECT * FROM grades WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Grade already exists' });
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/grades/:id', async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Grade name is required' });
  try {
    await pool.query('UPDATE grades SET name = ? WHERE id = ?', [name.trim(), req.params.id]);
    const [rows] = await pool.query('SELECT * FROM grades WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/grades/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM grades WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Locations ──────────────────────────────────────────────────
app.get('/api/locations', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM locations ORDER BY name ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/locations', async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Location name is required' });
  try {
    const [[{ maxId }]] = await pool.query('SELECT COALESCE(MAX(id + 0), 0) AS maxId FROM locations');
    const id = String(Number(maxId) + 1);
    await pool.query('INSERT INTO locations (id, name) VALUES (?, ?)', [id, name.trim()]);
    const [rows] = await pool.query('SELECT * FROM locations WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Location already exists' });
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/locations/:id', async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Location name is required' });
  try {
    await pool.query('UPDATE locations SET name = ? WHERE id = ?', [name.trim(), req.params.id]);
    const [rows] = await pool.query('SELECT * FROM locations WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/locations/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM locations WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Users / Auth ───────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND is_active = 1',
      [email.trim()]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const u = rows[0];
    res.json({
      id:       u.id,
      name:     u.name,
      email:    u.email,
      role:     u.role,
      initials: u.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: process.env.DB_NAME });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Initialize DB tables then start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`TulipTea API running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Server startup aborted — DB init failed:', err.message);
    process.exit(1);
  });
