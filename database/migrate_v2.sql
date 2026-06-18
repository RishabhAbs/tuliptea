SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `sales_dispatched`;
DROP TABLE IF EXISTS `dispatched`;
DROP TABLE IF EXISTS `sales`;
DROP TABLE IF EXISTS `batches`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. batches  (added_by_id FK → users.id)
CREATE TABLE `batches` (
  `batch_id`      VARCHAR(25)             NOT NULL,
  `batch_no`      VARCHAR(50)             NOT NULL,
  `grade`         VARCHAR(5)              NOT NULL,
  `total_kgs`     DECIMAL(10,2)           NOT NULL,
  `status`        ENUM('pending','sold')  NOT NULL DEFAULT 'pending',
  `created_at`    DATETIME                NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by_id`   VARCHAR(25)             NOT NULL,
  PRIMARY KEY (`batch_id`),
  CONSTRAINT `fk_batch_user` FOREIGN KEY (`added_by_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. sales  (sales_id PK, batch_id FK → batches, added_by_id FK → users)
CREATE TABLE `sales` (
  `sales_id`      VARCHAR(25)                   NOT NULL,
  `batch_id`      VARCHAR(25)                   NOT NULL,
  `batch_no`      VARCHAR(50)                   NOT NULL,
  `grade`         VARCHAR(5)                    NOT NULL,
  `total_kgs`     DECIMAL(10,2)                 NOT NULL,
  `party_name`    VARCHAR(200)                  NOT NULL,
  `remark`        TEXT,
  `status`        ENUM('pending','dispatched')  NOT NULL DEFAULT 'pending',
  `created_at`    DATETIME                      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by_id`   VARCHAR(25)                   NOT NULL,
  PRIMARY KEY (`sales_id`),
  CONSTRAINT `fk_sales_batch` FOREIGN KEY (`batch_id`)    REFERENCES `batches` (`batch_id`),
  CONSTRAINT `fk_sales_user`  FOREIGN KEY (`added_by_id`) REFERENCES `users`   (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. sales_dispatched  (sorts after sales, sales_id FK → sales, NO batch_no)
CREATE TABLE `sales_dispatched` (
  `dispatched_id` VARCHAR(25)   NOT NULL,
  `sales_id`      VARCHAR(25)   NOT NULL,
  `party_name`    VARCHAR(200)  NOT NULL,
  `remark`        TEXT,
  `dispatched_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dispatched_by` VARCHAR(100)  NOT NULL,
  PRIMARY KEY (`dispatched_id`),
  CONSTRAINT `fk_dispatch_sale` FOREIGN KEY (`sales_id`) REFERENCES `sales` (`sales_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed batches (added_by_id = user IDs from users table)
INSERT INTO `batches` VALUES
  ('BTH-93821','BTH-2024-001','A+',180.00,'pending','2026-03-20 09:00:00','USR-00002'),
  ('BTH-72834','BTH-2024-003','B+', 95.00,'pending','2026-03-22 11:00:00','USR-00004'),
  ('BTH-83721','BTH-2024-002','A', 120.00,'sold',   '2026-03-21 10:00:00','USR-00003'),
  ('BTH-61923','BTH-2024-004','A', 210.00,'sold',   '2026-03-24 09:30:00','USR-00002');

-- Seed sales (added_by_id = user IDs)
INSERT INTO `sales` VALUES
  ('SALE-11234','BTH-83721','BTH-2024-002','A',120.00,'Royal Tea Exports','Urgent delivery needed by month end','pending','2026-03-22 12:00:00','USR-00003'),
  ('SALE-22345','BTH-61923','BTH-2024-004','A',210.00,'Green Valley Traders','','pending','2026-03-25 14:00:00','USR-00002');

-- Verify
SHOW TABLES;
SELECT 'batches' AS tbl, batch_id AS pk, added_by_id, status FROM batches
UNION ALL
SELECT 'sales', sales_id, added_by_id, status FROM sales
UNION ALL
SELECT 'sales_dispatched', dispatched_id, dispatched_by, 'N/A' FROM sales_dispatched;
