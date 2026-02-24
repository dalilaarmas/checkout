(()=>{

    const producto = {
        id: 0,
        nombre: "",
        imagen: "",
        precio: 0,
        enStock: false,
        activo: false,
        tipoEnvio: "",
        descuento: 0,
        crearProducto: function(id, nombre, imagen, precio, enStock, activo, tipoEnvio, descuento) {
            this.id = id;
            this.nombre = nombre;
            this.imagen = imagen;
            this.precio = precio;
            this.enStock = enStock;
            this.activo = activo;
            this.tipoEnvio = tipoEnvio;
            this.descuento = descuento;
        },

        mostrarPrecio: function() {
               const descontar = (this.precio * this.descuento) / 100;
               return this.precio - descontar;
        },

        actualizarEstadoCompra: function() {
            if (this.activo == true) {
                this.activo = false;
            } else {
                this.activo = true;
            }
        },
    };

    const carrito = {
        productos: [],
        agregarProducto: function(producto, cantidad){
            const item = {
                producto: producto,
                cantidad: cantidad,
            };

            this.productos.push(item);
        },
        eliminarProducto: function(id){
            for (let i = 0; i < this.productos.length; i++)
            {
                if (this.productos[i].producto.id == id) {
                    this.productos.splice(i,1);
                    break;
                }
            }
        },
        modificarCantidad: function(id, cantidad){
            for (let i = 0; i < this.productos.length; i++)
            {
                if (this.productos[i].producto.id == id) {
                    this.productos[i].cantidad = Number(cantidad);
                    if (this.productos[i].cantidad <= 0) {
                        this.eliminarProducto(id);
                    }
                    if (this.productos[i].cantidad > 99) {
                        this.productos[i].cantidad = 99;
                    }
                    break;
                }
            }
        },

        vaciarCarrito: function(){
            this.productos = [];
        },

        mostrarPrecioTotal: function(){
            let precioTotal = 0;
            this.productos.forEach(item => {
                precioTotal += item.cantidad * item.producto.precio;
            });

            return precioTotal;
        },
    };

    const vista = {
        mostrarProductos: function(){
            const contenedor = document.querySelector("#product-container");

            let productHTML = "";

            carrito.productos.forEach(item => {
                productHTML += `<article class="product" id="item-${item.producto.id}">
                    <h2 class="product-title">${item.producto.nombre}</h2>
                   <img class="product-image" src="${item.producto.imagen}">
                    <p>Precio: <span>${item.producto.mostrarPrecio()}€</span></p>
                    <form>
                        <label for="cantidad">Cantidad:</label><input id="cantidad" class="cantidad" type="number" min="1" max="99" value="3" data-id="${item.producto.id}">
                        <button class="product-remove" data-id="${item.producto.id}">Quitar producto</button>
                        <div class="comprarDespues"><label for="comprarMasTarde">Comprar más tarde</label><input type="checkbox" data-id="${item.producto.id}" id="masTarde"></div>
                    </form>
                </article>`;
            });

            contenedor.innerHTML = productHTML;
            this.comprobarVacio();
        },

        comprobarVacio: function() {

            if (carrito.productos.length == 0) {
                this.mensajeCarritoVacio();
                this.actualizarEnlaceCompra();
                events.deshabilitarEnlace();
            }
        },

        quitarProducto: function(id){
           
            const productoEliminar = document.querySelector("#item-" + id);
            if (productoEliminar != null || productoEliminar!= "") {
                 productoEliminar.remove();
                carrito.eliminarProducto(id);
            }

            this.comprobarVacio();
        },

        actualizarCarrito: function(id, value){
            carrito.modificarCantidad(id, value);
        },

        vaciarCarrito: function(){
            const contenedor = document.querySelector("#product-container");
            contenedor.innerHTML = "";

            carrito.vaciarCarrito();
            this.comprobarVacio();

        },

        mensajeCarritoVacio: function(){
            const mensaje = document.querySelector(".carrito-vacio");
            mensaje.classList.remove("hidden");
        },

        actualizarEnlaceCompra: function() {
            const enlaceFinalizar = document.querySelector(".finalizar-compra");
             enlaceFinalizar.classList.add("link-not-allowed");
        }
    };

    const events = {
        asignarEventoBorrar: function() {
            const borrarProductosBotones = document.querySelectorAll(".product-remove");
           borrarProductosBotones.forEach(boton =>{
                boton.addEventListener("click", function(e){
                    e.preventDefault();
                    vista.quitarProducto(e.target.dataset.id);
                });
           });
        },
        asignarEventoActualizar: function(){
            const inputCantidad = document.querySelectorAll(".cantidad");
            inputCantidad.forEach(input=>{
                input.addEventListener("change", function(e){
                carrito.modificarCantidad(e.target.dataset.id, e.target.value);
                });
            });
        },

        asignarEventoVaciar: function(){
            const vaciarCarrito = document.querySelector(".vaciar-carrito");
            vaciarCarrito.addEventListener("click", function(e){
                e.preventDefault();
                vista.vaciarCarrito();
            });
        },

        deshabilitarEnlace: function() {
                const enlaceFinalizar = document.querySelector(".finalizar-compra");
                enlaceFinalizar.addEventListener("click", function(e){
                    e.preventDefault();
            });
        },

        comprarMasTarde: function() {
            const checkbox = document.querySelector("#masTarde");
            checkbox.addEventListener("click", function(e){
                if (checkbox.checked) {
                    e.target.dataset.id
                }
            })
        }
    };

    document.addEventListener("DOMContentLoaded", function(){
        
        const producto1 = Object.create(producto);
        producto1.id = 0;
        producto1.nombre = "Samsung Galaxy S25";
        producto1.imagen = "./../app/img/Samsung-Galaxy-S25.webp";
        producto1.precio = 300;
        producto1.enStock = true;
        producto1.activo = true;
        producto1.tipoEnvio = "nacional";
        producto1.descuento = 10;

        const producto2 = Object.create(producto);
        producto2.id = 1;
        producto2.nombre = "Sony Xperia";
        producto2.imagen = "./../app/img/Samsung-Galaxy-S25.webp";
        producto2.precio = 400;
        producto2.enStock = true;
        producto2.activo = true;
        producto2.tipoEnvio = "nacional";
        producto2.descuento = 10;

        carrito.agregarProducto(producto1, 1);
        carrito.agregarProducto(producto2, 1);

        vista.mostrarProductos();
        events.asignarEventoBorrar();
        events.asignarEventoActualizar();
        events.asignarEventoVaciar();
    });

})();