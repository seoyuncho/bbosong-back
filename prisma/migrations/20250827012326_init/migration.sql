-- CreateTable
CREATE TABLE `station` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `initial_umbrella_count` INTEGER NULL DEFAULT 0,
    `current_umbrella_count` INTEGER NULL DEFAULT 0,
    `max_umbrella_capacity` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `umbrella` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `qr_info` VARCHAR(255) NOT NULL,
    `station_borrow_id` INTEGER NULL,
    `station_return_id` INTEGER NULL,
    `rent_start` DATETIME(0) NULL,
    `rent_end` DATETIME(0) NULL,
    `rent_returned` DATETIME(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `qr_info`(`qr_info`),
    INDEX `station_borrow_id`(`station_borrow_id`),
    INDEX `station_return_id`(`station_return_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `umbrellatraces` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `umbrella_id` INTEGER NOT NULL,
    `station_id` INTEGER NOT NULL,
    `trace_time` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `station_id`(`station_id`),
    INDEX `umbrella_id`(`umbrella_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `email` VARCHAR(60) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `gender` ENUM('male', 'female', 'other') NOT NULL,
    `birthdate` DATE NOT NULL,
    `usertype` ENUM('customer', 'store_owner') NOT NULL,
    `signupVerifyToken` VARCHAR(100) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Store` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `description` TEXT NULL,
    `address` VARCHAR(255) NULL,
    `category` VARCHAR(50) NOT NULL,
    `image_url` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hashtag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tag_name` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `Hashtag_tag_name_key`(`tag_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StoreHashtag` (
    `storeId` INTEGER NOT NULL,
    `hashtagId` INTEGER NOT NULL,

    PRIMARY KEY (`storeId`, `hashtagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `umbrella` ADD CONSTRAINT `umbrella_ibfk_1` FOREIGN KEY (`station_borrow_id`) REFERENCES `station`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `umbrella` ADD CONSTRAINT `umbrella_ibfk_2` FOREIGN KEY (`station_return_id`) REFERENCES `station`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `umbrellatraces` ADD CONSTRAINT `umbrellatraces_ibfk_1` FOREIGN KEY (`umbrella_id`) REFERENCES `umbrella`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `umbrellatraces` ADD CONSTRAINT `umbrellatraces_ibfk_2` FOREIGN KEY (`station_id`) REFERENCES `station`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `StoreHashtag` ADD CONSTRAINT `StoreHashtag_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StoreHashtag` ADD CONSTRAINT `StoreHashtag_hashtagId_fkey` FOREIGN KEY (`hashtagId`) REFERENCES `Hashtag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
