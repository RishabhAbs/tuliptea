CREATE TABLE IF NOT EXISTS `batches` (
  `id`         VARCHAR(25)    NOT NULL,
  `batch_no`   VARCHAR(50)    NOT NULL,
  `grade`      VARCHAR(5)     NOT NULL,
  `total_kgs`  DECIMAL(10,2)  NOT NULL,
  `created_at` DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by`   VARCHAR(100)   NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `sales` (
  `id`          VARCHAR(25)    NOT NULL,
  `batch_id`    VARCHAR(25)    NOT NULL,
  `batch_no`    VARCHAR(50)    NOT NULL,
  `grade`       VARCHAR(5)     NOT NULL,
  `total_kgs`   DECIMAL(10,2)  NOT NULL,
  `party_name`  VARCHAR(200)   NOT NULL,
  `remark`      TEXT,
  `status`      VARCHAR(20)    NOT NULL DEFAULT 'pending',
  `created_at`  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by`    VARCHAR(100)   NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `dispatched` (
  `id`            VARCHAR(25)   NOT NULL,
  `sale_id`       VARCHAR(25)   NOT NULL,
  `batch_no`      VARCHAR(50)   NOT NULL,
  `party_name`    VARCHAR(200)  NOT NULL,
  `remark`        TEXT,
  `dispatched_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dispatched_by` VARCHAR(100)  NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `batches` VALUES
  ('BTH-93821','BTH-2024-001','A+',180.00,'2026-03-20 09:00:00','Priya Sharma'),
  ('BTH-83721','BTH-2024-002','A',120.00,'2026-03-21 10:00:00','Raj Kumar'),
  ('BTH-72834','BTH-2024-003','B+',95.00,'2026-03-22 11:00:00','Anita Patel'),
  ('BTH-61923','BTH-2024-004','A',210.00,'2026-03-24 09:30:00','Priya Sharma');

INSERT IGNORE INTO `sales` VALUES
  ('SALE-11234','BTH-83721','BTH-2024-002','A',120.00,'Royal Tea Exports','Urgent delivery needed by month end','pending','2026-03-22 12:00:00','Raj Kumar'),
  ('SALE-22345','BTH-61923','BTH-2024-004','A',210.00,'Green Valley Traders','','pending','2026-03-25 14:00:00','Priya Sharma');

SHOW TABLES;
