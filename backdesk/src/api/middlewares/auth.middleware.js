import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado o malformado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Error verificando token:", error.message);
    return res.status(401).json({ message: "Token inválido" });
  }
};


export const isAdmin = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Solo administradores." });
  }
  next();
};
