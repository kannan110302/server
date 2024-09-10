const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const activePage = parsedUrl.pathname;
    const query = parsedUrl.query;

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`Active Page: ${activePage}\n`);
    res.write(`Query Parameters: ${JSON.stringify(query)}\n`);

    
    // Split the pathname
    const splitPathClean = activePage.split('/').filter(part => part !== '');
    res.write(`Split Path: ${splitPathClean.join(', ')}\n`);

    res.end();
});

server.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
