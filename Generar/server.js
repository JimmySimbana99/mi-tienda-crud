const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// CONEXIÓN A TU MONGODB ATLAS
const mongoURI = "mongodb+srv://abelagogo2000_db_user:4veyiSNEXZLTeYNh@cluster0.rpmb9dz.mongodb.net/TiendaDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas si"))
  .catch(err => console.error("❌ Error:", err));

// MODELO DE PRODUCTO
const Producto = mongoose.model('Producto', {
    nombre: String,
    precio: Number,
    cantidad: Number
});

// RUTAS
app.get('/api/productos', async (req, res) => {
    const { q } = req.query;
    const filtro = q ? { nombre: new RegExp(q, 'i') } : {};
    res.json(await Producto.find(filtro));
});

app.post('/api/productos', async (req, res) => {
    const nuevo = new Producto(req.body);
    await nuevo.save();
    res.json({ msj: "Creado" });
});

app.delete('/api/productos/:id', async (req, res) => {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ msj: "Eliminado" });
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));