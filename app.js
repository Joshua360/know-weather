const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use("/static",express.static('public'))


app.set("view engine", "pug");
const http = require("http");


app.get("/", (req,res)=>{
    res.render("index");
})

app.get("/weather", (req,res)=>{
    const region = req.cookies.city;
    const regionData = req.cookies.returnedData;
    if(region){
        res.render("result", {region, regionData});
    }else{
        res.redirect("/")
    }
})


app.post("/weather", (req,res)=>{
    res.cookie("city", req.body.city);
    const city = req.body.city;
    
    http.get(`http://api.weatherstack.com/current?access_key=e2cd195b8285ca0a21b25f9bb93a0f40&query=${city}`, (response) => {

        let body = '';
            response.on('data', (d) => {
            body += d;
        });

        response.on("end", ()=>{
            const tempData = body.toString();
            const temp = JSON.parse(tempData);
            res.cookie("returnedData", temp);
            res.redirect("/weather");


        })

}).on('error', (e) => {
  console.error(e);
});



});


app.post("/goodbye", (req,res)=>{
    res.clearCookie("city");
    res.clearCookie("returnedData");
    res.redirect("/");

})






const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`App running on post: ${port}`);
});
