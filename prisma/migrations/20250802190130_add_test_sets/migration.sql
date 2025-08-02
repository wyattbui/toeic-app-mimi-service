-- CreateTable
CREATE TABLE `test_sets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `partId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `questionCount` INTEGER NOT NULL DEFAULT 20,
    `timeLimit` INTEGER NOT NULL DEFAULT 60,
    `difficulty` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'created',
    `startedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `totalScore` INTEGER NULL DEFAULT 0,
    `correctAnswers` INTEGER NULL DEFAULT 0,
    `wrongAnswers` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_set_questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `testSetId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `orderIndex` INTEGER NOT NULL,

    UNIQUE INDEX `test_set_questions_testSetId_questionId_key`(`testSetId`, `questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_set_answers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `testSetId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `selectedOption` VARCHAR(191) NULL,
    `isCorrect` BOOLEAN NULL,
    `timeSpent` INTEGER NULL,

    UNIQUE INDEX `test_set_answers_testSetId_questionId_key`(`testSetId`, `questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `test_sets` ADD CONSTRAINT `test_sets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_sets` ADD CONSTRAINT `test_sets_partId_fkey` FOREIGN KEY (`partId`) REFERENCES `parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_set_questions` ADD CONSTRAINT `test_set_questions_testSetId_fkey` FOREIGN KEY (`testSetId`) REFERENCES `test_sets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_set_questions` ADD CONSTRAINT `test_set_questions_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_set_answers` ADD CONSTRAINT `test_set_answers_testSetId_fkey` FOREIGN KEY (`testSetId`) REFERENCES `test_sets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_set_answers` ADD CONSTRAINT `test_set_answers_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
