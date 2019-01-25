const express = require('express')
const router = express.Router()
const ticketController = require('../controllers/ticket.ctrl')
const csrf = require('csurf');

const csrfProtection = csrf();
router.use(csrfProtection);

router
.post('/', async (req, res) => {
    try {
        //console.log(req.body)
        let ticket = await ticketController.addTicket(req)
        res.status(200).send(ticket)
    } catch (err) {
        res.json({status: err})
    }
})

.get('/:evtitle/:evref', (req, res) => {
    let {evtitle, evref} = req.params
    res.render('public/ticket', {evtitle, evref})
})

module.exports = router