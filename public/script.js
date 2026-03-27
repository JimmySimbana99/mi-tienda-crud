// Variables globales para rastrear qué producto estamos editando
let productoSeleccionado = null; // Para el modal de suma/resta rápida
let productoAEditarID = null;   // Para el modal de edición completa (Precio y Stock)

// --- NAVEGACIÓN ---
function ver(seccion) {
    document.getElementById('sec-form').style.display = seccion === 'form' ? 'block' : 'none';
    document.getElementById('sec-lista').style.display = seccion === 'lista' ? 'block' : 'none';
    document.getElementById('sec-actualizar').style.display = seccion === 'actualizar' ? 'block' : 'none';
    
    if(seccion === 'lista') listar();
    if(seccion === 'actualizar') listarActualizar();
}

// --- 1. INSERTAR PRODUCTO ---
async function guardar() {
    const nom = document.getElementById('nom').value;
    const pre = document.getElementById('pre').value;
    const can = document.getElementById('can').value;

    if(!nom || !pre || !can) return alert("Llena todos los campos");

    const data = { nombre: nom, precio: parseFloat(pre), cantidad: parseInt(can) };
    
    await fetch('/api/productos', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    alert("¡Producto guardado!");
    document.querySelectorAll('#sec-form input').forEach(i => i.value = "");
}

// --- 2. TABLA VISUALIZAR (Con Botón Editar y Borrar) ---
async function listar() {
    const buscar = document.getElementById('busqueda').value;
    const res = await fetch(`/api/productos?q=${buscar}`);
    const productos = await res.json();
    const body = document.getElementById('tablaBody');
    
    body.innerHTML = productos.map(p => {
        const total = (p.precio * p.cantidad).toFixed(2);
        return `
        <tr>
            <td>${p.nombre}</td>
            <td>$${parseFloat(p.precio).toFixed(2)}</td>
            <td style="font-weight:bold; color: ${p.cantidad < 5 ? 'red' : 'black'}">${p.cantidad}</td>
            <td style="color: #27ae60; font-weight: bold;">$${total}</td>
            <td>
                <button class="btn-edit" onclick="abrirModalEditar('${p._id}', '${p.nombre}', ${p.precio}, ${p.cantidad})">✏️ Editar</button>
                <button class="btn-del" onclick="eliminar('${p._id}')">🗑️ Borrar</button>
            </td>
        </tr>`;
    }).join('');
}

// --- 3. TABLA ACTUALIZAR TIENDA (Suma/Resta rápida) ---
async function listarActualizar() {
    const res = await fetch('/api/productos');
    const productos = await res.json();
    const body = document.getElementById('tablaActualizar');
    
    body.innerHTML = productos.map(p => `
        <tr>
            <td>${p.nombre}</td>
            <td><strong>${p.cantidad}</strong></td>
            <td>$${(p.precio * p.cantidad).toFixed(2)}</td>
            <td><button class="btn-update" onclick="abrirModalRapido('${p._id}', '${p.nombre}', ${p.cantidad})">Desplegar</button></td>
        </tr>`).join('');
}

// --- MODAL A: SUMA/RESTA RÁPIDA (DESPLEGAR) ---
function abrirModalRapido(id, nombre, stock) {
    productoSeleccionado = { id, stock: parseInt(stock) };
    document.getElementById('modalNombre').innerText = nombre;
    document.getElementById('modalStock').innerText = stock;
    document.getElementById('miModal').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('miModal').style.display = 'none';
    document.getElementById('cambioStock').value = "";
}

async function procesarCambio() {
    const cambio = parseInt(document.getElementById('cambioStock').value);
    if(isNaN(cambio)) return alert("Ingresa un número");

    const nuevoStock = productoSeleccionado.stock + cambio;
    if(nuevoStock < 0) return alert("El stock no puede ser menor a 0");

    await fetch(`/api/productos/${productoSeleccionado.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ cantidad: nuevoStock })
    });

    cerrarModal();
    await listarActualizar();
    await listar();
}

// --- MODAL B: EDICIÓN COMPLETA (PRECIO Y STOCK) ---
function abrirModalEditar(id, nombre, precio, stock) {
    productoAEditarID = id;
    document.getElementById('editNombre').innerText = nombre;
    document.getElementById('editPrecio').value = precio;
    document.getElementById('editStock').value = stock;
    document.getElementById('modalEditar').style.display = 'block';
}

function cerrarModalEditar() {
    document.getElementById('modalEditar').style.display = 'none';
}

async function guardarEdicionCompleta() {
    const nuevoPre = document.getElementById('editPrecio').value;
    const nuevoCan = document.getElementById('editStock').value;

    await fetch(`/api/productos/completo/${productoAEditarID}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ precio: parseFloat(nuevoPre), cantidad: parseInt(nuevoCan) })
    });

    cerrarModalEditar();
    await listar();
    await listarActualizar();
    alert("Producto actualizado");
}

// --- ELIMINAR ---
async function eliminar(id) {
    if(confirm("¿Seguro?")) {
        await fetch(`/api/productos/${id}`, { method: 'DELETE' });
        listar();
        listarActualizar();
    }
}