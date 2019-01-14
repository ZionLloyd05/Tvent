const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.ctrl');
const multer = require('multer');

//=====================================================
//  Multer Storage Engine Configuration for user image
//=====================================================
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
      cb(null, './public/uploads/')
    },
    filename: (req, file, cb)=> {
      cb(null, file.fieldname + "-" + Date.now());
    }
  })

//Init multer varaible
const upload = multer({
    storage: storage,
    limits:{fileSize: 100000}
}).single('poster')


router
.post('/create',(req, res) => {
    upload(req,res, (err) => {
        if(err)
            return res.status(402).send(err)
        else{
            eventController.addEvent(req)
            .then(event => {
                res.status(200).json(event);
            })
            .catch(error => {
                res.send(error)
            })
        }
    })
})

module.exports = router;