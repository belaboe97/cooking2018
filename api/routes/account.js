
const express = require('express');
const router = express.Router(); 
const Gericht = require('../models/gerichte');


// Rendert die Account Seite 
router.get("/",(req, res, next) => {
  console.log(req.user)
  User = req.user
  Gericht.find()
    .exec()
    .then(docs => {
      console.log(User)
      res.render('account', {gericht: docs,
                             User: User})
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router; 