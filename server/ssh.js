const ssh2 = require('ssh2');
const utils = require('ssh2-utils');

var pubKey = utils.genPublicKey(utils.parseKey(fs.readFileSync('ssh.pub')));

new ssh2.Server({
    hostKeys: [fs.readFileSync('ssh.key')]
  }, function(client) {
    console.log('Client connected!');
    
