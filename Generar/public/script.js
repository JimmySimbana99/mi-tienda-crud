function ver(seccion) {
    document.getElementById('sec-form').style.display = seccion === 'form' ? 'block' : 'none';
    document.getElementById('sec-lista').style.display = seccion === 'lista' ? 'block' : 'none';
    if(seccion === 'lista') listar();
}

async function guardar() {
    const data = {
        nombre: document.getElementById('nom').value,
        precio: document.getElementById('pre').value,
        cantidad: document.getElementById('can').value
    };
    await fetch('/api/productos', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    alert("¡Producto guardado!");
    document.querySelectorAll('input').forEach(i => i.value = "");
}

async function listar() {
    const buscar = document.getElementById('busqueda').value;
    const res = await fetch(`/api/productos?q=${buscar}`);
    const productos = await res.json();
    const body = document.getElementById('tablaBody');
    body.innerHTML = productos.map(p => `
        <tr>
            <td>${p.nombre}</td>
            <td>$${p.precio}</td>
            <td>${p.cantidad}</td>
            <td><button class="btn-del" onclick="eliminar('${p._id}')">Eliminar</button></td>
        </tr>
    `).join('');
}

async function eliminar(id) {
    if(confirm("¿Seguro?")) {
        await fetch(`/api/productos/${id}`, { method: 'DELETE' });
        listar();
    }
}