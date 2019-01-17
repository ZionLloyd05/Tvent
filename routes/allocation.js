const express = require('express')
const router = express.Router()
const allocationController = require('../controllers/allocation.ctrl')

router
.post('/save', async (req, res) => {
    try{
        let response = await allocationController.addAllocation(req)
        res.status(200).send(response)
    } catch (err){
        res.json({status: err})
    }
})

module.exports = router