/**
 * Express configuration
 */

'use strict';

import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import shrinkRay from 'shrink-ray';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
import config from './environment';

import passport from 'passport';
import AzureStrategy from 'passport-azure-ad-oauth2';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import dbHelper from '../db/dbHelper';

export default function(app) {
  var env = app.get('env');

  new dbHelper().createDatabase();

  var ONE_DAY_MILLIS = 86400000;
  var azureConfig = require('./ws-conf').azureConf;
  function verifyAzure(req, accessToken, refreshToken, params, profile, done) {
    // Azure returns an id token with basic information about the user
    var azureProfile = jwt.decode(params.id_token);
    var state = req.query.state;
    var parts = state.split('|');
    var sessionID = parts[0];
    var csrfToken = parts[1];

    // Create a new user object that will be available to
    // the /connect/:providerName/callback route
    var user = {};
    user.sessionID = sessionID;
    user.csrfToken = csrfToken;
    user.providerName = 'azure';
    user.displayName = azureProfile.name;
    user.accessToken = accessToken;
    done(null, user);
  }
  passport.use('azure', new AzureStrategy(azureConfig, verifyAzure));


  if(env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));

  }

  if(env === 'production') {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
  }
  app.set('appPath', path.join(config.root, 'client'));

  app.use(express.static(path.join(config.root, 'server','views')));
  app.use(express.static(app.get('appPath')));


  app.use(morgan('dev'));

  app.set('views', `${config.root}/server/views`);
  app.set('view engine', 'pug');
  app.use(shrinkRay());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    name: 'nodecookie',
    cookie: {
      path: '/',
      httpOnly: false,
      secure: false,
      maxAge: 7 * ONE_DAY_MILLIS
    },
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());


  if(env === 'development') {
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const stripAnsi = require('strip-ansi');
    const webpack = require('webpack');
    const makeWebpackConfig = require('../../webpack.make');
    const webpackConfig = makeWebpackConfig({ DEV: true });
    const compiler = webpack(webpackConfig);
    const browserSync = require('browser-sync').create();

    /**
     * Run Browsersync and use middleware for Hot Module Replacement
     */
    browserSync.init({
      open: false,
      logFileChanges: false,
      proxy: `https://localhost:${config.port}`,
      ws: true,
      https: true,
      middleware: [
        webpackDevMiddleware(compiler, {
          noInfo: false,
          stats: {
            colors: true,
            timings: true,
            chunks: false
          }
        })
      ],
      port: config.browserSyncPort,
      plugins: ['bs-fullscreen-message']
    });

    /**
     * Reload all devices when bundle is complete
     * or send a fullscreen error message to the browser instead
     */
    compiler.plugin('done', function(stats) {
      console.log('webpack done hook');
      if(stats.hasErrors() || stats.hasWarnings()) {
        return browserSync.sockets.emit('fullscreen:message', {
          title: 'Webpack Error:',
          body: stripAnsi(stats.toString()),
          timeout: 100000
        });
      }
      browserSync.reload();
    });
  }

  if(env === 'development' || env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }
}
