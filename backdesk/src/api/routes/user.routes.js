import express from "express";
import { register,
        login,
        deleteUser,
        deleteUserById,
        updateUserRole,
        getAllUsers } from "../controllers/user.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/delete", verifyToken, deleteUser);
router.delete("/:id", verifyToken, isAdmin, deleteUserById);
router.patch("/:id/role", verifyToken, isAdmin, updateUserRole);
router.get("/", verifyToken, isAdmin, getAllUsers);

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Ruta protegida accedida correctamente",
    user: req.user, // contiene id y rol
  });
});

export default router;



