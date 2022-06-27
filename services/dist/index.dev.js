"use strict";

var _require = require("../db"),
    getMissedPersons = _require.getMissedPersons,
    getFoundPersons = _require.getFoundPersons;

var _require2 = require("../functions"),
    compareFaces = _require2.compareFaces;

function compareService(_ref) {
  var person, path, match, obj, foundPersons, missedPersons;
  return regeneratorRuntime.async(function compareService$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          person = _ref.person, path = _ref.path;
          console.log("Starting compare service ..."); // get all missed and found

          match = false;

          if (!(path === "missed")) {
            _context.next = 10;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(getFoundPersons());

        case 6:
          foundPersons = _context.sent;
          foundPersons.forEach(function (found) {
            var distance = compareFaces(person.faceDescriptor.split(",").map(Number), found.faceDescriptor.split(",").map(Number));

            if (distance <= 0.25) {
              match = true;
              obj = found;
            }
          });
          _context.next = 15;
          break;

        case 10:
          if (!(path === "found")) {
            _context.next = 15;
            break;
          }

          _context.next = 13;
          return regeneratorRuntime.awrap(getMissedPersons());

        case 13:
          missedPersons = _context.sent;
          missedPersons.forEach(function (missed) {
            var distance = compareFaces(person.faceDescriptor.split(",").map(Number), missed.faceDescriptor.split(",").map(Number));

            if (distance <= 0.25) {
              match = true;
              obj = missed;
            }
          });

        case 15:
          console.log(match ? "Match found!" : "No match found :(");
          return _context.abrupt("return", {
            number: obj.contactNumber
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = {
  compareService: compareService,
  getMissedPersons: getMissedPersons,
  getFoundPersons: getFoundPersons
};