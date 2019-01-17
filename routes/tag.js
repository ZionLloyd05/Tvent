const express = require('express')
const router = express.Router()
const tagController = require('../controllers/tag.ctrl')
const csrf = require('csurf');

const csrfProtection = csrf();
router.use(csrfProtection);

router
.post('/save', async (req, res) => {
    try{
        console.log(req.body)
        let response = await tagController.addTag(req)
        res.status(200).send(response)
    } catch (err){
        res.json({status: err})
    }
})

module.exports = router