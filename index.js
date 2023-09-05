const express = require("express")
const app = express()
const {routerCart} = require("./routes/cartRouter")
const {routerProduct} = require("./routes/productRouter")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api/carts", routerCart)
app.use("/api/products", routerProduct)


const PORT = 8080
app.listen(PORT, ()=>{
    console.log(`servidor funcionando en http://localhost:${PORT}`);
})