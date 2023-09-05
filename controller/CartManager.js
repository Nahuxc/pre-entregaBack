const fs = require('fs');
const path = require('path')
const filepath = path.resolve(__dirname, "../database/cart.json")

class Contenedor {
    constructor(path) {
        this.path = path;
    }

    async validateExistFile() {
        try {
            await fs.promises.stat(`${this.path}`)
        } catch (err) {
            await fs.promises.writeFile(`${this.path}`, JSON.stringify([]));
        }
    }

    async readFileFn() {
        await this.validateExistFile();
        const contenido = await fs.promises.readFile(`${this.path}`, 'utf-8');
        return JSON.parse(contenido);
    }

    async writeProducts(productos) {
        await this.validateExistFile();
        const data = JSON.stringify(productos, null, 4)
        await fs.promises.writeFile(this.path, data)
    }

    async exists(id) {
        const data = await this.getAllProdInCart()
        const indice = data.findIndex(product => product.id == id)
        return indice >= 0;
    }


    async getAllProdInCart() {
        try {
            const data = await this.readFileFn();
            return data

        } catch {
            console.log('Error al obtener todos los datos del carrito');
        }
    }
    async addProdInCart(cartId, prodId) {
        try {
            const carts = await this.getAllProdInCart();
            const index = carts.findIndex((cart) => cart.id === cartId);
            carts[index].products.push(prodId);
            await this.writeProducts(carts);

            return 'Producto agregado!';
        } catch (err) {
            throw new Error("No se pudo agregar el producto al carrito", err)
        }
    }
    async getCartById(id) {
        try {
            const data = await this.readFileFn()
            const idProducto = data.find((producto) => producto.id === id);

            if (!idProducto) throw new Error("El carrito buscado no existe!");

            return idProducto;

        } catch (err) {
            throw new Error("El carrito no existe", err)
        }
    }
    async saveCart(element) {
        try {
            const data = await this.getAllProdInCart();
            let id = 1;

            if (data.length) {
                //Si tengo elementos en mi array
                id = data[data.length - 1].id + 1;
            }

            const cart = {
                id: id,
                products: [element]
            };

            data.push(cart);

            await this.writeProducts(data)
            console.log(`Nuevo carrito guardado, N° ID: ${cart.id}`);

            return cart.id;

        } catch (err) {
            throw new Error("No se pudo guardar el carrito", err)
        }

    }

    

}

const instanciaCartApi = new Contenedor(filepath)

module.exports = {
    CartManager: instanciaCartApi
}