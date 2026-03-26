const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Agregamos esto para manejar rutas

const app = express();

app.use(express.json());
app.use(cors());

// AJUSTE DE RUTA: Como server.js está en /src, subimos un nivel para encontrar /public
app.use(express.static(path.join(__dirname, '../public')));

// CONEXIÓN A TU MONGODB ATLAS
const mongoURI = "mongodb+srv://abelagogo2000_db_user:4veyiSNEXZLTeYNh@cluster0.rpmb9dz.mongodb.net/TiendaDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas si"))
  .catch(err => console.error("❌ Error de conexión:", err));

// MODELO DE PRODUCTO
const Producto = mongoose.model('Producto', {
    nombre: String,
    precio: Number,
    cantidad: Number
});

// RUTAS API
app.get('/api/productos', async (req, res) => {
    try {
        const { q } = req.query;
        const filtro = q ? { nombre: new RegExp(q, 'i') } : {};
        const productos = await Producto.find(filtro);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

app.post('/api/productos', async (req, res) => {
    try {
        const nuevo = new Producto(req.body);
        await nuevo.save();
        res.json({ msj: "Creado" });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar" });
    }
});

app.delete('/api/productos/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ msj: "Eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});

// PUERTO DINÁMICO PARA RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Servidor funcionando en el puerto ${PORT}`);
});