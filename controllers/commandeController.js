var express = require('express');
var router = express.Router();
var validation= require('../middleware/commandeValidation')
var { findAll, createCommande, displayUpdateForm, updateCommande, deleteCommande, displayAddForm, displayLivraison, findAllByAdresse } = require('../services/commandeService')

router.get('/', findAll);
router.get('/tunis', findAllByAdresse);
router.get('/livraison', displayLivraison);
router.get('/create', displayAddForm);
router.post('/create', validation, createCommande);
router.get('/update/:id', displayUpdateForm);
router.post('/update/:id', validation, updateCommande);
router.get('/delete/:id', deleteCommande);

module.exports = router;
