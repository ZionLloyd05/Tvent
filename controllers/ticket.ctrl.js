const Ticket = require('../models/ticket')
const allocationCTRL = require('../controllers/allocation.ctrl')

const uuidv4 = require('uuid/v4')

module.exports = {
    addTicket: (req) => {
        return new Promise(async (resolve, reject) => {
            let eventId = req.body.event
            let ticket = new Ticket({
                user: req.session._id,
                event: req.body.eventId,
                tref: uuidv4()
            })
            let user_no = 0
            let allocations = await allocationCTRL.getAllocationByEventId(eventId)
            allocations.forEach(allocation => {
                allocation.fill = allocation.fill + 1
                if(user_no != allocation.fill)
                    user_no = allocation.fill
                allocationCTRL.updateAllocation(allocation)
            });

            ticket.user_no = user_no
            Ticket.save(ticket)
            resolve(ticket)
        })
    }
}