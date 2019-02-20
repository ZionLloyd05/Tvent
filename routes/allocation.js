const express = require('express')
const router = express.Router()
const allocationController = require('../controllers/allocation.ctrl')

const csrf = require('csurf');

const csrfProtection = csrf();
router.use(csrfProtection);

router
    .post('/', async (req, res) => {
        try {
            let response = await allocationController.addAllocation(req)
            res.status(200).send(response)
        } catch (err) {
            res.json({
                status: err
            })
        }
    })

    .get('/:evid', async (req, res) => {
        try {
            let eventId = req.params.evid
            let allocations = await allocationController.getAllocationByEventId(eventId)
            res.status(200).send(allocations)
        } catch (err) {
            res.json({
                status: err
            })
        }
    })

    .post('/update', async (req, res) => {
        try {
            let response = await allocationController.updateAllocation(req.body)
            res.status(200).send({
                status: response
            })
        } catch (error) {
            res.json({
                status: error
            })
        }
    })

    .delete('/:allid', async (req, res) => {
        try {
            let allocationId = req.params.allid
            let response = await allocationController.deleteAllocation(allocationId)
            res.status(200).send({
                status: response
            })
        } catch (error) {
            res.json({
                status: error
            })
        }
    })

module.exports = router