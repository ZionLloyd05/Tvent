const express = require('express')
const router = express.Router()
const tagController = require('../controllers/tag.ctrl')

router
.post('/save', (req, res) => {
    tagController.addTag(req)
    .then(data => {
        res.json(data)
    })
})

module.exports = router