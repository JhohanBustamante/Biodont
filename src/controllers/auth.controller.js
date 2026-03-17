import {
  registerUserService,
  loginUserService,
  getProfileService,
  listUsersService,
  updateUserRoleService,
  updateUserStatusService
} from '../services/auth.service.js';

export const registerUser = async (req, res) => {
  try {
    const user = await registerUserService(req.body);

    return res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente',
      data: user
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const result = await loginUserService(correo, password);

    return res.status(200).json({
      ok: true,
      message: 'Inicio de sesión exitoso',
      data: result
    });
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await getProfileService(req.user.id);

    return res.status(200).json({
      ok: true,
      data: user
    });
  } catch (error) {
    return res.status(404).json({
      ok: false,
      message: error.message
    });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await listUsersService();

    return res.status(200).json({
      ok: true,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    const user = await updateUserRoleService(id, rol);

    return res.status(200).json({
      ok: true,
      message: 'Rol actualizado correctamente',
      data: user
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const user = await updateUserStatusService(id, activo);

    return res.status(200).json({
      ok: true,
      message: 'Estado del usuario actualizado correctamente',
      data: user
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};