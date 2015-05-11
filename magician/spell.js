import _ from 'lodash';
import wrench from 'wrench';
import path from 'path';
import childProcess from 'child_process';

export default (magician) => {
  magician.registerTask('new', (options) => {
    let name = options._[0];
    console.log('Creating new project');
    wrench.copyDirSyncRecursive(path.join(__dirname, '..', 'template'), path.join(process.cwd(), name));
    console.log(`Running npm install`);
    childProcess.execSync(`cd ${name}; npm install`);
    console.log(`${name} has been created`);
    magician.finish();
  });

  magician.registerTask('help', () => {
    console.log('Available Tasks:');
    _.each(magician.$tasks, (val, key) => {
      console.log(key);
    });

    magician.finish();
  });
}