"use strict";
const fs = require("fs");

module.exports.poller = async event => {
  const constituency = getConstituency(event.pathParameters.postcode);
  return {
    statusCode: 200,
    body: constituency
  };
};
