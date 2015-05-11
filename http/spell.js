import Server from './server';
import Controller from './controller';

export default (magician) => {
  magician.on('after:init', () => {
    Rune.Controller = Controller;
    magician.loader.loadPath(magician.path + '/controllers');
  });

  magician.registerTask('server', async () => {
    await Server.run(process.env.PORT || 3000);
  });
}