const express = require('express');
const router = express.Router();
const middleware = require('../config/midleware.js')
const path = require('path');
const fs = require('fs');
const multer = require('multer')
const axios = require('axios');


router.get('/', async (req, res) => {
    res.render('index')
})

router.get('/product_liquid', (req, res) => {
    res.render('product_liquid')
})

router.get('/product_glass', (req, res) => {
    res.render('product_glass')
})

router.get('/product_powder', (req, res) => {
    res.render('product_powder')
})

router.get('/about', (req, res) => {
    res.render('about',)
})

router.get('/contact', (req, res) => {
    res.render('contact')
})

router.get('/industries', (req, res) => {
    res.render('industries')
})

router.get('/item-industries', (req, res) => {

    res.render('item-industries')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/dashboard', middleware, (req, res) => {
    res.render('dashboard')
})

module.exports = router