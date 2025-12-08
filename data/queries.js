// data/queries.js
const prisma = require('./pool');
const bcrypt = require('bcryptjs');
// account related queries
async function createUser({ userName, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { userName, email, password: hashedPassword },
  });
}

async function findUserById(id) {
  return prisma.user.findUnique({ where: { id: Number(id) } });
}


async function findByEmail(email) {
  console.log(email);
  return prisma.user.findUnique({
    where: {
      email: email, 
    },
  });
}

async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}
//folder related queries
async function findFolderByName(foldername) {
  return prisma.folder.findUnique({ where: { foldername: foldername } });
}
async function getFolderById(id) {
  return prisma.folder.findUnique({ where: { id: Number(id) } });
}
async function getFilesByFolderId(folderId) {
  return prisma.file.findMany({ where: { folderId: Number(folderId) } });
}
async function createFolder({ foldername, ispublic, userId }) {
  return prisma.folder.create({
    data: { foldername, ispublic, userId },
  });
}

async function getFoldersByUserId(userId) {
  return prisma.folder.findMany({ where: { userId: Number(userId) } });
}
async function getPublicFolders() {
  return prisma.folder.findMany({ where: { ispublic: true } });
}
async function getAllFolders() {
  return prisma.folder.findMany();
}
module.exports = {
  createUser,
  findUserById,
  findByEmail,
  comparePassword,
  findFolderByName,
  createFolder,
  getFoldersByUserId,
  getPublicFolders,
  getAllFolders,
  getFolderById,
  getFilesByFolderId,  
};