require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool   = require('./db');

/*
 * Auto-migration pattern
 * ─────────────────────
 * On every server start (local, AWS, cPanel — anywhere):
 *   1. CREATE TABLE IF NOT EXISTS  → creates the table on fresh deploy
 *   2. ensureColumn per field      → adds any missing column on existing installs
 *   3. ensureUniqueIndex           → adds missing unique constraints
 *
 * To add a new column to any table: add one entry to SCHEMA below.
 * That is the only place you need to change — the loop handles the rest.
 */

// ── Schema definition ─────────────────────────────────────────────────────────
// pk:      primary-key column { col, def }
// columns: array of { name, def, unique? }
const SCHEMA = [
  {
    table: 'users',
    pk: { col: 'id', def: 'VARCHAR(25) NOT NULL' },
    columns: [
      { name: 'name',          def: 'VARCHAR(100)             NOT NULL DEFAULT ""' },
      { name: 'email',         def: 'VARCHAR(150)             NOT NULL DEFAULT ""', unique: true },
      { name: 'password_hash', def: 'VARCHAR(255)             NOT NULL DEFAULT ""' },
      { name: 'role',          def: 'ENUM("admin","employee") NOT NULL DEFAULT "employee"' },
      { name: 'is_active',     def: 'TINYINT(1)               NOT NULL DEFAULT 1' },
      { name: 'created_at',    def: 'DATETIME                 NOT NULL DEFAULT CURRENT_TIMESTAMP' },
    ],
  },
  {
    table: 'marks',
    pk: { col: 'id', def: 'VARCHAR(25) NOT NULL' },
    columns: [
      { name: 'name',       def: 'VARCHAR(100) NOT NULL DEFAULT ""', unique: true },
      { name: 'created_at', def: 'DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP' },
    ],
  },
  {
    table: 'agents',
    pk: { col: 'id', def: 'VARCHAR(25) NOT NULL' },
    columns: [
      { name: 'name',       def: 'VARCHAR(100) NOT NULL DEFAULT ""', unique: true },
      { name: 'created_at', def: 'DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP' },
    ],
  },
  {
    table: 'grades',
    pk: { col: 'id', def: 'VARCHAR(25) NOT NULL' },
    columns: [
      { name: 'name',       def: 'VARCHAR(50) NOT NULL DEFAULT ""', unique: true },
      { name: 'created_at', def: 'DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP' },
    ],
  },
  {
    table: 'locations',
    pk: { col: 'id', def: 'VARCHAR(25) NOT NULL' },
    columns: [
      { name: 'name',       def: 'VARCHAR(100) NOT NULL DEFAULT ""', unique: true },
      { name: 'created_at', def: 'DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP' },
    ],
  },
  {
    table: 'batches',
    pk: { col: 'batch_id', def: 'VARCHAR(25) NOT NULL' },
    columns: [
      { name: 'batch_no',       def: 'VARCHAR(50)            NOT NULL DEFAULT ""' },
      { name: 'grade',          def: 'VARCHAR(50)            NOT NULL DEFAULT ""' },
      { name: 'no_of_bags',     def: 'INT                    NULL' },
      { name: 'per_bag_weight', def: 'DECIMAL(10,2)          NULL' },
      { name: 'total_kgs',      def: 'DECIMAL(10,2)          NOT NULL DEFAULT 0' },
      { name: 'mfg_date',       def: 'DATE                   NULL' },
      { name: 'status',         def: 'ENUM("pending","sold") NOT NULL DEFAULT "pending"' },
      { name: 'created_at',     def: 'DATETIME               NOT NULL DEFAULT CURRENT_TIMESTAMP' },
      { name: 'added_by_id',    def: 'VARCHAR(25)            NULL' },
      { name: 'mark_id',        def: 'VARCHAR(25)            NULL' },
    ],
  },
  {
    table: 'sales_dispatched',
    pk: { col: 'dispatched_id', def: 'VARCHAR(25) NOT NULL' },
    columns: [
      { name: 'batch_id',      def: 'VARCHAR(25)   NOT NULL DEFAULT ""' },
      { name: 'rate',          def: 'DECIMAL(10,2) NOT NULL DEFAULT 0' },
      { name: 'remark',        def: 'TEXT          NULL' },
      { name: 'dispatched_at', def: 'DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP' },
      { name: 'dispatched_by', def: 'VARCHAR(100)  NOT NULL DEFAULT ""' },
      { name: 'location_id',   def: 'VARCHAR(25)   NULL' },
      { name: 'agent_id',      def: 'VARCHAR(25)   NULL' },
      { name: 'party_name',    def: 'VARCHAR(200)  NULL' },
    ],
  },
  {
    table: 'sales',
    pk: { col: 'sales_id', def: 'VARCHAR(25) NOT NULL' },
    columns: [
      { name: 'dispatched_id', def: 'VARCHAR(25)   NULL' },
      { name: 'batch_id',      def: 'VARCHAR(25)   NOT NULL DEFAULT ""' },
      { name: 'grade',         def: 'VARCHAR(50)   NOT NULL DEFAULT ""' },
      { name: 'total_kgs',     def: 'DECIMAL(10,2) NOT NULL DEFAULT 0' },
      { name: 'party_name',    def: 'VARCHAR(200)  NOT NULL DEFAULT ""' },
      { name: 'remark',        def: 'TEXT          NULL' },
      { name: 'created_at',    def: 'DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP' },
      { name: 'added_by_id',   def: 'VARCHAR(25)   NULL' },
      { name: 'location_id',   def: 'VARCHAR(25)   NULL' },
      { name: 'agent_id',      def: 'VARCHAR(25)   NULL' },
      { name: 'rate',          def: 'DECIMAL(10,2) NULL' },
    ],
  },
];

