'use strict';

const fs = require("fs");
const child_process = require("child_process");

const param = process.argv[2];
const project = JSON.parse(fs.readFileSync("../.firebaserc", "utf-8")).projects.default;

let gactions = "gactions"
if (process.platform !== "win32") {
  gactions = "./" + gactions;
}

const cmd = gactions + " " + param + " --action_package action.json --project " + project;

console.log(cmd);
child_process.exec(cmd, function(err, stdout, stderr) {
  console.log(stdout);
  console.log(stderr);
});