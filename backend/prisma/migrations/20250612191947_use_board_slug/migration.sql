/*
  Warnings:

  - The primary key for the `Board` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Board` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `BoardMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `boardId` on the `BoardMember` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `boardId` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[slug]` on the table `Board` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `BoardMember` DROP FOREIGN KEY `BoardMember_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_boardId_fkey`;

-- DropIndex
DROP INDEX `BoardMember_boardId_fkey` ON `BoardMember`;

-- DropIndex
DROP INDEX `Post_boardId_fkey` ON `Post`;

-- AlterTable
ALTER TABLE `Board` DROP PRIMARY KEY,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `BoardMember` DROP PRIMARY KEY,
    MODIFY `boardId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userId`, `boardId`);

-- AlterTable
ALTER TABLE `Post` MODIFY `boardId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Board_slug_key` ON `Board`(`slug`);

-- AddForeignKey
ALTER TABLE `BoardMember` ADD CONSTRAINT `BoardMember_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
