const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const db = mongojs('catalog', ['products']);

const app = express();
const port = 3000;

app.use(bodyParser.json());

// https://enable-cors.org/server_expressjs.html
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Home
app.get('/', (req, res, next) => {
    res.send('Please use /api/products');
});

// Fetch all products
app.get('/api/products', (req, res, next) => {
    db.products.find((err, docs) => {
        if (err) {
            res.send(err);
        }
        console.log('Products found...');
        res.json(docs);
    });
});

// Fetch single product
app.get('/api/products/:id', (req, res, next) => {
    const id = req.params.id;
    db.products.findOne({ _id: mongojs.ObjectId(id) }, (err, doc) => {
        if (err) {
            res.send(err);
        }
        console.log('Product found...');
        res.json(doc);
    });
});

// Add product
app.post('/api/products', (req, res, next) => {
    const data = req.body;
    db.products.insert(data, (err, doc) => {
        if (err) {
            res.send(err);
        }
        console.log('Adding product...');
        res.json(doc);
    });
});

// Update product
app.put('/api/products/:id', (req, res, next) => {
    const id = req.params.id;
    db.products.findAndModify({
        query: { _id: mongojs.ObjectId(id) },
        update: {
            $set: {
                name: req.body.name,
                category: req.body.category,
                description: req.body.details
            }
        },
        new: true// upsert
    }, (err, doc) => {
        if (err) {
            res.send(err);
        }
        console.log('Product updated...');
        res.json(doc);
    });
});

// Delete product
app.delete('/api/products/:id', (req, res, next) => {
    const id = req.params.id;
    db.products.remove({ _id: mongojs.ObjectId(id) }, (err, doc) => {
        if (err) {
            res.send(err);
        }
        console.log('Product removed...');
        res.json(doc);
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})