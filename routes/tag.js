const express = require('express')
const router = express.Router()
const tagController = require('../controllers/tag.ctrl')
const csrf = require('csurf');

const csrfProtection = csrf();
router.use(csrfProtection);

router
.post('/', async (req, res) => {
    try{
        console.log(req.body)
        let response = await tagController.addTag(req)
        res.status(200).send(response)
    } catch (err){
        res.json({status: err})
    }
})

.get('/:evid', async (req, res) => {
    try {
        let eventId = req.params.evid
        let tags = await tagController.getTagsByEventId(eventId)
        res.status(200).send(tags)
    } catch (err) {
        res.json({status: err})
    }
})

module.exports = router