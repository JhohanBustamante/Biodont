import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { generateToken } from "../utils/jwt.js";

const ROLES_PERMITIDOS_REGISTRO = ["ODONTOLOGO", "AUXILIAR", "RECEPCION"];

export const registerUserService = async (data) => {
  try {
    let { nombre, apellido, correo, password, rol, telefono, documento } = data;

    if (!nombre || !apellido || !correo || !password || !rol) {
      throw new Error("Todos los campos obligatorios deben ser completados");
    }
    console.log(data)
    rol = rol.toUpperCase().trim();

    if (!ROLES_PERMITIDOS_REGISTRO.includes(rol)) {
      throw new Error("Rol no permitido para registro");
    }

    const existingUserByEmail = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (existingUserByEmail) {
      throw new Error("El correo ya está registrado");
    }

    if (documento) {
      const existingUserByDocument = await prisma.usuario.findUnique({
        where: { documento },
      });

      if (existingUserByDocument) {
        throw new Error("El documento ya está registrado");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.usuario.create({
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

    return newUser;
  } catch (error) {
    console.log(error);
  }
};

export const loginUserService = async (correo, password) => {
  if (!correo || !password) {
    throw new Error("Correo y contraseña son obligatorios");
  } 

  const user = await prisma.usuario.findUnique({
    where: { correo },
  });
  console.log(user)
  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  if (!user.activo) {
    throw new Error("Usuario inactivo. Contacta al administrador");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Credenciales inválidas");
  }

  // await prisma.usuario.update({
  //   where: { id: user.id },
  //   data: {
  //     ultimoAcceso: new Date(),
  //   },
  // });

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

export const getProfileService = async (userId) => {
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
      ultimoAcceso: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user;
};

export const listUsersService = async () => {
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
      ultimoAcceso: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateUserRoleService = async (userId, nuevoRol) => {
  const rolesPermitidosCambio = [
    "ADMIN",
    "ODONTOLOGO",
    "AUXILIAR",
    "RECEPCION",
  ];

  if (!rolesPermitidosCambio.includes(nuevoRol)) {
    throw new Error("Rol inválido");
  }

  const user = await prisma.usuario.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const updatedUser = await prisma.usuario.update({
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

  return updatedUser;
};

export const updateUserStatusService = async (userId, activo) => {
  const user = await prisma.usuario.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const updatedUser = await prisma.usuario.update({
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

  return updatedUser;
};
