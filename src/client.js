const https = require('https');

const randomId = () => Math.floor(Math.random() * 100) + 1;
const API = {
  getPost: 'https://jsonplaceholder.typicode.com/todos/'
};

const getRandomPost = () =>
  new Promise((resolve, reject) => {
    const url = new URL(API.getPost + randomId());
    let body = [];

    const req = https.request(url, res => {
      if (res.statusCode === 200) {
        res
          .on('data', chunk => body.push(chunk))
          .on('end', () => {
            body = Buffer.concat(body).toString();
            resolve(body);
          })
          .on('error', () => reject(new Error('⚠️ 💩')));
      } else reject(new Error('️⚠️ 💩'));
    });

    req.on('error', e => {
      console.error('️⚠️ problem with request: ' + e);
      reject(e);
    });
    req.end();
  });

module.exports = {
  getRandomPost
};
