import Obra from "../models/obra.model.js";

// 🔸 Crear una nueva obra
export const createObra = async (req, res) => {
  try {
    const {
      titulo,
      autor,
      ano,
      siglo,
      corriente,
      pais,
      continente,
    } = req.body;

    const parsedYear = Number(ano?.toString().trim());
    if (isNaN(parsedYear)) {
      return res.status(400).json({ message: "El campo 'año' debe ser un número válido." });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "La imagen es obligatoria." });
    }

    const nuevaObra = new Obra({
      titulo,
      autor,
      año: parsedYear,
      siglo,
      corriente,
      pais,
      continente,
      imagen: req.file.path,
      subidaPor: req.user.id,
      aprobada: req.user.rol === 'admin',
    });

    await nuevaObra.save();

    const mensaje = req.user.rol === 'admin'
      ? 'Obra subida correctamente y aprobada automáticamente.'
      : 'Obra subida correctamente. Pendiente de aprobación.';

    res.status(201).json({ message: mensaje, obra: nuevaObra });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir obra', error: error.message });
  }
};

// 🔸 Aprobar obra (solo admin)
export const aprobarObra = async (req, res) => {
  try {
    const { id } = req.params;

    const obra = await Obra.findById(id);
    if (!obra) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    obra.aprobada = true;
    await obra.save();

    res.status(200).json({ message: "Obra aprobada correctamente", obra });
  } catch (error) {
    res.status(500).json({ message: "Error al aprobar obra", error: error.message });
  }
};

// 🔸 Añadir o quitar obra de favoritos
export const toggleFavorito = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const obra = await Obra.findById(id);
    if (!obra) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    if (!obra.aprobada) {
      return res.status(403).json({ message: "Solo se pueden marcar como favoritas obras aprobadas." });
    }

    const yaEsFavorita = obra.favoritos.includes(userId);
    if (yaEsFavorita) {
      obra.favoritos = obra.favoritos.filter(uid => uid.toString() !== userId);
    } else {
      obra.favoritos.push(userId);
    }

    await obra.save();

    res.status(200).json({
      message: yaEsFavorita ? "Obra eliminada de favoritos" : "Obra añadida a favoritos",
      obra,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al modificar favoritos", error: error.message });
  }
};

// 🔸 Obtener solo imagen e ID de obras aprobadas (público)
export const getObras = async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      userId = payload?.id || null;
    }

    const obras = await Obra.find({ aprobada: true });
    const obrasConFavorito = obras.map((obra) => {
      const obraObj = obra.toObject();
      obraObj.favoritos = userId
        ? obra.favoritos.map(id => id.toString())
        : [];
      return obraObj;
    });

    res.status(200).json({ obras: obrasConFavorito });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las obras", error: error.message });
  }
};

// 🔸 Obtener detalle completo de una obra (login necesario)
export const getObraById = async (req, res) => {
  try {
    const { id } = req.params;

    const obra = await Obra.findById(id).populate("subidaPor", "nombre email");
    if (!obra) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    const esAdmin = req.user.rol === "admin";
    const esAutor = obra.subidaPor._id.toString() === req.user.id;
    const estaPendiente = obra.aprobada === false;

    if (!obra.aprobada && !esAdmin && !esAutor) {
      return res.status(403).json({ message: "No tienes permiso para ver esta obra" });
    }

    res.status(200).json({ obra });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la obra", error: error.message });
  }
};

// 🔸 Obtener obras del usuario
export const getObrasMiasAprobadas = async (req, res) => {
  try {
    const obras = await Obra.find({ subidaPor: req.user.id, aprobada: true });
    res.status(200).json({ obras });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener obras aprobadas", error: error.message });
  }
};

export const getObrasMiasPendientes = async (req, res) => {
  try {
    const obras = await Obra.find({ subidaPor: req.user.id, aprobada: false });
    res.status(200).json({ obras });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener obras pendientes", error: error.message });
  }
};

// 🔸 Obras favoritas del usuario
export const getObrasFavoritas = async (req, res) => {
  try {
    const obras = await Obra.find({ favoritos: req.user.id });
    res.status(200).json({ obras });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener obras favoritas", error: error.message });
  }
};

// 🔸 Obras pendientes (admin)
export const getObrasPendientes = async (req, res) => {
  try {
    const obras = await Obra.find({ aprobada: false }).populate("subidaPor", "nombre email");
    res.status(200).json({ obras });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener obras pendientes", error: error.message });
  }
};

// 🔸 Editar obra
export const editarObra = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      autor,
      ano,
      siglo,
      corriente,
      pais,
      continente,
    } = req.body;

    const obra = await Obra.findById(id);
    if (!obra) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    const esAdmin = req.user.rol === "admin";
    const esAutor = obra.subidaPor?.toString?.() === req.user.id;
    const estaPendiente = obra.aprobada === false;

    if (!esAdmin && (!esAutor || !estaPendiente)) {
      return res.status(403).json({ message: "No tienes permiso para editar esta obra" });
    }

    if (titulo) obra.titulo = titulo;
    if (autor) obra.autor = autor;
    if (ano) {
      const parsed = Number(ano);
      if (isNaN(parsed)) {
        return res.status(400).json({ message: "El año debe ser un número válido" });
      }
      obra.año = parsed;
    }
    if (siglo) obra.siglo = siglo;
    if (corriente) obra.corriente = corriente;
    if (pais) obra.pais = pais;
    if (continente) obra.continente = continente;

    // ✅ Nuevo: actualizar imagen si se sube una nueva
    if (req.file && req.file.path) {
      obra.imagen = req.file.path;
    }

    await obra.save();
    res.status(200).json({ message: "Obra actualizada correctamente", obra });
  } catch (error) {
    res.status(500).json({ message: "Error al editar la obra", error: error.message });
  }
};

// 🔸 Eliminar obra
export const eliminarObra = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.rol;

    const obra = await Obra.findById(id);
    if (!obra) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    if (userRole !== "admin" && (obra.subidaPor.toString() !== userId || obra.aprobada)) {
      return res.status(403).json({
        message: "Solo puedes eliminar tus propias obras pendientes de aprobación"
      });
    }

    await obra.deleteOne();
    res.status(200).json({ message: "Obra eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar obra", error: error.message });
  }
};

// 🔍 Buscar obras (requiere token)
export const buscarObras = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Debe proporcionar un término de búsqueda." });

    const regex = new RegExp(q.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), "i");

    const obras = await Obra.find({
      aprobada: true,
      $or: [
        { titulo: regex },
        { autor: regex },
        { corriente: regex },
        { siglo: regex },
        { pais: regex },
        { continente: regex },
        { año: !isNaN(Number(q)) ? Number(q) : -9999 },
      ],
    }).populate("subidaPor", "nombre");

    const resultadoFinal = obras.filter((obra) =>
      obra.subidaPor?.nombre?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(
        q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      )
    );

    const idsSet = new Set(resultadoFinal.map((o) => o._id.toString()));
    obras.forEach((obra) => {
      if (!idsSet.has(obra._id.toString())) {
        resultadoFinal.push(obra);
      }
    });

    res.status(200).json(resultadoFinal);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar obras", error: error.message });
  }
};
