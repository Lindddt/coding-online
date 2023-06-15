CREATE SCHEMA `code` DEFAULT CHARACTER SET utf8;

CREATE TABLE `code`.`user` (
  `username` VARCHAR(256) NOT NULL,
  `password` VARCHAR(256) NOT NULL,
  `email` VARCHAR(256) NOT NULL,
  `uuid` BINARY(16) NOT NULL,
  `identity` INT(4) NULL DEFAULT 0,
  PRIMARY KEY (`uuid`),
  UNIQUE INDEX `uuid_UNIQUE` (`uuid` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE
);

ALTER TABLE
  `code`.`user`
ADD
  COLUMN `session` VARCHAR(256) NULL
AFTER
  `identity`,
ADD
  UNIQUE INDEX `session_UNIQUE` (`session` ASC) VISIBLE;

;

CREATE TABLE `code`.`verificationcode` (
  `email` VARCHAR(256) NOT NULL,
  `code` VARCHAR(6) NULL,
  PRIMARY KEY (`email`)
);

ALTER TABLE
  `code`.`user` CHANGE COLUMN `uuid` `uuid` VARCHAR(40) NOT NULL,
  CHANGE COLUMN `identity` `identity` INT NOT NULL DEFAULT '0';

CREATE TABLE `code`.`session` (
  `sessionId` VARCHAR(40) NOT NULL,
  `sessionData` VARCHAR(512) NOT NULL,
  PRIMARY KEY (`sessionId`)
);

ALTER TABLE
  `code`.`user` CHANGE COLUMN `session` `sessionId` VARCHAR(40) NULL DEFAULT NULL;

ALTER TABLE
  `code`.`session`
ADD
  COLUMN `expire` DATETIME NOT NULL
AFTER
  `sessionData`;