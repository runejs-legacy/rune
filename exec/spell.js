export default (magician) => {
  magician.registerTask('exec', async (options) => {
    require(process.cwd() + '/tasks/' + options._[0])(options);
  });
}