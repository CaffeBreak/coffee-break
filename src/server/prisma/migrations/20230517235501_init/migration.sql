-- CreateTable
CREATE TABLE `Player` (
    `id` VARCHAR(10) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Player_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` VARCHAR(10) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `state` ENUM('WAITING', 'USING', 'DISCUSSING', 'VOTING', 'FINISHED') NOT NULL,

    UNIQUE INDEX `Room_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chat` (
    `id` VARCHAR(10) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `playerId` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Chat_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsedCard` (
    `id` VARCHAR(10) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `playerId` VARCHAR(191) NOT NULL,
    `cardId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UsedCard_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PlayerRoom` (
    `A` VARCHAR(10) NOT NULL,
    `B` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `_PlayerRoom_AB_unique`(`A`, `B`),
    INDEX `_PlayerRoom_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsedCard` ADD CONSTRAINT `UsedCard_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsedCard` ADD CONSTRAINT `UsedCard_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerRoom` ADD CONSTRAINT `_PlayerRoom_A_fkey` FOREIGN KEY (`A`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerRoom` ADD CONSTRAINT `_PlayerRoom_B_fkey` FOREIGN KEY (`B`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
