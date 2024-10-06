import { agregarAlCarrito, actualizarCarritoUI, calcularTotal, eliminarDelCarrito, restarDelCarrito, sumarAlCarrito } from './carrito.js';

let menu = [];

async function cargarMenu() {
    try {
        const respuesta = await fetch('../js/menu.json');
        menu = await respuesta.json();
        mostrarMenu();
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

function mostrarMenu() {
    const menuElement = document.getElementById('menu');
    menuElement.innerHTML = ''; // Limpiar el menú antes de agregar los nuevos elementos
    menu.forEach(item => {
        const productoElement = document.createElement('div');
        productoElement.className = 'col-md-6 col-lg-4 mb-4';
        productoElement.innerHTML = `
            <div class="card">
                <img src="${item.imagen}" class="card-img-top" alt="${item.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${item.nombre}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${item.titulo}</h6>
                    <p class="card-text">${item.descripcion}</p>
                    <p class="card-text"><strong>Precio: $${item.precio.toFixed(2)}</strong></p>
                    <button class="btn btn-primary agregar-al-carrito" data-id="${item.id}">Agregar al carrito</button>
                </div>
            </div>
        `;
        menuElement.appendChild(productoElement);
    });

    // Agregar event listeners a los botones "Agregar al carrito"
    document.querySelectorAll('.agregar-al-carrito').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const producto = menu.find(item => item.id === id);
            if (producto) {
                agregarAlCarrito(producto);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarMenu();

    // Event delegation para los botones del carrito
    document.getElementById('carrito').addEventListener('click', (e) => {
        if (e.target.classList.contains('restar-del-carrito')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            restarDelCarrito(id);
        } else if (e.target.classList.contains('sumar-al-carrito')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            sumarAlCarrito(id);
        } else if (e.target.classList.contains('eliminar-del-carrito') || e.target.closest('.eliminar-del-carrito')) {
            const id = parseInt(e.target.getAttribute('data-id') || e.target.closest('.eliminar-del-carrito').getAttribute('data-id'));
            eliminarDelCarrito(id);
        }
    });
});