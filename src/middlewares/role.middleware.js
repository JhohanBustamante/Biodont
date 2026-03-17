export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return res.status(403).json({
        ok: false,
        message: 'Acceso denegado'
      });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        ok: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};