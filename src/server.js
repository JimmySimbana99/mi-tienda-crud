const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// CONEXIÓN MONGO ATLAS
const mongoURI = "mongodb+srv://abelagogo2000_db_user:4veyiSNEXZLTeYNh@cluster0.rpmb9dz.mongodb.net/TiendaDB?retryWrites=true&w=majority";
mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error:", err));

// MODELO
const Producto = mongoose.model('Producto', {
    nombre: String,
    precio: Number,
    cantidad: Number
});

// --- RUTAS ---

// Listar productos
app.get('/api/productos', async (req, res) => {
    const { q } = req.query;
    const filtro = q ? { nombre: new RegExp(q, 'i') } : {};
    const productos = await Producto.find(filtro);
    res.json(productos);
});

// Guardar nuevo
app.post('/api/productos', async (req, res) => {
    const nuevo = new Producto(req.body);
    await nuevo.save();
    res.json({ msj: "Creado" });
});

// Actualización rápida (Solo stock de la ventana desplegar)
app.put('/api/productos/:id', async (req, res) => {
    const { cantidad } = req.body;
    await Producto.findByIdAndUpdate(req.params.id, { cantidad });
    res.json({ msj: "Stock actualizado" });
});

// Actualización completa (Precio y Stock del botón Editar)
app.put('/api/productos/completo/:id', async (req, res) => {
    const { precio, cantidad } = req.body;
    await Producto.findByIdAndUpdate(req.params.id, { precio, cantidad });
    res.json({ msj: "Edición completa exitosa" });
});

// Eliminar
app.delete('/api/productos/:id', async (req, res) => {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ msj: "Eliminado" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));