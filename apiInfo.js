module.exports = {}

// Require mandrill module so the Mandrill JavaScript API is available in our file
var mandrill = require('mandrill-api/mandrill.js');

// Instantiate the Mandrill API and make its functions available to us, through the mandrill_client variable
var mandrillClient = new mandrill.Mandrill('aaw5lnuyBBUpyYn9WUII1Q');

// Export the secret variables we'll need access to
module.exports.mandrillClient = mandrillClient;
module.exports.maps = "AIzaSyDG1T1ZvOqHtAqgmkjjjHtXZz5HvwrW_w0";
