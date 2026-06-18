CREATE TABLE IF NOT EXISTS `users` (
  `id`         VARCHAR(25)                  NOT NULL,
  `name`       VARCHAR(100)                 NOT NULL,
  `email`      VARCHAR(150)                 NOT NULL,
  `password`   VARCHAR(255)                 NOT NULL,
  `role`       ENUM('admin','employee')     NOT NULL DEFAULT 'employee',
  `is_active`  TINYINT(1)                   NOT NULL DEFAULT 1,
  `created_at` DATETIME                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `users` VALUES
  ('USR-00001', 'Admin',        'admin@tuliptea.in',  'admin123',   'admin',    1, NOW()),
  ('USR-00002', 'Priya Sharma', 'priya@tuliptea.in',  'priya123',   'employee', 1, NOW()),
  ('USR-00003', 'Raj Kumar',    'raj@tuliptea.in',    'raj123',     'employee', 1, NOW()),
  ('USR-00004', 'Anita Patel',  'anita@tuliptea.in',  'anita123',   'employee', 1, NOW());

SELECT id, name, email, role FROM users;
