let http = require('http');
let fs = require('fs');

let app = http.createServer((req, res) => {
    if (req.url === "/") {
        fs.readFile('Sort.json', (err, data) => {
            if (err) {
                res.write("invalid request");
                res.end();
            } else {
                res.write(data);
                res.end();
            }
        });
    } else if (req.url === "/sort") {
        let sortKey = 'age';  // Change this key to sort by different fields
        fs.readFile('Sort.json', (err, data) => {
            if (err) {
                res.write("invalid request");
                res.end();
            } else {
                let mydata = JSON.parse(data);
                let sortedData = mydata.sort((a, b) => a[sortKey] - b[sortKey]);
                res.write(JSON.stringify(sortedData));
                res.end();
            }
        });
    } else {
        res.write("invalid request");
        res.end();
    }
});

app.listen(7373, () => {
    console.log("Server is running on port 7373");
});
