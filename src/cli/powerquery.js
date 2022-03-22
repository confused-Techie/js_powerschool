const axios = require('axios');
const { parse } = require('json2csv');
const fs = require('fs');

async function run(provToken, serverURL, schoolArray, namedSchoolArray) {

  if (typeof provToken === "undefined") {
    console.log('Bearer Token not passed successfully.');
    process.exit(1);
  }

  var bearerToken = provToken;
  var conDistrictArray = [];
  var conciseDistrict;

  for (var i = 0; i < schoolArray.length; i++) {
    var schoolName = (typeof namedSchoolArray[i] === "string") ? namedSchoolArray[i] : schoolArray[i];

    getStaffCount(bearerToken, schoolArray[i], serverURL)
      .then((res) => {
        console.log(`School ${schoolName} Staff Count: ${res}`);
      })
      .catch((err) => {
        console.error(err);
      });

      const staffDetails = await getStaffDetails(bearerToken, schoolArray[i], serverURL);
      var conciseDetails = await returnWantedDetails(staffDetails, schoolName);

      // adding to the array like this creates a 2D array, and we then need to flatten it later on before adding it to the csv parse function.
      conDistrictArray.push(conciseDetails);

  }

  var csvFields = [ 'first_name', 'last_name', 'site', 'dcid', 'username', 'email' ];
  var csvOpts = { csvFields };

  const csv = parse(flattenArray(conDistrictArray), csvOpts);

  writeCSV(csv)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

function flattenArray(arr) {
  var flat = [];
  for (var i = 0; i < arr.length; i++) {
    flat = flat.concat(arr[i]);
  }
  return flat;
}

function writeCSV(data) {
  return new Promise(function (resolve, reject) {
    try {

      fs.writeFile('user_export.csv', data, err => {
        if (err) {
          reject(err);
        }
        resolve('File Written Successfully!');
      });
    } catch(err) {
      reject(err);
    }
  });
}

function getStudentCount(bearTok, schoolID, url) {
  return new Promise(function (resolve, reject) {
    let axiosConfig = {
      method: 'get',
      url: `${url}/ws/v1/school/${schoolID}/student/count`,
      headers: {
        'Authorization': `Bearer ${bearTok}`,
        'Accept': 'application/json'
      }
    };

    axios(axiosConfig)
      .then(function (res) {
        console.log(res.data);
        resolve(res.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

function getStaffCount(bearTok, schoolID, url) {
  return new Promise(function(resolve, reject) {
    let axiosConfig = {
      method: 'get',
      url: `${url}/ws/v1/school/${schoolID}/staff/count`,
      headers: {
        'Authorization': `Bearer ${bearTok}`,
        'Accept': 'application/json'
      }
    };

    axios(axiosConfig)
      .then(function (res) {
        resolve(res.data.resource.count);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

function getStaffDetails(bearTok, schoolID, url) {
  return new Promise(function(resolve, reject) {
    let axiosConfig = {
      method: 'get',
      url: `${url}/ws/v1/school/${schoolID}/staff?expansions=emails`,
      headers: {
        'Authorization': `Bearer ${bearTok}`,
        'Accept': 'application/json'
      }
    };

    axios(axiosConfig)
      .then(function (res) {
        resolve(res.data);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

function returnWantedDetails(data, site) {
  return new Promise(function (resolve, reject) {
    try {

      var concatData = [];

      for (var i = 0; i < data.staffs.staff.length; i++) {
        // The Nested Ternary functions, while ugly on 'email', allow this to prioritize the teacher_email, while instead using admin_email if non-existant
        // or additionally use a safe blank string if admin_email is also non-existant.
        // So email: Will be the teacher_email, otherwise will be the admin_email or finally blank.
        var obj = {
          first_name: typeof data.staffs.staff[i].name.first_name === "undefined" ? "" : data.staffs.staff[i].name.first_name,
          last_name: typeof data.staffs.staff[i].name.last_name === "undefined" ? "" : data.staffs.staff[i].name.last_name,
          site: site,
          dcid: typeof data.staffs.staff[i].users_dcid === "undefined" ? 0 : data.staffs.staff[i].users_dcid,
          username: typeof data.staffs.staff[i].teacher_username == "undefined" ? (typeof data.staffs.staff[i].admin_username == "undefined" ? "" : data.staffs.staff[i].admin_username) : data.staffs.staff[i].teacher_username,
          email: typeof data.staffs.staff[i].emails === "undefined" || typeof data.staffs.staff[i].emails.work_email === "undefined" ? "" : data.staffs.staff[i].emails.work_email
        };

        concatData.push(obj);
      }

      resolve(concatData);

    } catch(err) {
      reject(err);
    }
  });
}

module.exports = {
  run,
}
