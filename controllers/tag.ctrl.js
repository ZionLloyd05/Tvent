const Tag = require('../models/tag')

module.exports = {
    addTag: (req) => {
        return new Promise((resolve, reject) => {
            let tags = { ...req.body }
            let tagArray =  []

            Object.keys(tags).map(key => {
                tagArray.push(tags[key])
            })

            let eventId = tagArray[0]
            
            try {
                for (let idx = 0; idx < tagArray.length; idx++) {
                    if(idx != 0){
                        let obj = Tag({
                            event: eventId,
                            title: tagArray[idx]
                        })
                        new Tag(obj).save();
                    }
                }
                resolve({status: "Tags Saved"})
            } catch(error){
                reject(error)
            }
            
        })
    },

    getTags: () => {
        return new Promise(async(resolve, reject) => {
            try {
                const tags = await Tag.find()
                resolve(tags)
            } catch (error) {
                reject(error)
            }
        })
    },

    getTagsByEventId: (eventId) => {
        return new Promise(async(resolve, reject) => {
            try {
                const tags = await Tag.find({event: eventId})
                resolve(tags)
            } catch (error) {
                reject(error)
            }
        })
    }
}