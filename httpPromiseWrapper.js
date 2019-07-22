const http = require('http');

function promisifyRequest(method, url) {
  return new Promise((resolve, reject) => {
    http[method](url, (res) => {
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData);
        } catch (e) {
          reject(e);
        }
      });
    });
  });
}

function promisifyGetRequest(url) {
  return promisifyRequest('get', url);
}

module.exports = {
  promisifyGetRequest,
};
