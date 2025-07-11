import User from "../models/user.model.js";
import Obra from "../models/obra.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar nombre válido (solo letras y números)
    const nombreValido = /^[a-zA-Z0-9]+$/.test(nombre);
    if (!nombreValido) {
      return res.status(400).json({
        message: "El nombre solo puede contener letras y números, sin espacios ni símbolos",
      });
    }

    // Validar contraseña mínima
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Verificar duplicados
    const nombreExiste = await User.findOne({ nombre });
    if (nombreExiste) {
      return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
    }

    const emailExiste = await User.findOne({ email });
    if (emailExiste) {
      return res.status(400).json({ message: "Ya existe una cuenta con este correo electrónico" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({
      nombre,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Crear token JWT
    const token = jwt.sign(
      { id: newUser._id, rol: newUser.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Enviar respuesta con el token
    res.status(201).json({
      message: "Usuario registrado con éxito",
      token,
      user: {
        id: newUser._id,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar token
    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al hacer login", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado por admin" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { rol } = req.body;

    if (!["user", "admin"].includes(rol)) {
      return res.status(400).json({ message: "Rol no válido" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { rol }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: `Rol actualizado a ${rol}`,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar rol", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const usersWithObras = await Promise.all(
      users.map(async (user) => {
        const obrasCount = await Obra.countDocuments({
          subidaPor: user._id,
          aprobada: true,
        });

        return {
          ...user.toObject(),
          obrasAprobadas: obrasCount,
        };
      })
    );

    res.status(200).json(usersWithObras);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};
