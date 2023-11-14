var fs = require('fs');
var path = require('path');

function usage() {
    console.log("Usage: replace.js [-h] [config] [toOutput]\n" +
        "Generate number formats information files.\n\n" +
        "-h or --help\n" +
        "  this help\n" +
        "toDir\n" +
        "  directory to output the package.json Default: ./tmp");
    process.exit(1);
}

process.argv.forEach(function (val, index, array) {
    if (val === "-h" || val === "--help") {
        usage();
    }
});

var config = process.argv[2] || "./config.json";
var toOutput = process.argv[3] || "./tmp";

if (!fs.existsSync(toOutput)){
    fs.mkdirSync(toOutput, {recursive:true});
}
var regExp = /(\<BrowserRouter basename\=\")(.*)(\"\>)/;
var configData = JSON.parse(fs.readFileSync(config, "utf-8"));
packageJSONFile(configData);
indexJSFile(configData);

function packageJSONFile(configData) {
    console.log("Modify package.json ...");
    var orgPkgData = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
    orgPkgData["homepage"] = configData.packages.homepage;
    if (typeof configData.packages.ilibVersion !== 'undefined') {
        orgPkgData["dependencies"]["ilib"] = configData.packages.ilibVersion;
    }
    fs.writeFileSync(path.join(toOutput, "package.json"), JSON.stringify(orgPkgData, true, 2), "utf-8");
}

function indexJSFile(configData) {
    console.log("Modify src/index.js ...");
    var jsContent = fs.readFileSync("./src/index.js", "utf-8");
    var updated = jsContent.replace(regExp, `$1` + configData.index.basename + `$3`);
    fs.writeFileSync(path.join(toOutput, "index.js"), updated, "utf-8");
    
}

console.log("Done");