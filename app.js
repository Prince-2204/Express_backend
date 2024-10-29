const express = require('express');
const app = express();
const port = 3000;
app.engine('html', require('ejs').renderFile);
const OpenAIApi = require("openai");
const Configuration = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
var bodyParser = require('body-parser');  
require('dotenv').config()
var urlencodedParser = bodyParser.urlencoded({ extended: false })  

async function getHaiku(prompt_new,content_text) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: prompt_new },
            {
                role: "user",
                content: content_text,
            },
        ],
    });
    console.log(completion.choices[0].message.content)
    // Return the actual text content of the message
    return completion.choices[0].message.content;
}

// Express route to fetch the haiku and respond
app.get('/', async (req, res) => {
    try {
        const prompt_new = "You are an helpful assistant/your role is to find the list of all the places to visit in a <city> mentioned.Give output in the list format.";
        const content_text = "Bilaspur,Chhatishgarh,India";
        const haiku = await getHaiku(prompt_new,content_text);
        res.send(`Gpt response: ${haiku}`);
    } catch (error) {
        res.status(500).send("Error generating haiku.");
        console.error(error);
    }
});
app.get('/',(req,res)=>{
    res.send("Hello ji this is me.")
})

// app.use('/static', express.static('public'))
app.get('/main', function(req, res) {

    var name = 'fuck you';
  
    res.render(__dirname + "/public/index.html", {name:name});
  
  });

app.get('/form',function(req,res){
    res.render(__dirname + "/public/form.html")
})
app.post('/process_post', urlencodedParser, async function (req, res) {  
    // Prepare output in JSON format  
    response = {  
        first_name:req.body.first_name,  
        last_name:req.body.last_name,
        hours:req.body.hours 
    };
    const final_ans =response.first_name + ","+response.last_name + response.hours +" Hours";
    console.log(final_ans);
    const prompt_new = "You are an helpful assistant/your role is to plan a <city> tour where to visit, where to eat all these this based on <city> mentioned and time duration.Give output in the form of a single short Paragraph.";
    // const content_text = "Bilaspur,Chhatishgarh,India";
    const haiku = await getHaiku(prompt_new,final_ans);
       
    res.render(__dirname+"/public/details.html",{details:haiku});  
 })  

app.listen(process.env.PORT, () => {
    console.log(`Example Port is listening: ${port}`);
});
