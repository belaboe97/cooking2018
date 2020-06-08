const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
const Gericht = require('../models/gerichte');
const multer = require('multer')


//Multer wird genutzt zum Speichern von Bildern
const storage =  multer.diskStorage({
  destination: function(req, file , cb){
    cb(null, './uploads/')
  },
  filename: function(req,file,cb){
  cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({storage: storage})

//Zeigt Essen und Gerichte auf der Startseite an 
router.get("/", (req, res, next) => {
  var User = req.user
  if (req.query.search) {
    Gericht.find() // sucht Datenbank nach Gerichten
      .exec()
      .then(docs => {
        res.render('index', { 
          gericht: docs,
          User: User,
          search: true,
          suche: req.query.search
        })
      })
      .catch(err => {  // Error Catch
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  } else {
    Gericht.find()
      .exec()
      .then(docs => {
        res.render('index', {
          gericht: docs,
          User: User,
          search: false
        })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
});

// Speichert neue Gerichte in der Datenbank 
// mit Multer zum Speichern der Bildreferenzen
 router.post("/",upload.single('gerichtImage'), (req, res, next) => { 
  
    const gericht = new Gericht({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      author : req.body.author,
      anleitung : req.body.anleitung,
      personen : req.body.personen,
      zutat : req.body.zutat, 
      menge : req.body.menge,
      mengeneinheit : req.body.mengeneinheit,
      text : req.body.text,
      gerichtImage: req.file.path,
      rating : req.body.rating,
    });
    console.log(req.body)
    gericht
      .save()
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


// Rezept Seite wird geladen und ausgewähltes Rezept wird angezeigt
  router.get('/gerichte/:gerichteId', (req,res, next)=>{
    var User = req.user;
    console.log(User)
     const id = req.params.gerichteId;
      Gericht.findById(id)
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).render('rezept', {gericht: doc,
                                            User: User});
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });

// Bewertet Gericht --> Fehler da keine Userkey mitgegeben wird und somit immer die zuletzt abgebene Bewertung angezeigt wird
router.put('/patch', (req,res, next)=>{

        Gericht.findOneAndUpdate({_id: req.body.id},({rating: req.body.rating}),{upsert: true, 'new': true}, (err, result) => {
        if (err) return res.send(500, err);
        console.log(req.body.rating, req.body.id)
      })  
      console.log('update save serverside'), console.log(req.body.rating,)
  })

//handling von Sonderzeichen 
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router; 