// ── Migration helpers ─────────────────────────────────────────────────────────

async function ensureColumn(conn, table, column, definition) {
  const [[{ cnt }]] = await conn.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  if (cnt === 0) {
    console.log(`[DB] Adding column \`${column}\` to \`${table}\``);
    await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
  }
}

async function ensureUniqueIndex(conn, table, column) {
  const [[{ cnt }]] = await conn.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? AND NON_UNIQUE = 0`,
    [table, column]
  );
  if (cnt === 0) {
    const indexName = `uq_${table}_${column}`;
    console.log(`[DB] Adding unique index \`${indexName}\` on \`${table}\`.\`${column}\``);
    await conn.query(`ALTER TABLE \`${table}\` ADD UNIQUE KEY \`${indexName}\` (\`${column}\`)`).catch(() => {});
  }
}

async function dropColumnIfExists(conn, table, column) {
  const [[{ cnt }]] = await conn.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  if (cnt > 0) {
    console.log(`[DB] Dropping legacy column \`${column}\` from \`${table}\``);
    await conn.query(`ALTER TABLE \`${table}\` DROP COLUMN \`${column}\``);
  }
}

// ── Main init ─────────────────────────────────────────────────────────────────

async function initDb() {
  console.log('[DB] Running database initialization...');
  const conn = await pool.getConnection();
  try {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    // ── Pre-migrations: renames (run before schema loop) ─────────
    const [[{ brandsExists }]] = await conn.query(
      `SELECT COUNT(*) AS brandsExists FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'brands'`
    );
    if (brandsExists > 0) {
      console.log('[DB] Renaming table `brands` → `marks`...');
      await conn.query('RENAME TABLE `brands` TO `marks`');
    }

    const [[{ brandIdExists }]] = await conn.query(
      `SELECT COUNT(*) AS brandIdExists FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'batches' AND COLUMN_NAME = 'brand_id'`
    );
    if (brandIdExists > 0) {
      console.log('[DB] Renaming column `brand_id` → `mark_id` in `batches`...');
      await conn.query('ALTER TABLE `batches` CHANGE `brand_id` `mark_id` VARCHAR(25) NULL');
    }

    // Widen grade columns if they are still VARCHAR(5) from old schema
    await conn.query('ALTER TABLE `batches` MODIFY COLUMN `grade` VARCHAR(50) NOT NULL DEFAULT ""').catch(() => {});
    await conn.query('ALTER TABLE `sales`   MODIFY COLUMN `grade` VARCHAR(50) NOT NULL DEFAULT ""').catch(() => {});
    await conn.query('ALTER TABLE `grades`  MODIFY COLUMN `name`  VARCHAR(50) NOT NULL DEFAULT ""').catch(() => {});

    // Apply schema: create table (if new) + ensure every column (if upgraded)
    for (const { table, pk, columns } of SCHEMA) {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS \`${table}\` (
          \`${pk.col}\` ${pk.def},
          PRIMARY KEY (\`${pk.col}\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      for (const col of columns) {
        await ensureColumn(conn, table, col.name, col.def);
        if (col.unique) await ensureUniqueIndex(conn, table, col.name);
      }
    }

    // ── Seed defaults ────────────────────────────────────────────
    const [[{ userCount }]] = await conn.query('SELECT COUNT(*) AS userCount FROM users');
    if (userCount === 0) {
      console.log('[DB] Seeding default admin user...');
      const hash = await bcrypt.hash('admin123', 10);
      await conn.query(
        'INSERT INTO users (id, name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [Date.now().toString(), 'Admin', 'admin@tuliptea.in', hash, 'admin', 1]
      );
    }

    const [[{ gradeCount }]] = await conn.query('SELECT COUNT(*) AS gradeCount FROM grades');
    if (gradeCount === 0) {
      console.log('[DB] Seeding default grades...');
      for (const [i, g] of ['A+', 'A', 'B+', 'B', 'C'].entries()) {
        await conn.query('INSERT INTO grades (id, name) VALUES (?, ?)', [String(i + 1), g]);
      }
    }

    const [[{ locCount }]] = await conn.query('SELECT COUNT(*) AS locCount FROM locations');
    if (locCount === 0) {
      console.log('[DB] Seeding default location: Factory...');
      await conn.query('INSERT INTO locations (id, name) VALUES (?, ?)', ['1', 'Factory']);
    }

    // ── Legacy cleanup ───────────────────────────────────────────
    const [[fkRow]] = await conn.query(`
      SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sales_dispatched'
        AND COLUMN_NAME = 'sales_id' AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    if (fkRow?.CONSTRAINT_NAME) {
      await conn.query(`ALTER TABLE sales_dispatched DROP FOREIGN KEY \`${fkRow.CONSTRAINT_NAME}\``);
      console.log(`[DB] Dropped legacy FK ${fkRow.CONSTRAINT_NAME}`);
    }
    await dropColumnIfExists(conn, 'sales_dispatched', 'sales_id');
    await dropColumnIfExists(conn, 'sales', 'status');
    await dropColumnIfExists(conn, 'batches', 'agent_id');

    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('[DB] All tables and columns verified');
    console.log('[DB] Initialization complete');
  } catch (err) {
    console.error('[DB] Initialization failed:', err.message);
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = initDb;
