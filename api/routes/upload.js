const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
const Gericht = require('../models/gerichte');
const multer = require('multer')


//Multer wird genutzt für das hinzufügen von Bildern
const storage =  multer.diskStorage({
  destination: function(req, file , cb){
    cb(null, './uploads/')
  },
  filename: function(req,file,cb){
  cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({storage: storage})

// Alle Gerichte werden aus der Datenbank geladen
router.get("/",(req, res, next) => {
  var User = req.user;
  console.log(req.body);
  console.log(res.body)
  Gericht.find()
    .exec()
    .then(docs => {
      console.log('Gerichte wurden gefunden')
      res.render('upload.ejs', {User: User, 
                                gericht: docs})
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Gericht wird in die Datenbank geladen nach Vorlage des Mongoose Schema

router.post("/",upload.single('gerichtImage'), (req, res, next) => {
    console.log(req.body);
    const gericht = new Gericht({
      _id: new mongoose.Types.ObjectId(), // spezifische mongoose Id wird erstellt 
      name: req.body.name,
      author : req.body.author,
      zutat : req.body.Zutat,
      menge : req.body.Menge,
      mengeneinheit : req.body.Mengeneinheit,
      text : req.body.text,
      gerichtImage: req.file.path
    });
    console.log(req.body);
    gericht
      .save() // Gericht wird gespeichert
      .then(result => {
        console.log(result);
        res.status(201).redirect('/')
        console.log('gericht wurde gespeichert')
        })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });


module.exports = router; 