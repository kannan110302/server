const http = require('http');

const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    const activePage = reqUrl.pathname;
    const query = Object.fromEntries(reqUrl.searchParams);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`Active Page: ${activePage}\n`);
    res.write(`Query Parameters: ${JSON.stringify(query)}\n`);

    // Split the pathname
    const splitPathClean = activePage.split('/').filter(part => part !== '');
    res.write(`Split Path: ${splitPathClean.join(', ')}\n`);

    res.end();
});

server.listen(3002, () => {
    console.log('Server is running on http://localhost:3002');
});
