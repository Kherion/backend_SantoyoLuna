class ProductManager {
   static id_product = 0;

   constructor() {
       this.productos = [];
   }

   obtenerProductos() {
       return this.productos;
   }

   getProductById(id) {
       const product = this.productos.find(producto => producto.id === id);
       if (product) {
           return product;
       } else {
           console.error("No encontrado");
           return null;
       }
   }

   agregarProducto(title, description, price, thumbnail, code, stock) {
       // Validar que todos los campos sean obligatorios
       if (!title || !description || !price || !thumbnail || !code || !stock) {
           console.error("Todos los campos son obligatorios");
           return;
       }

       // Validar que no se repita el campo "code"
       const codeExists = this.productos.some(producto => producto.code === code);
       if (codeExists) {
           console.error("Ya existe un producto con el mismo código");
           return;
       }

       ProductManager.id_product++;
       const producto = {
           id: ProductManager.id_product,
           title,
           description,
           price,
           thumbnail,
           code,
           stock,
       };

       this.productos.push(producto);
       console.log("Producto agregado satisfactoriamente");
   }
}

// Crear una instancia de la clase ProductManager
const productManager = new ProductManager();

// Llamar a obtenerProductos en la instancia recién creada, debe devolver un arreglo vacío []
console.log(productManager.obtenerProductos());

// Agregar un producto
productManager.agregarProducto("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

// Llamar a obtenerProductos nuevamente, esta vez debe aparecer el producto recién agregado
console.log(productManager.obtenerProductos());

// Intentar agregar un producto con el mismo código, debe arrojar un error
productManager.agregarProducto("producto prueba", "Este es otro producto prueba", 150, "Otra imagen", "abc123", 15);

// Evaluar que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
const foundProduct = productManager.getProductById(1); // Cambia el 1 por el id real del producto
console.log(foundProduct); // Debería imprimir el objeto del producto o el mensaje "No encontrado" si no existe
