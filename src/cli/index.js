var https = require("https");
var url = require("url");
const axios = require('axios');

var { parseArgv } = require('./parsearg.js');
var powerquery = require("./powerquery.js");

// This here, will go ahead and get the Bearer token from the ID and Secret.
// With this Bearer token further API calls can be made.
async function run(rawArgs) {
  console.log("Welcome to JS-Power");

  var argOptions = parseArgv(rawArgs);

  console.log(argOptions);

  var id = argOptions.id;
  var secret = argOptions.secret;
  var serverURL = argOptions.url;
  var schoolArray = argOptions.schoolArray;
  var namedSchoolArray = argOptions.namedSchoolArray;

  // the credentials method is depreciated, meanwhile the Buffer.from is not
  var credentials = (new Buffer(id + ":" + secret)).toString('base64');
  //var credentials = Buffer.from(id + ":" + secret).toString('base64');

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  let axiosConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorization': `Basic ${credentials}`
    }
  };

  // creating the xx-form-urlencoded data since axios uses JSON encoding by default.
  axios
    .post(`${serverURL}/oauth/access_token`, urlencoded, axiosConfig)
    .then((res) => {
      console.log(`statusCode: ${res.status}`);

      if (res !== '') {
        try {
          // Since we are using axios the data returned is also the correct type, so
          // no parsing to JSON is needed.
          console.log(res.data);

          powerquery.run(res.data.access_token, serverURL, schoolArray, namedSchoolArray);

        } catch(err) {
          try {
            console.error(res);
            process.exit(1);
          } catch(err) {
            console.error(err);
            process.exit(1);
          }
        }
      } else {
        console.error(res);
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

}

module.exports = {
  run,
}
