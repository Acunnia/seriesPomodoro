const fs = require("fs/promises");
const AppConfig = require("../models/app-config.model");

async function readConfig() {
  try {
    const data = AppConfig.find()[0];
    return data;
  } catch (error) {
    console.error("Error al leer el archivo de configuración:", error);
    return null;
  }
}

async function checkPermission(action, userAdminLevel) {
  const config = await readConfig();
  if (!config) {
    return false;
  }
  const requiredLevel = config[action];
  return userAdminLevel >= requiredLevel;
}

function checkPermissionMiddleware(action) {
  return (req, res, next) => {
    const userAdminLevel = req.user.admin_level;
    if (checkPermission(action, userAdminLevel)) {
      console.log(action, userAdminLevel);
      next();
    } else {
      res.status(403).json({ error: "Permiso denegado" });
    }
  };
}

module.exports = checkPermissionMiddleware;
