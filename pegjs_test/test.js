var peg = require("pegjs");
fs = require("fs");
parser = peg.generate(fs.readFileSync("test3.pegjs").toString());


console.log(parser.parse(fs.readFileSync("script.txt").toString()));
