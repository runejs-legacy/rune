import _ from 'lodash';

export default (magician) => {
  magician.registerTask('new', (options) => {
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