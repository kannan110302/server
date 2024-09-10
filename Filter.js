let http = require('http')
let fs = require('fs')

let app=http.createServer((req, res)=>{
 
    if(req.url=="/"){
        fs.readFile('data.json', (err, data)=>{
            if(err){
                res.write("invalid request")
                res.end()
            }
            else{
                
                res.write(data)
                res.end()
            }
        })
    }else {
        let ids=2
        fs.readFile('data.json', (err, data)=>{
            if(err){
                res.write("invalid request")
                res.end()
            }
            else{
                let mydata=JSON.parse(data)
               let result= mydata.filter((item)=> item.id==ids)
                res.write(JSON.stringify(result))
                res.end()
            }
        })
    }
})

app.listen(7473,()=>{
    console.log("runing");
})