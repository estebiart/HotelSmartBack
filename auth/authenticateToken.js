const log = require("../lib/trace");
const validateToken = require("./validateToken");
const { verifyAccessToken } = require("./verify");

function authenticateToken(req, res, next) {
  // Obtener la ruta actual
  const { path, method } = req;

  // Definir las rutas que no requieren token para métodos GET
  const publicGetRoutes = ["/api/hotels"];

  // Verificar si la ruta actual y el método están en la lista de rutas públicas para GET
  if (method === "GET" && publicGetRoutes.includes(path)) {
    // Si la ruta es pública para GET, no requerir token, pasar a la siguiente middleware
    return next();
  }

  let token = null;
  log.info("headers", req.headers);
  try {
    token = validateToken(req.headers);
    //    log.info("Token", token);
  } catch (error) {
    //console.log("Error", error.message);
    log.error(error.message);
    if (error.message === "Token not provided") {
      return res.status(401).json({ error: "Token no proporcionado" });
    }
    if (error.message === "Token format invalid") {
      return res.status(401).json({ error: "Token mal formado" });
    }
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = { ...decoded.user };
    next();
  } catch (err) {
    // console.log("6 Token inválido", token, err);
    return res.status(403).json({ error: "Token inválido" });
  }
}

module.exports = authenticateToken;
