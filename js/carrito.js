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
    agregarEventListeners();
    actualizarEstadoBotonVaciar(); // Actualiza el botón después de cada cambio en el carrito
}

export function calcularTotal() {
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    document.getElementById('total').textContent = `Total: $${total.toFixed(2)}`;
    const enviarPedidoBtn = document.getElementById('enviar-pedido');
    enviarPedidoBtn.disabled = carrito.length === 0;
    actualizarEstadoBotonVaciar(); // Llama a la función para actualizar el estado del botón
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

function agregarEventListeners() {
    document.querySelectorAll('.restar-del-carrito').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            restarDelCarrito(id);
        });
    });

    document.querySelectorAll('.sumar-al-carrito').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            sumarAlCarrito(id);
        });
    });

    document.querySelectorAll('.eliminar-del-carrito').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            eliminarDelCarrito(id);
        });
    });
}

function restarDelCarrito(id) {
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

function sumarAlCarrito(id) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad++;
        actualizarCarritoUI();
        calcularTotal();
        guardarCarritoEnLocalStorage();
    }
}

function eliminarDelCarrito(id) {
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

function enviarPedido() {
    if (carrito.length > 0) {
        Swal.fire({
            title: '¡Pedido Enviado!',
            text: 'Tu pedido ha sido enviado con éxito.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito();
                // Cerrar el modal después de enviar el pedido
                const carritoModal = bootstrap.Modal.getInstance(document.getElementById('carritoModal'));
                carritoModal.hide();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('enviar-pedido').addEventListener('click', enviarPedido);
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
                    '¡Carrito vaciado!',
                    'Todos los productos han sido eliminados del carrito.',
                    'success'
                );
            }
        });
    });
    cargarCarritoDeLocalStorage();
});

export { eliminarDelCarrito, restarDelCarrito, sumarAlCarrito };
