-- DropForeignKey
ALTER TABLE `BoardMember` DROP FOREIGN KEY `BoardMember_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `BoardMember` DROP FOREIGN KEY `BoardMember_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `CommentVote` DROP FOREIGN KEY `CommentVote_commentId_fkey`;

-- DropForeignKey
ALTER TABLE `CommentVote` DROP FOREIGN KEY `CommentVote_userId_fkey`;

-- DropForeignKey
ALTER TABLE `PostVote` DROP FOREIGN KEY `PostVote_postId_fkey`;

-- DropForeignKey
ALTER TABLE `PostVote` DROP FOREIGN KEY `PostVote_userId_fkey`;

-- DropIndex
DROP INDEX `BoardMember_boardId_fkey` ON `BoardMember`;

-- DropIndex
DROP INDEX `Comment_authorId_fkey` ON `Comment`;

-- DropIndex
DROP INDEX `Comment_postId_fkey` ON `Comment`;

-- DropIndex
DROP INDEX `CommentVote_userId_fkey` ON `CommentVote`;

-- DropIndex
DROP INDEX `PostVote_userId_fkey` ON `PostVote`;

-- AddForeignKey
ALTER TABLE `BoardMember` ADD CONSTRAINT `BoardMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoardMember` ADD CONSTRAINT `BoardMember_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostVote` ADD CONSTRAINT `PostVote_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostVote` ADD CONSTRAINT `PostVote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentVote` ADD CONSTRAINT `CommentVote_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentVote` ADD CONSTRAINT `CommentVote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
