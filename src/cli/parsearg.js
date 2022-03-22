const fs = require('fs');

function parseArgv(rawArg) {
  if (rawArg.length < 1) {
    // no arguments passed. Look for config file.
    const data = fs.readFileSync('./config.json', {encoding: 'utf8'});

    try {
      var returnObj = JSON.parse(data);

      return returnObj;
    } catch(err) {
      console.log('Error Reading Config Data...');
      console.log(err);
      process.exit(1);
    }
  } else {
    // args passed, use those instead.
    console.log(rawArg);

    var returnObj = {
      id: "",
      secret: "",
      url: "",
      schoolArray: [],
      namedSchoolArray: []
    };

    for (var i = 0; i < rawArg.length; i++) {
      if (rawArg[i].startsWith('--id')) {
        returnObj.id = rawArg[i].replace('--id=', '');
      } else if (rawArg[i].startsWith('--secret')) {
        returnObj.secret = rawArg[i].replace('--secret=', '');
      } else if (rawArg[i].startsWith('--url')) {
        returnObj.url = rawArg[i].replace('--url=', '');
      } else if (rawArg[i].startsWith('--schools')) {
        var p = rawArg[i].replace('--schools=', '');
        returnObj.schoolArray = fmtArray(p);
      } else if (rawArg[i].startsWith('--namedschools')) {
        var p = rawArg[i].replace('--namedschools=', '');
        returnObj.namedSchoolArray = fmtArray(p);
      }
    }

    return returnObj;
  }
}

function fmtArray(cmdLA) {
  cmdLA.split('-');
  arrayObj = Object.assign([], cmdLA);

  for (var i = 0; i < arrayObj.length; i++) {
    if (arrayObj[i] == '-') {
      arrayObj.splice(i, 1);
    }
  }

  for (var i = 0; i < arrayObj.length; i++) {
    arrayObj[i] = parseInt(arrayObj[i]);
  }

  return arrayObj;
}

module.exports = { parseArgv };
