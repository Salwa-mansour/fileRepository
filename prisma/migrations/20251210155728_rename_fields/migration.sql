/*
  Warnings:

  - You are about to drop the column `name` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Folder` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `folderName` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "name",
ADD COLUMN     "fileName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "name",
ADD COLUMN     "folderName" TEXT NOT NULL;
