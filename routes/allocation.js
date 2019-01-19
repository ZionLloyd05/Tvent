const express = require('express')
const router = express.Router()
const allocationController = require('../controllers/allocation.ctrl')

const csrf = require('csurf');

const csrfProtection = csrf();
router.use(csrfProtection);

router
.post('/', async (req, res) => {
    try{
        let response = await allocationController.addAllocation(req)
        res.status(200).send(response)
    } catch (err){
        res.json({status: err})
    }
})

.get('/:evid', async (req, res) => {
    try {
        let eventId = req.params.evid
        let allocations = await allocationController.getAllocationByEventId(eventId)
        res.status(200).send(allocations)
    } catch (err) {
        res.json({status: err})
    }
})

module.exports = router