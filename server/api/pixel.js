var express = require('express');
var router = express.Router();
var io = require('../app');

router.get(
  '/',
  function handleRequest(req, res, next) {
    var metadata ={
      email: req.query.email,
      text: req.query.text
    }
    req._pxl.createPxl(metadata)
      .then((createdPxl) => {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ pxl: createdPxl.pxl }, null, 3));
      })
      .catch((err) => {
      })

  },
);
router.get(
  '/show/',
  function handleRequest(req, res, next) {
    var metadata ={
    }
    var collection = req._pxl.persistenceLayer.db.collection('pxls');
    if (req.query.email){
      metadata.email=req.query.email
    }
    if (req.query.text){
      metadata.text=req.query.text
    }
    collection.find(metadata).toArray(function(err, docs) {
      res.send(JSON.stringify({ pxl: docs }, null, 3));
    });

  },
);
module.exports = router;
