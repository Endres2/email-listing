const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express()
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"))

app.listen(process.env.PORT,()=>{
    console.log("Server is running in port 3000")
})

app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/signup.html")
})

app.post("/", (req,res)=>{
    const nameFirst = req.body.nameFirst
    const nameLast = req.body.nameLast
    const email =  req.body.email

    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_field:{
                    FNAME: nameFirst,
                    LNAME: nameLast
                }
            }
            

        ]

    }
    const jsonData = JSON.stringify(data)

    url = "https://us11.api.mailchimp.com/3.0/lists/0ae2cbb770"
    options = {
        method: "POST",
        auth: "apiKey:550f6b4c2432d3969b1f0133b46be58e-us11"
    }

    const request = https.request(url, options, (response)=>{

        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        }

        response.on("data", (data)=>{
            console.log(JSON.parse(data))
        })
    }).on("error", (e)=>{
        console.log(e)
    });

    app.post("/failure", (req,res)=>{
        res.redirect("/")
    })

    request.write(jsonData)
    request.end()

   
})

//550f6b4c2432d3969b1f0133b46be58e-us11

//list id 0ae2cbb770