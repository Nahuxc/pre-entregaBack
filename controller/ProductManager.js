const fs = require("fs")
const path = require("path")
const filepath = path.resolve(__dirname, "../database/products.json")

class ProductManager{
    constructor(path){
        this.path = path
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
        return  JSON.parse(contenido);
    }
    async writeProducts(productos) {
        await this.validateExistFile();
        const data = JSON.stringify(productos, null, 4)
        await fs.promises.writeFile(this.path, data)
    }
    async exists(id) {
        const data = await this.getProducts()
        const indice = data.findIndex(product => product.id == id)
        return indice >= 0;
    }
    async getProducts(){
        try {
            const data = this.readFileFn()
            return data

        } catch (error) {
            console.log(error);
        }
    }
    async save(element) {

        const data = await this.readFileFn();
        let id = 1;

        if (data.length) {
            //Si tengo elementos en mi array
            id = data[data.length - 1].id + 1;
        }


        const nuevoProducto = {
            id: id,
            title: element.title,
            description: element.description,
            img: element.img,
            price: parseInt(element.price),
            stock: parseInt(element.stock)
        };

        data.push(nuevoProducto);

        await this.writeProducts(data)
        console.log(`Nuevo producto guardado, N° ID: ${nuevoProducto.id}`);

        return nuevoProducto.id;
    }
    async updateProduct(id, updateProduct) {
        const exist = await this.exists(id);
        if (!exist) throw new Error(`No existe item con ID ${id}`)

        const productos = await this.getProducts()
        const productoId = productos.findIndex(producto => producto.id == id)

        const productoViejo = productos[productoId]

        const productoModificado = {
            id: productoViejo.id,
            title: updateProduct.title,
            price: parseInt(updateProduct.price),
            description: updateProduct.description,
            img: updateProduct.img,
            stock: parseInt(updateProduct.stock)
        }

        productos.splice(productoId, 1, productoModificado)

        await this.writeProducts(productos)
        return productoModificado

    }
    async deleteById(id) {
        const data = await this.readFileFn()

        const productoId = data.findIndex((producto) => producto.id === id);

        if (productoId < 0) {
            throw new Error('El producto no existe');
        }

        data.splice(productoId, 1);

        await this.writeProducts(data)

    }
}


const content = new ProductManager(filepath)


module.exports = {
    ProductManager: content
}