const { Socket } = require('dgram');

const express = require("express");
const app = require('express')();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Config 
app.set("views", "./views");
app.set("view engine", "ejs");


// Lista de productos
const productos = [
    {
        id: 1,
        title: 'Calculadora',
        price: 430,
        thumbnail: 'aaa'
    }
]; 

// Rutas

app.get('/', (req, res) => {
    res.render('pages/index', {productos: productos})
    //res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
    socket.broadcast.emit('mensaje', 'Hola mundo');
    socket.emit('products', productos);

    socket.on('new-product', function(data){
        let myID = (productos.length)+1;

        let myTitle = data.title;
        let myPrice = data.price;
        let myThumbnail = data.thumbnail;

        const producto = {
            id: myID, 
            title: myTitle, 
            price: myPrice, 
            thumbnail: myThumbnail
        }

        productos.push(producto);

        io.sockets.emit('products', productos);
    })

    /*socket.on('input-form', (product) => {  
        console.log(product);

        let myID = (productos.length)+1;

        let myTitle = product.title;
        let myPrice = product.price;
        let myThumbnail = product.thumbnail;

        const producto = {
            id: myID, 
            title: myTitle, 
            price: myPrice, 
            thumbnail: myThumbnail
        }

        productos.push(producto)

        //io.emit('input form', message);
        socket.emit('input-form', product)
    })*/
})

http.listen(3024, () => {
    console.log('Driving-driving on port 3024');
})