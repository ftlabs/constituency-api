"use strict";
const fs = require("fs");
const postcodes = JSON.parse(fs.readFileSync("./data/constituencyMatch.json"));

module.exports.main = async event => {
  const constituency = getConstituency(event.pathParameters.postcode);
  return {
    statusCode: 200,
    body: constituency
  };
};

function getConstituency(postcode) {
  var postcodeArray = postcode.toUpperCase().trim();
  if (!postcodeArray.includes(" ")) {
    postcodeArray = postcodeArray.replace(/^(.*)(\d)/, "$1 $2");
  }
  postcodeArray = postcodeArray.split(" ");
  var primary = postcodeArray[0];
  var secondary = postcodeArray[1];
  var final;

  if (primary.length === 2) {
    final = postcodes[primary[0]][primary[1]];
  }
  if (primary.length === 3) {
    final = postcodes[primary[0]][primary[1]][primary[2]];
  }
  if (primary.length === 4) {
    final = postcodes[primary[0]][primary[1]][primary[2]][primary[3]];
  }
  if (primary.length === 5) {
    final =
      postcodes[primary[0]][primary[1]][primary[2]][primary[3]][primary[5]];
  }

  return final.regEx.find(data => secondary.match(data.regEx)).constituency;
}
