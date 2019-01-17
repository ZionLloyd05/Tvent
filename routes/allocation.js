const express = require('express')
const router = express.Router()
const allocationController = require('../controllers/allocation.ctrl')

const csrf = require('csurf');

const csrfProtection = csrf();
router.use(csrfProtection);

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