const express = require('express')
const router = express.Router()
const allocationController = require('../controllers/allocation.ctrl')

router
.post('/save', (req, res) => {
    allocationController.addAllocation(req)
    .then(data => res.send(data))
})

module.exports = router