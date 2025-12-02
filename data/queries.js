// data/queries.js
const prisma = require('./pool');
const bcrypt = require('bcryptjs');

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
  return prisma.user.findUnique({ where: { email } });
}

async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

module.exports = {
  createUser,
  findUserById,
  findByEmail,
  comparePassword,
};