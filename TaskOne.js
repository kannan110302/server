const http = require('http');
const fs = require('fs');
const path = require('path');
const { URLSearchParams } = require('url');

// Define file paths
const homeFilePath = path.join(__dirname, 'task.html');
const dataFilePath = path.join(__dirname, 'data.json');

// Create an HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // Serve the home.html file
        fs.readFile(homeFilePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading home.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && req.url === '/submit') {
        let body = '';

        // Collect incoming data
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Once all data is received
        req.on('end', () => {
            let parsedData;
            try {
                parsedData = new URLSearchParams(body); // Parse form data
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                return res.end('Invalid data format');
            }

            // Convert parsed data to an object
            const formData = Object.fromEntries(parsedData.entries());

            // Store the data in a file (data.json)
            fs.readFile(dataFilePath, (err, fileData) => {
                let jsonData = [];
                if (!err && fileData.length > 0) {
                    try {
                        jsonData = JSON.parse(fileData);
                    } catch (parseError) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        return res.end('Error parsing data.json');
                    }
                }

                // Add the new data
                jsonData.push(formData);

                // Write the updated data back to the file
                fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        return res.end('Error writing to file');
                    }
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Data saved successfully');
                });
            });
        });
    } else {
        // Handle other requests
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server on port 5000
server.listen(5500, () => {
    console.log('Server is listening on port 5500');
});


