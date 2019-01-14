const Allocation = require('../models/allocation')

module.exports = {
    addAllocation: (req) => {
        return new Promise((resolve, reject) => {
            let allocations = { ...req.body }
            let allocationArray =  []
            let eventId = ''
            Object.keys(allocations).map(key => {
                allocationArr = []
                if(key == 0){
                    eventId = allocations[key]
                    allocationArray.push(eventId)
                }else{
                    allocation = allocations[key]
                    Object.keys(allocation).map(idx => {
                        allocationArr.push(allocation[idx])
                    })
                    allocationArray.push(allocationArr)
                }
            })
            try {
                for (let idx = 0; idx < allocationArray.length; idx++) {
                    if(idx != 0){
                        let arr = allocationArray[idx]
                        let obj = {
                            event: eventId,
                            day: arr[0].slice(4,),
                            division: arr[1],
                            capacity: arr[2],
                            extra: arr[3]
                        }
                        new Allocation(obj).save();
                    }
                }
                resolve({status: "Done"})
            } catch(error){
                reject(error)
            }
            
        })
    }
}