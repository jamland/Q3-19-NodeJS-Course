var today = new Date();

const currentTime = () =>
  today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

module.exports = {
  currentTime
};
