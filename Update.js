let http = require('http');
let fs = require('fs');

let app = http.createServer((req, res) => {
    if (req.url === "/update") {
        fs.readFile('Update.json', (err, data) => {
            if (err) {
                res.write("Invalid request");
                res.end();
            } else {
                let mydata = JSON.parse(data);
                
                // Find the object to update by id or any other criteria
                let idToUpdate = 2; // For example, updating the object with id = 2
                let updatedDetail = "Thomas"; // New name for the object
                
                let item = mydata.find(item => item.id === idToUpdate);
                if (item) {
                    item.name = updatedDetail; // Update the detail
                }
                
                // Write the updated JSON back to the file
                fs.writeFile('Update.json', JSON.stringify(mydata, null, 2), (err) => {
                    if (err) {
                        res.write("Error writing file");
                        res.end();
                    } else {
                        res.write("Update successful");
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

app.listen(7444, () => {
    console.log("Server is running on port 7444");
});
