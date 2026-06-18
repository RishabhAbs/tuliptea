-- Database: abstechnologieso_tulip

CREATE DATABASE IF NOT EXISTS `abstechnologieso_tulip`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `abstechnologieso_tulip`;

-- 1. users
CREATE TABLE IF NOT EXISTS `users` (
  `id`            VARCHAR(25)              NOT NULL,
  `name`          VARCHAR(100)             NOT NULL,
  `email`         VARCHAR(150)             NOT NULL,
  `password_hash` VARCHAR(255)             NOT NULL,
  `role`          ENUM('admin','employee') NOT NULL DEFAULT 'employee',
  `is_active`     TINYINT(1)               NOT NULL DEFAULT 1,
  `created_at`    DATETIME                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. brands
CREATE TABLE IF NOT EXISTS `brands` (
  `id`         VARCHAR(25)  NOT NULL,
  `name`       VARCHAR(100) NOT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_brand_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. agents
CREATE TABLE IF NOT EXISTS `agents` (
  `id`         VARCHAR(25)  NOT NULL,
  `name`       VARCHAR(100) NOT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_agent_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. batches
CREATE TABLE IF NOT EXISTS `batches` (
  `batch_id`       VARCHAR(25)            NOT NULL,
  `batch_no`       VARCHAR(50)            NOT NULL,
  `grade`          VARCHAR(5)             NOT NULL,
  `no_of_bags`     INT                    NULL,
  `per_bag_weight` DECIMAL(10,2)          NULL,
  `total_kgs`      DECIMAL(10,2)          NOT NULL,
  `mfg_date`       DATE                   NULL,
  `status`         ENUM('pending','sold') NOT NULL DEFAULT 'pending',
  `created_at`     DATETIME               NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by_id`    VARCHAR(25)            NULL,
  `brand_id`       VARCHAR(25)            NULL,
  `agent_id`       VARCHAR(25)            NULL,
  PRIMARY KEY (`batch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. sales
CREATE TABLE IF NOT EXISTS `sales` (
  `sales_id`    VARCHAR(25)                  NOT NULL,
  `batch_id`    VARCHAR(25)                  NOT NULL,
  `grade`       VARCHAR(5)                   NOT NULL,
  `total_kgs`   DECIMAL(10,2)                NOT NULL,
  `party_name`  VARCHAR(200)                 NOT NULL,
  `remark`      TEXT,
  `status`      ENUM('pending','dispatched') NOT NULL DEFAULT 'pending',
  `created_at`  DATETIME                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `added_by_id` VARCHAR(25)                  NULL,
  PRIMARY KEY (`sales_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. sales_dispatched
CREATE TABLE IF NOT EXISTS `sales_dispatched` (
  `dispatched_id` VARCHAR(25)  NOT NULL,
  `sales_id`      VARCHAR(25)  NOT NULL,
  `batch_id`      VARCHAR(25)  NULL,
  `party_name`    VARCHAR(200) NOT NULL,
  `remark`        TEXT,
  `dispatched_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dispatched_by` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`dispatched_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
