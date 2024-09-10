let http = require('http');
let fs = require('fs');

let app = http.createServer((req, res) => {
    if (req.url.startsWith("/search")) {
        // Extract search query from URL, e.g., /search?name=Alice
        let url = new URL(req.url, `http://${req.headers.host}`);
        let searchKey = url.searchParams.get('key'); // The key to search by (e.g., 'name')
        let searchValue = url.searchParams.get('value'); // The value to search for (e.g., 'Alice')

        fs.readFile('Search.json', (err, data) => {
            if (err) {
                res.write("Invalid request");
                res.end();
            } else {
                let mydata = JSON.parse(data);

                // Perform the search
                let results = mydata.filter(item => {
                    return item[searchKey] && item[searchKey].toString().toLowerCase() === searchValue.toLowerCase();
                });

                // Return the results
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(results, null, 2));
                res.end();
            }
        });
    } else {
        res.write("Invalid request");
        res.end();
    }
});

app.listen(7777, () => {
    console.log("Server is running on port 7777");
});
