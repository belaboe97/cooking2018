const express = require('express');
const router = express.Router();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport')



//Register Page
router.get('/register', (req,res)=>res.send('Register'));

//Register Handle
router.post('/register',(req, res)=>{
    
    const{ name, email, password, passwordWdhl} = req.body
    let errors =[];

    //Überprüft alle geforderten Felder
    if( !name || !email|| !password || !passwordWdhl){
        errors.push({ msg: 'Bitte füllen Sie alle Felder entsprechend aus'})
        console.log(3)
    }

    //Überprüft das Passwort nach Kriterien Länge und ob es mit der Passwort Wdhl übereinstimmt
    if(password !== passwordWdhl){
        errors.push({msg: 'Passwörter stimmen nicht überein'})
        console.log(1)
    }
    if(password.length < 6){
        errors.push({msg: 'Passwort muss mindestens 6 Zeichen haben'})
        console.log(2)
    }
    if(errors.length > 0){
        console.log(errors)
        res.render('account',{
            errors,
            name,
            email,
            password,
            passwordWdhl,
        })
    }else{
        User.findOne({ email: email }).then(user => {
            if (user) {
              errors.push({ msg: 'Diese Email ist bereits registriert' });
              res.render('account', {
                errors,
                name,
                email,
                password,
                passwordWdhl
              });
                }else{
                    const newUser = new User({
                    name, 
                    email,
                    password
                    });
                    // Verschlüsseltes das Passwort in der Datenbank
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                          if (err) throw err;
                          newUser.password = hash;
                          newUser
                    newUser
                    .save()
                    .then(user => {
                      req.flash(
                        'success_msg',
                        'Du bist erfolgreich registriert und kannst jetzt alle Funktionen voll nutzen'
                      );
                      res.redirect('/gerichte');
                    })
                    .catch(err => console.log(err));
                });
              });
            }
          });
        }
      });

// Login
router.post('/login', (req, res, next) => {
    console.log(passport);
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/account',
      failureFlash: true, 
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Du wurdest ausgeloggt');
    res.redirect('/');
  });


  //Zeigt alle registrierten Mitglieder der Seite an // Kann für Admin angeboten werden.
  router.get('/show', (req,res) => {
    console.log('hi"')
      User.find()
        .exec()
        .then(docs => {
          console.log('hey')
          console.log(docs);
          res.render('User', {      User : docs, })
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
    });


    //Löscht User aus der Datenbank
    router.delete("/delete", (req, res) => {
      console.log('hi');
      console.log(req.body);
      User.findOneAndDelete({_id: req.body.id},
        (err, result) => {
          if (err) return res.send(500, err)
          res.send({message: 'Der User wurde  gelöscht'})
        })
    })
module.exports = router;