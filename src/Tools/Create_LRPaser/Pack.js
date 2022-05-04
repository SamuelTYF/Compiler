import fs from "fs"

var pattern_class=fs.readFileSync("Pattern_Class_Release.js").toString()

console.log(JSON.stringify(pattern_class));

fs.writeFileSync("Pattern_String.js",JSON.stringify(pattern_class))