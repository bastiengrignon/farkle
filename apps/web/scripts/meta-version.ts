import packageJson from '../package.json' with { type: 'json' };
import * as fs from 'node:fs';

const appVersion = packageJson.version;

const newMetaVersion = JSON.stringify({ version: appVersion }, null, 2);

fs.writeFile('./public/meta.json', newMetaVersion, 'utf8', (error) => {
  if (error) {
    return console.error(`An error occurred while writing JSON Object to meta.json -> ${error}`);
  }
  console.log('meta.json file has been saved with latest version number');
});
