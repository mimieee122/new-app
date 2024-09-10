/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `nickname` VARCHAR(100) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Post_nickname_key` ON `Post`(`nickname`);
