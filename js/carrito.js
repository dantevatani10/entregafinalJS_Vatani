let carrito = [];

export function agregarAlCarrito(producto) {
    const itemExistente = carrito.find(item => item.id === producto.id);
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarritoEnLocalStorage();
    actualizarCarritoUI();
    calcularTotal();
}

export function actualizarCarritoUI() {
    const carritoElement = document.getElementById('carrito');
    carritoElement.innerHTML = '';
    carrito.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.nombre}</strong>
                <br>$${item.precio} x ${item.cantidad}
            </div>
            <div class="cart-item-actions">
                <button class="btn btn-sm btn-secondary restar-del-carrito" data-id="${item.id}">-</button>
                <span class="mx-2">${item.cantidad}</span>
                <button class="btn btn-sm btn-secondary sumar-al-carrito" data-id="${item.id}">+</button>
                <button class="btn btn-sm btn-danger ms-2 eliminar-del-carrito" data-id="${item.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        carritoElement.appendChild(itemElement);
    });
    actualizarContadorCarrito();
    actualizarEstadoBotonVaciar();
}

export function calcularTotal() {
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    document.getElementById('total').textContent = `Total: $${total.toFixed(2)}`;
    const enviarPedidoBtn = document.getElementById('enviar-pedido');
    enviarPedidoBtn.disabled = carrito.length === 0;
    actualizarEstadoBotonVaciar();
}

function actualizarEstadoBotonVaciar() {
    const botonVaciar = document.getElementById('vaciar-carrito');
    if (carrito.length === 0) {
        botonVaciar.disabled = true;
        botonVaciar.classList.add('btn-secondary');
        botonVaciar.classList.remove('btn-warning');
    } else {
        botonVaciar.disabled = false;
        botonVaciar.classList.remove('btn-secondary');
        botonVaciar.classList.add('btn-warning');
    }
}

function actualizarContadorCarrito() {
    const contador = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    document.getElementById('cart-count').textContent = contador;
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage() {
    try {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
            actualizarCarritoUI();
            calcularTotal();
        }
    } catch (error) {
        console.error('Error al cargar el carrito desde localStorage:', error);
    }
}

export function restarDelCarrito(id) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad--;
        if (item.cantidad === 0) {
            carrito = carrito.filter(item => item.id !== id);
        }
        actualizarCarritoUI();
        calcularTotal();
        guardarCarritoEnLocalStorage();
    }
}

export function sumarAlCarrito(id) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad++;
        actualizarCarritoUI();
        calcularTotal();
        guardarCarritoEnLocalStorage();
    }
}

export function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarritoUI();
    calcularTotal();
    guardarCarritoEnLocalStorage();
}

export function vaciarCarrito() {
    carrito = [];
    actualizarCarritoUI();
    calcularTotal();
    guardarCarritoEnLocalStorage();
}

export function enviarPedido() {
    if (carrito.length > 0) {
        const clienteModal = new bootstrap.Modal(document.getElementById('clienteModal'));
        clienteModal.show();
        const carritoModal = bootstrap.Modal.getInstance(document.getElementById('carritoModal'));
        carritoModal.hide();
    }
}

export function mostrarDatosTarjeta() {
    const metodoPago = document.getElementById('metodoPago').value;
    const datosTarjeta = document.getElementById('datosTarjeta');
    if (metodoPago === 'tarjeta') {
        datosTarjeta.style.display = 'block';
    } else {
        datosTarjeta.style.display = 'none';
    }
}

export function confirmarPedido() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const direccion = document.getElementById('direccion').value;
    const telefono = document.getElementById('telefono').value;
    const metodoPago = document.getElementById('metodoPago').value;

    if (!nombre || !apellido || !direccion || !telefono || !metodoPago) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }

    if (metodoPago === 'tarjeta') {
        const numeroTarjeta = document.getElementById('numeroTarjeta').value;
        const fechaVencimiento = document.getElementById('fechaVencimiento').value;
        const cvv = document.getElementById('cvv').value;

        if (!numeroTarjeta || !fechaVencimiento || !cvv) {
            alert('Por favor, complete todos los campos de la tarjeta');
            return;
        }
    }

    const resumenPedido = carrito.map(item => `${item.nombre} x${item.cantidad}`).join(', ');
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    
    Swal.fire({
        title: 'Pedido Confirmado',
        html: `
            <h4>Resumen del pedido:</h4>
            <p>${resumenPedido}</p>
            <p><strong>Total: $${total.toFixed(2)}</strong></p>
            <h4>Datos de entrega:</h4>
            <p>Nombre: ${nombre} ${apellido}</p>
            <p>Dirección: ${direccion}</p>
            <p>Teléfono: ${telefono}</p>
            <p>Método de pago: ${metodoPago}</p>
        `,
        icon: 'success',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            vaciarCarrito();
            const clienteModal = bootstrap.Modal.getInstance(document.getElementById('clienteModal'));
            clienteModal.hide();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('enviar-pedido').addEventListener('click', enviarPedido);
    document.getElementById('metodoPago').addEventListener('change', mostrarDatosTarjeta);
    document.getElementById('confirmar-pedido').addEventListener('click', confirmarPedido);
    document.getElementById('vaciar-carrito').addEventListener('click', () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminarán todos los productos del carrito",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, vaciar carrito',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito();
                Swal.fire(
                    'Carrito vaciado!',
                    'Todos los productos han sido eliminados de tu carrito.',
                    'success'
                );
            }
        });
    });
    cargarCarritoDeLocalStorage();
});