-- AlterTable
ALTER TABLE `Player` ADD COLUMN `role` ENUM('VILLAGER', 'WEREWOLF', 'PENDING') NOT NULL DEFAULT 'PENDING';
