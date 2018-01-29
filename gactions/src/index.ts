'use strict';

import * as fs from 'fs';
import * as child_process from 'child_process';
import * as cron from 'node-cron';

const gactions = "./gactions"

cron.schedule("0 5 * * 5", () => {

  const project = JSON.parse(fs.readFileSync("../.firebaserc", "utf-8")).projects.default;
  
  const cmd = gactions + " test --action_package ./action.json --project " + project;
  
  console.log(cmd);
  child_process.exec(cmd, (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
  });
});