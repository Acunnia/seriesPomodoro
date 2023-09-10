const fs = require('fs/promises');

async function readConfig() {
  try {
    const data = await fs.readFile('./utils/settings.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo de configuración:', error);
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
        res.status(403).json({ error: 'Permiso denegado' });
      }
    };
  }

  module.exports = checkPermissionMiddleware;