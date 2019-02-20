const express = require('express')
const router = express.Router()
const tagController = require('../controllers/tag.ctrl')
const csrf = require('csurf');

const csrfProtection = csrf();
router.use(csrfProtection);

router
    .post('/', async (req, res) => {
        try {
            // console.log(req.body)
            let response = await tagController.addTag(req)
            res.status(200).send(response)
        } catch (err) {
            res.json({
                status: err
            })
        }
    })

    .post('/single', async (req, res) => {
        try {
            let tag = await tagController.addSingleTag(req)
            res.send(tag)
        } catch (error) {
            releaseEvents.json({
                status: error
            })
        }
    })

    .get('/', async (req, res) => {
        try {
            let tags = await tagController.getTags()
            res.status(200).send(tags)
        } catch (err) {
            res.json({
                status: err
            })
        }
    })

    .get('/:evid', async (req, res) => {
        try {
            let eventId = req.params.evid
            let tags = await tagController.getTagsByEventId(eventId)
            res.status(200).send(tags)
        } catch (err) {
            res.json({
                status: err
            })
        }
    })

    .delete('/:tagid', async (req, res) => {
        try {
            let tagid = req.params.tagid
            let response = await tagController.deleteTag(tagid)
            res.send({
                status: response
            })
        } catch (error) {
            res.json({
                status: error
            })
        }
    })

module.exports = router