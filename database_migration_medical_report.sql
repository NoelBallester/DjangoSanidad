-- Database Migration Script for Medical Report
-- Run this script in your MySQL/MariaDB database to add the required columns.

ALTER TABLE `citologias` 
ADD COLUMN `informacion_clinica` MEDIUMTEXT NULL AFTER `tecnicoIdTecnico`,
ADD COLUMN `descripcion_microscopica` MEDIUMTEXT NULL AFTER `informacion_clinica`,
ADD COLUMN `diagnostico_final` MEDIUMTEXT NULL AFTER `descripcion_microscopica`,
ADD COLUMN `patologo_responsable` VARCHAR(255) NULL AFTER `diagnostico_final`;

ALTER TABLE `cassettes` 
ADD COLUMN `informacion_clinica` MEDIUMTEXT NULL AFTER `tecnicoIdTecnico`,
ADD COLUMN `descripcion_microscopica` MEDIUMTEXT NULL AFTER `informacion_clinica`,
ADD COLUMN `diagnostico_final` MEDIUMTEXT NULL AFTER `descripcion_microscopica`,
ADD COLUMN `patologo_responsable` VARCHAR(255) NULL AFTER `diagnostico_final`;
