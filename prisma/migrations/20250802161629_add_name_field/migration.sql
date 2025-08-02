/*
  Warnings:

  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `bookmarks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bookmarks` DROP FOREIGN KEY `bookmarks_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `bookmarks` DROP FOREIGN KEY `bookmarks_userId_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    ADD COLUMN `name` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `bookmarks`;
