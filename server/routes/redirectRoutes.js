const express = require('express');
const { redirectToOriginal } = require('../controllers/linkController');

const router = express.Router();

router.get('/:shortCode', redirectToOriginal);

module.exports = router;