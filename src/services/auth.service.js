const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { generateToken } = require('../utils/jwt');
const AppError = require('../errors/AppError');

const ROLES_PERMITIDOS_REGISTRO = ["ODONTOLOGO", "AUXILIAR", "RECEPCION"];

const registerUserService = async (data) => {
  let { nombre, apellido, correo, password, rol, telefono, documento } = data;

  if (!nombre || !apellido || !correo || !password || !rol) {
    throw new AppError('Todos los campos obligatorios deben ser completados', 400);
  }

  rol = rol.toUpperCase().trim();

  if (!ROLES_PERMITIDOS_REGISTRO.includes(rol)) {
    throw new AppError('Rol no permitido para registro', 400);
  }

  const existingUserByEmail = await prisma.usuario.findUnique({
    where: { correo },
  });

  if (existingUserByEmail) {
    throw new AppError('El correo ya está registrado', 409);
  }

  if (documento) {
    const existingUserByDocument = await prisma.usuario.findUnique({
      where: { documento },
    });

    if (existingUserByDocument) {
      throw new AppError('El documento ya está registrado', 409);
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.usuario.create({
    data: {
      nombre,
      apellido,
      correo,
      password: hashedPassword,
      rol,
      telefono,
      documento,
    },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      correo: true,
      rol: true,
      telefono: true,
      documento: true,
      activo: true,
      createdAt: true,
    },
  });
};

const loginUserService = async (correo, password) => {
  if (!correo || !password) {
    throw new AppError("Correo y contraseña son obligatorios", 400);
  }

  const user = await prisma.usuario.findUnique({
    where: { correo },
  });

  if (!user) {
    throw new AppError("Credenciales inválidas", 401);
  }

  if (!user.activo) {
    throw new AppError("Usuario inactivo. Contacta al administrador", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      rol: user.rol,
      telefono: user.telefono,
      documento: user.documento,
      activo: user.activo,
    },
  };
};

const getProfileService = async (userId) => {
  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      correo: true,
      rol: true,
      telefono: true,
      documento: true,
      activo: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return user;
};

const listUsersService = async () => {
  return prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      apellido: true,
      correo: true,
      rol: true,
      telefono: true,
      documento: true,
      activo: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateUserRoleService = async (userId, nuevoRol) => {
  const rolesPermitidosCambio = ["ADMIN", "ODONTOLOGO", "AUXILIAR", "RECEPCION"];

  if (!rolesPermitidosCambio.includes(nuevoRol)) {
    throw new AppError("Rol inválido", 400);
  }

  const user = await prisma.usuario.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return await prisma.usuario.update({
    where: { id: Number(userId) },
    data: { rol: nuevoRol },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      correo: true,
      rol: true,
      activo: true,
      updatedAt: true,
    },
  });
};

const updateUserStatusService = async (userId, activo) => {
  const user = await prisma.usuario.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return await prisma.usuario.update({
    where: { id: Number(userId) },
    data: { activo: Boolean(activo) },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      correo: true,
      rol: true,
      activo: true,
      updatedAt: true,
    },
  });
};

const changeUserPasswordService = async (userId, newPassword) => {
  if (!newPassword || newPassword.length < 8) {
    throw new AppError('La contraseña debe tener al menos 8 caracteres', 400);
  }

  const user = await prisma.usuario.findUnique({ where: { id: Number(userId) } });
  if (!user) throw new AppError('Usuario no encontrado', 404);

  const hashed = await bcrypt.hash(newPassword, 10);
  return await prisma.usuario.update({
    where: { id: Number(userId) },
    data: { password: hashed },
    select: { id: true, nombre: true, apellido: true, correo: true },
  });
};

const getClinicalStaffService = async () => {
  const users = await prisma.usuario.findMany({
    where: {
      activo: true,
      rol: {
        in: ['ODONTOLOGO', 'AUXILIAR']
      }
    },
    orderBy: { nombre: 'asc' },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      rol: true
    }
  });

  return users.map((user) => ({
    id: user.id,
    nombreCompleto: `${user.nombre} ${user.apellido}`.trim(),
    rol: user.rol
  }));
};

module.exports = {
  registerUserService,
  loginUserService,
  getProfileService,
  listUsersService,
  updateUserRoleService,
  updateUserStatusService,
  changeUserPasswordService,
  getClinicalStaffService,
};
