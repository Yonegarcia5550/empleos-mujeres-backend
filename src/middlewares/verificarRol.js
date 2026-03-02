export const soloEmpresa = (req, res, next) => {
  if (req.usuario.rol !== "empresa") {
    return res.status(403).json({
      msg: "No tienes permisos para esta acción",
    });
  }
  next();
};
