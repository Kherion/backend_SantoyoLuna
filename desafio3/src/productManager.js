import fs from "fs";
class ProductManager {

    #filePath;
    #lastId;

    constructor(filePath = "./products.json") {
        this.#filePath = filePath;
        this.#setLastId();
        this.products = [];
    }

    async agregarProductos(title, description, price, thumbnail, code, stock) {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error("Faltan datos");
            }

            const products = await this.obtenerProductos();

            if (products.find((product) => product.title === title)) {
                throw new Error("El producto ya existe");
            }

            const newProduct = {
                id: ++this.#lastId,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            };

            products.push(newProduct);

            await this.#saveProducts(products);

        } catch (error) {
            throw new Error(error.message);
        }
    }

    async obtenerProductos() {
        try {
            const productsData = await fs.promises.readFile(this.#filePath, "utf-8");
            const products = JSON.parse(productsData);
            
            if (!Array.isArray(products)) {
                return [];
            }
            
            return products;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const products = await this.obtenerProductos();
            const product = products.find((product) => product.id === id);
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async borrarProductoPorId(id) {
        try {
            let products = await this.obtenerProductos();
            products = products.filter((product) => product.id !== id);
            await this.#saveProducts(products);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async actualizarProducto(id, campoAModificar, nuevoValor) {
        try {
            let products = await this.obtenerProductos();
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                throw new Error(`Estudiante con id: ${id} no encontrado`);
            } else {
                products[productIndex][campoAModificar] = nuevoValor;
                await this.#saveProducts(products);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

async #setLastId() {
    try {
        const products = await this.obtenerProductos();
        if (products.length < 1) {
            this.#lastId = 0;
            return;
        }
        const lastProduct = products[products.length - 1];
        this.#lastId = lastProduct ? lastProduct.id : 0;
    } catch (error) {
        throw new Error(error.message);
    }
}


    async #saveProducts(products) {
        try {
            await fs.promises.writeFile(this.#filePath, JSON.stringify(products));
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const productManager = new ProductManager();

(async () => {
    console.log(await productManager.obtenerProductos());

    try {
        await productManager.agregarProductos("productoPrueba", "productoPruebad", 200, "IproductoPrueba", "productoPrueba", 25);
        console.log(await productManager.obtenerProductos());
        await productManager.obtenerProductoPorId(1);
        console.log(await productManager.obtenerProductoPorId(2));
        await productManager.actualizarProducto(1, "title", "Nuevo producto");
        console.log(await productManager.obtenerProductos());
        await productManager.borrarProductoPorId(1);
        console.log(await productManager.obtenerProductos());
    } catch (error) {
        console.error(error.message);
    }
})();


export default ProductManager;