const {
  registerUserService,
  loginUserService,
  getProfileService,
  listUsersService,
  updateUserRoleService,
  updateUserStatusService,
  getClinicalStaffService
} = require('../services/auth.service');

const getClinicalStaff = async (req, res) => {
  try {
    const users = await getClinicalStaffService();

    return res.status(200).json({
      ok: true,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'No se pudo obtener el personal clínico'
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const user = await registerUserService(req.body);

    return res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente',
      data: user
    });
  } catch (error) {
    console.error('Error en registerUser:', error);

    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.statusCode ? error.message : 'Error interno del servidor'
    });
  }
};

const loginUser = async (req, res) => {
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

const getProfile = async (req, res) => {
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

const listUsers = async (req, res) => {
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

const updateUserRole = async (req, res) => {
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

const updateUserStatus = async (req, res) => {
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

module.exports = {
  getClinicalStaff,
  registerUser,
  loginUser,
  getProfile,
  listUsers,
  updateUserRole,
  updateUserStatus,
};
