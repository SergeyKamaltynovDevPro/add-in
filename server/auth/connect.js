var express = require('express');
var router = express.Router();
var passport = require('passport');
var io = require('../app');
var cookie = require('cookie');
var csrf = require('csurf');
var cookieParser = require('cookie-parser');
var dbHelper = new(require('../db/dbHelper'))();
var authenticationOptions = {};

authenticationOptions.azure = { session: false };
router.use(csrf());

router.get(
  '/azure/:sessionID',
  function handleRequest(req, res, next) {
    // Include the sessionID and csrftToken value in the OAuth state parameter
    authenticationOptions.azure.state = req.params.sessionID + '|' + req.csrfToken();
    res.cookie('CSRF-TOKEN', req.csrfToken());
    next();
  },
  passport.authenticate('azure', authenticationOptions.azure)
);

router.get('/:providerName/callback', function handleRequest(req, res) {
  // At the end of the OAuth flow we need to verify that csrfToken in the cookies
  // matches the one returned by the OAuth flow
  if (req.cookies['CSRF-TOKEN'] !== req.user.csrfToken) {
    res.render('error', {
      error: {
        status: 403
      },
      message: 'Bad or missing CSRF value'
    });
    return;
  }
  dbHelper.deleteAccessToken(
    req.user.sessionID,
    'azure',
    function callback(error) {
      if (error) {
        throw error;
      } else {
        dbHelper.saveAccessToken(
          req.user.sessionID,
          req.params.providerName,
          req.user.displayName,
          req.user.accessToken,
          function callback(error) {
            if (error) {
              throw error;
            } else {
              // Intentionally strip the access token off the user object before
              // sending it to the client.
              // Client doesn't need it unless you want to make API calls client-side
              res.io.emit('auth_success', req.user);
              res.render('auth_complete');
            }
          }
        );
      }
    }
  );

});

module.exports = router;
