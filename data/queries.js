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
async function findFolderByName(folderName) {
  return prisma.folder.findFirst({ where: { folderName: folderName } });
}
async function getFolderById(id) {
  return prisma.folder.findUnique({ where: { id: Number(id) } });
}
async function getFilesByFolderId(folderId) {
  return prisma.file.findMany({ where: { folderId: Number(folderId) } });
}
async function createFolder(newFolder) {
  return prisma.folder.create({
    data: {
      ...newFolder, 
    },
  });
}

async function getFoldersByUserId(userId) {
  return prisma.folder.findMany({ where: { userId: Number(userId) } });
}
async function getPublicFolders() {
  console.log("getting public folders");
  return prisma.folder.findMany({ where: { ispublic: true } });
}
async function getAllFolders() {
  console.log("getting all folders");
  return prisma.folder.findMany();
}
// file related functions
async function saveFileMetadata(fileData) {
  const folderIdValue = fileData.folderId === 'null' ? null : parseInt(fileData.folderId);

  return prisma.file.create({
    data: { fileName: fileData.fileName,
            path: fileData.path,
            mimetype: fileData.mimetype,
            extension: fileData.extension,
            ispublic: fileData.ispublic,
            folderId: folderIdValue,
            userId: fileData.userId,
            cloudinaryId: fileData.cloudinaryId
             },
  });
}

async function rootFilesByUserId(userId) {
  return prisma.file.findMany({ where: { userId: Number(userId),folderId:null} })
}
async function getFilesByFolderId(folderId) {
  return prisma.file.findMany({where:{folderId:Number(folderId)}})
}
async function getFileById(fileId) {
  return prisma.file.findUnique({ where: { id: Number(fileId) } });
}
async function getPublicFiles() {
  return prisma.file.findMany({ where: { ispublic: true } })
}
async function getRootFiles() {
  return prisma.file.findMany({where: { folderId: null } });
}
async function getPublicRootFiles() {
  return prisma.file.findMany({ where: { ispublic: true, folderId: null } });
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
  saveFileMetadata,
  rootFilesByUserId,
  getFileById,
  getPublicFiles,
  getRootFiles,
  getPublicRootFiles
};