const express = require("express");
const routerCart = express.Router();
const { CartManager } = require('../controller/CartManager');


routerCart.get('/:cid/products', async (req, res) => {
    try {
        const {cid} = req.params
        const response = await CartManager.getCartById(+cid)
        const data = await response
        res.json({ 'Productos del carrito': data.products });

    } catch (err) {
       res.json(err)
    }
});
routerCart.post('/', async (req, res) => {
    try {
        const dato = req.body
        let response = await CartManager.saveCart(dato)

        res.json({ msg: `Nuevo carrito guardado ID: ${response}`});

    } catch (err) {
        res.json(err)
    }
});


module.exports = {
    routerCart,
};