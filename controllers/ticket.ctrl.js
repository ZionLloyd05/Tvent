const Ticket = require('../models/ticket')
const allocationCTRL = require('../controllers/allocation.ctrl')

const uuidv4 = require('uuid/v4')

module.exports = {
    addTicket: (req) => {
        return new Promise((resolve, reject) => {
            try {
                let { category } = req.body
                let user_id = req.session._id
                
                if(category == 'convocation'){
                    let { event, faculty, extra } = req.body
                
                    //Checking if user already registered for events
                    Ticket.findOne({user: user_id, event: event}, async (err, ticket)=> {
                        if(err)
                            return reject(err)
                        if(ticket)
                            return resolve({status: "Oops, You've Registered for this event!"})
                        else{

                            let ticket = {
                                user: user_id,
                                event: event,
                                tref: uuidv4()
                            }
                            let u_number = 0
                            let allocations = await allocationCTRL.getAllocationByEventId(event)
            
                            allocations.forEach(allocation => {
                                if(allocation.division == faculty){
                                    allocation.fill = allocation.fill + 1
                                    u_number = allocation.fill
                                    allocation.save()
                                }
                            })
                            ticket.user_no = u_number
                            ticket.extra = extra
                            new Ticket(ticket).save()
                            resolve({status: "Ticket Saved"})
                        }
                    })
                }else{
                    let { event } = req.body

                    //Checking if user already registered for events
                    Ticket.findOne({user: user_id, event: event}, async (err, ticket)=> {
                        if(err)
                            return reject(err)
                        if(ticket)
                            return resolve({status: "Oops, You've Registered for this event!"})
                        else{

                            let ticket = {
                                user: user_id,
                                event: event,
                                tref: uuidv4()
                            }

                            let u_number = 0
                            let allocations = await allocationCTRL.getAllocationByEventId(event)

                            allocations.forEach(allocation => {
                                allocation.fill = allocation.fill + 1
                                if(u_number != allocation.fill)
                                    u_number = allocation.fill
                                allocation.save()
                            })
                            ticket.user_no = u_number
                            ticket.extra = ''
                            console.log(ticket)
                            new Ticket(ticket).save()
                            resolve({status: "Ticket Saved"})
                        }
                    })
                }

            } catch (error) {
                reject(error)
            }
            
        })
    }
}


// allocations.forEach(allocation => {
//     allocation.fill = allocation.fill + 1
//     if(user_no != allocation.fill)
//         user_no = allocation.fill
//     allocationCTRL.updateAllocation(allocation)
// })

// ticket.user_no = user_no
// new Ticket(ticket).save()
// console.log(ticket)
// resolve({status: "Ticket Saved"})