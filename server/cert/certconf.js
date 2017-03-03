/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

var fs = require('fs');
var path = require('path');
var config  = require('../config/environment');
var cert = {
  // the private key

  key: fs.readFileSync(path.join(config.root, 'server', 'cert', '/server.key')),
  // the public cert
  cert: fs.readFileSync(path.join(config.root, 'server', 'cert', '/server.crt'))
};

module.exports = cert;
