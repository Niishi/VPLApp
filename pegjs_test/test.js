const peg = require("pegjs");
const fs = require("fs");
/**
 * 小数点n位まで残す関数
 * @param  {float} number 対象の数値
 * @param  {int} n      残したい小数点以下の桁数
 * @return {[type]}     小数点n位まで四捨五入した値
 */
function roundFloat(number, n){
    var _pow = Math.pow(10, n);
    return Math.round(number * _pow) / _pow;
}

parser = peg.generate(fs.readFileSync("error_correction2.pegjs").toString());
code = fs.readFileSync("script.txt").toString();

// x = "a=;b=;c=;d=;e=;"
//   + "a=;b=;c=;d=;e=;"
//   + "a=;b=;c=;d=;e=;"
//   + "a=;b=;c=;d=;e=;"
//   + "a=;b=;c=;d=;e=;";

startTime = performance.now();
parser.parse(code);
endTime = performance.now();
console.log(roundFloat(endTime - startTime, 3) + "ms");

startTime = performance.now();
parser.parse(x);
endTime = performance.now();
console.log(roundFloat(endTime - startTime, 3) + "ms");
