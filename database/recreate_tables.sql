SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `dispatched`;
DROP TABLE IF EXISTS `sales`;
DROP TABLE IF EXISTS `batches`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. batches (batch_id as PK, status tracks pending → sold)
CREATE TABLE `batches` (
  `batch_id`   VARCHAR(25)                  NOT NULL,
  `batch_no`   VARCHAR(50)                  NOT NULL,
  `grade`      VARCHAR(5)                   NOT NULL,
  `total_kgs`  DECIMAL(10,2)                NOT NULL,
  `status`     ENUM('pending','sold')        NOT NULL DEFAULT 'pending',
  `created_at` DATETIME                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by`   VARCHAR(100)                 NOT NULL,
  PRIMARY KEY (`batch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. sales (sales_id as PK, batch_id FK → batches)
CREATE TABLE `sales` (
  `sales_id`   VARCHAR(25)                        NOT NULL,
  `batch_id`   VARCHAR(25)                        NOT NULL,
  `batch_no`   VARCHAR(50)                        NOT NULL,
  `grade`      VARCHAR(5)                         NOT NULL,
  `total_kgs`  DECIMAL(10,2)                      NOT NULL,
  `party_name` VARCHAR(200)                       NOT NULL,
  `remark`     TEXT,
  `status`     ENUM('pending','dispatched')        NOT NULL DEFAULT 'pending',
  `created_at` DATETIME                           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by`   VARCHAR(100)                       NOT NULL,
  PRIMARY KEY (`sales_id`),
  CONSTRAINT `fk_sales_batch` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. dispatched (sales_id FK → sales, NO batch_no — derived via JOIN)
CREATE TABLE `dispatched` (
  `dispatched_id` VARCHAR(25)   NOT NULL,
  `sales_id`      VARCHAR(25)   NOT NULL,
  `party_name`    VARCHAR(200)  NOT NULL,
  `remark`        TEXT,
  `dispatched_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dispatched_by` VARCHAR(100)  NOT NULL,
  PRIMARY KEY (`dispatched_id`),
  CONSTRAINT `fk_dispatched_sale` FOREIGN KEY (`sales_id`) REFERENCES `sales` (`sales_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed: 4 batches (2 pending, 2 sold)
INSERT INTO `batches` VALUES
  ('BTH-93821','BTH-2024-001','A+',180.00,'pending','2026-03-20 09:00:00','Priya Sharma'),
  ('BTH-72834','BTH-2024-003','B+', 95.00,'pending','2026-03-22 11:00:00','Anita Patel'),
  ('BTH-83721','BTH-2024-002','A', 120.00,'sold',   '2026-03-21 10:00:00','Raj Kumar'),
  ('BTH-61923','BTH-2024-004','A', 210.00,'sold',   '2026-03-24 09:30:00','Priya Sharma');

-- Seed: 2 sales linked to sold batches
INSERT INTO `sales` VALUES
  ('SALE-11234','BTH-83721','BTH-2024-002','A',120.00,'Royal Tea Exports','Urgent delivery needed by month end','pending','2026-03-22 12:00:00','Raj Kumar'),
  ('SALE-22345','BTH-61923','BTH-2024-004','A',210.00,'Green Valley Traders','','pending','2026-03-25 14:00:00','Priya Sharma');

SHOW TABLES;
SELECT 'batches' AS tbl, batch_id AS pk, status FROM batches
UNION ALL
SELECT 'sales', sales_id, status FROM sales
UNION ALL
SELECT 'dispatched', dispatched_id, 'N/A' FROM dispatched;
