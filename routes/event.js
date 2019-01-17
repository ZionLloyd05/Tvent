const express = require('express')
const router = express.Router()
const eventController = require('../controllers/event.ctrl')
const multer = require('multer')
const path = require('path')
const csrf = require('csurf');

const csrfProtection = csrf();
router.use(csrfProtection);

//=====================================================
//  Multer Storage Engine Configuration for user image
//=====================================================
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
      cb(null, './public/uploads/')
    },
    filename: (req, file, cb)=> {
      cb(null, file.fieldname + "_" + Date.now()+path.extname(file.originalname))
    }
  })

//Init multer varaible
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000}
}).single('poster')


router
.post('/create', (req, res) => {
    upload (req,res, async (err) => {
        if(err)
            return res.status(402).send(err)
        else{
            try{
                let event = await eventController.addEvent(req)
                res.status(200).send(event)
            } catch (err){
                res.json({error: err})
            }
            // eventController.addEvent(req)
            // .then(event => {
            //     res.status(200).json(event)
            // })
            // .catch(error => {
            //     res.json({error: error})
            // })
        }
    })
})

module.exports = router