const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const csrf = require('csurf');

const eventController = require('../controllers/event.ctrl')
const allocationController = require('../controllers/allocation.ctrl')
const tagController = require('../controllers/tag.ctrl')

const csrfProtection = csrf();
router.use(csrfProtection);

//=====================================================
//  Multer Storage Engine Configuration for user image
//=====================================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

//Init multer varaible
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    }
}).single('poster')


router
    .post('/create', (req, res) => {
        upload(req, res, async (err) => {
            if (err)
                return res.status(402).send(err)
            else {
                try {
                    let event = await eventController.addEvent(req)
                    res.status(200).send(event)
                } catch (err) {
                    res.json({
                        error: err
                    })
                }
            }
        })
    })

    .post('/delete/:eventid', async (req, res) => {
        try {
            let result = await eventController.deleteEvent(req)
            res.status(200).send(result)
        } catch (err) {
            res.json({
                error: err
            })
        }
    })

    .get('/', async (req, res) => {
        try {
            let events = await eventController.getEvents()
            res.status(200).send(events)
        } catch (err) {
            res.json({
                error: err
            })
        }
    })

    .get('/u', async (req, res) => {
        try {
            let events = await eventController.getEventsForUser(req)
            res.status(200).send(events)
        } catch (err) {
            res.json({
                error: err
            })
        }
    })

    .get('/r/:ref', async (req, res) => {
        try {
            let event = await eventController.getEventByRef(req)
            res.render('public/event', {
                csrfToken: req.csrfToken(),
                event
            })
        } catch (error) {
            res.send(error)
        }
    })

    .post('/update', async (req, res) => {
        upload(req, res, async (err) => {
            if (err)
                return res.send({
                    status: err
                })
            else {
                try {
                    let response = await eventController.updateEvent(req)
                    res.send({
                        status: response
                    })
                } catch (error) {
                    res.send(error)
                }
            }
        })
    })

module.exports = router