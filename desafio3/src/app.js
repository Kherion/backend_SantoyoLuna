
// Nuestra consigna en este proyecto será desarrollar un servidor basado en express que nos permita hacer consultas a nuestro archivo de productos.

// Aspectos a incluir: Se deberá utilizar la clase ProductManager que actualmente utilizamos con persistencia de archivos.

// Se deberá desarrollar un servidor express que, en su archivo app.js importe el archivo de ProductManager que actualmente utilizamos con persistencia de archivos.

// El servidor debe contar con los siguientes endpoints: ruta '/products', la cual debe leer el archivo de productos y devolverlos dentro de un opbjeto, Agregar soporte para recibir por query param el valor ?limit = el cual recibirá un límite de resultados. Si no recibe el query de límite,  se devolverán todos los productos. Si recibe un límite, sólo devolver el número de productos solicitados.

// Ruta '/products/:pid', la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos.

// Sugerencias: Tu clase lee archivos con promesas. Recuerda usar async/await en tus endpoints. 
// Sugerencias; Utiliza un archivo que ya tenga productos, pues el desafío sólo es para gets.


import express from 'express';
const app = express();
const PORT = 8080;

import ProductManager from './productManager.js';
const productManager = new ProductManager();

app.get('/products', async (req, res) => {
    try {
        const products = await productManager.obtenerProductos();
        const limit = req.query.limit ? Number(req.query.limit) : undefined;

        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const products = await productManager.obtenerProductos();
        const productId = Number(req.params.pid);
        const product = products.find((product) => product.id === productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manejador de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal' });
});

app.listen(PORT, () => {
    console.log(`Servidor express escuchando en http://localhost:${PORT}`);
});

// Para probar el servidor puedes utilizar el siguiente comando en la terminal:

// curl http://localhost:8080/products


// Para probar el servidor con pid puedes utilizar el siguiente comando en la terminal:

// curl http://localhost:8080/products/1

// Para probar el servidor con limit puedes utilizar el siguiente comando en la terminal:

// curl http://localhost:8080/products?limit=2





