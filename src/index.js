const http = require('http');
const client = require('./client');
// const qs = require('querystring');

require('./exceptions');

const routes = {
  getData: '/anything',
  sum: '/sum'
};

const server = http.createServer();

server.listen(8000);
server.on('error', error => {
  console.error('⚠️ error', error);
});

server.on('request', async (req, res) => {
  const { method, url } = req;
  const { pathname, searchParams } = new URL(url, 'http://localhost');
  console.log('made request to ', pathname);

  if (method === 'GET') {
    if (pathname === routes.getData) {
      const json = await client.getRandomPost();
      sendResponseJSON(res, json);
    } else {
      notFound(res);
    }
  } else if (method === 'POST') {
    if (pathname == routes.sum) {
      // TODO: it parse body in wrong way
      // let body = [];
      // req
      //   .on('data', chunk => body.push(chunk))
      //   .on('end', () => {
      //     body = Buffer.concat(body).toString();
      //     const post = qs.parse(body);
      //     console.log('body', post);
      //   });
      // .on('error', () => reject(new Error('⚠️ 💩')));

      // so i made it this way http://localhost:8000/sum?a=3&b=3
      reponseWithSumOf(res, searchParams);
    } else {
      notFound(res);
    }
  }
});

const reponseWithSumOf = (res, searchParams) => {
  const a = parseInt(searchParams.get('a'));
  const b = parseInt(searchParams.get('b'));
  const wrongParams = isNaN(a) || isNaN(b);

  if (wrongParams) {
    const error = { message: 'please provide valid arguments' };
    rejectWithJSON(res, JSON.stringify(error));
  } else {
    const sum = (a + b).toString();
    sendResponseJSON(res, JSON.stringify({ answer: sum }));
  }
};

const sendResponseJSON = (res, json) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200, 'OK');
  res.write(json);
  res.end();
};

const rejectWithJSON = (res, json) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(400, 'Bad Request');
  res.end(json);
};

const notFound = res => {
  res.writeHead(404, 'Not Found');
  res.end();
};

console.log('🛸 Server started on localhost:8000');
