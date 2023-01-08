const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();

const api_key = process.env.API_KEY;
const list_id = process.env.LIST_ID;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// to delete a list
// client.setConfig({
//   apiKey: api_key;
//   server: "us21",
// });
//
// const run = async () => {
//   const response = await client.lists.deleteList("d33cd98c11");
//   console.log(response);
// };
//
// run();

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    var jsonDATA = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/" + list_id + "/";
    const options = {
        method: "POST",
        auth: "bosir1:" + api_key
    }

    const request = https.request(url, options, function (response) {
        // response.on("data", function (data) {
        //     console.log(JSON.parse(data));
        // })
        if(response.statusCode === 200){
          res.sendFile(__dirname + "/success.html");
        }
        else res.sendFile(__dirname + "/failure.html");
    });

    request.write(jsonDATA);
    request.end();
});

app.post("/failure",(req,res) => {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000 , function () {
    console.log("Server is Running on port 3000");
});
