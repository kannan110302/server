let http = require('http');
let fs = require('fs');

let app = http.createServer((req, res) => {
    if (req.url === "/delete") {
        fs.readFile('DeleteData.json', (err, data) => {
            if (err) {
                res.write("Invalid request");
                res.end();
            } else {
                let mydata = JSON.parse(data);
                
                // Specify the ID of the item to delete
                let idToDelete = 2; // For example, deleting the object with id = 2
                
                // Filter out the item with the specified ID
                let filteredData = mydata.filter(item => item.id !== idToDelete);
                
                // Write the updated JSON back to the file
                fs.writeFile('DeleteData.json', JSON.stringify(filteredData,null, 2), (err) => {
                    if (err) {
                        res.write("Error writing file");
                        res.end();
                    } else {
                        res.write("Deletion successful");
                        res.end();
                    }
                });
            }
        });
    } else {
        res.write("Invalid request");
        res.end();
    }
});

app.listen(7333, () => {
    console.log("Server is running on port 7333");
});
