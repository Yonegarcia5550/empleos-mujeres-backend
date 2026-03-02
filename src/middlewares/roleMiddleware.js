export const autorizarRol = (rolPermitido) => {
  return (req, res, next) => {
    if (req.usuario.rol !== rolPermitido) {
      return res.status(403).json({
        mensaje: "No tienes permisos para esta acción",
      });
    }
    next();
  };
};
