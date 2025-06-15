-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_boardId_fkey`;

-- DropIndex
DROP INDEX `Post_boardId_fkey` ON `Post`;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
