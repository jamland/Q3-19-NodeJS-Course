// prevent process form failure
process
  .on('uncaughtException', error => {
    console.log('uncaughtException', error);
  })
  .on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
