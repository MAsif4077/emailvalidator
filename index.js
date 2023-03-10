const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const emailController=require('./controller/validateEmailController')


const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: false}));
app.get('/', (req, res)=> {
    res.render('bulkEmails',{title:'Bulk Domain Validator',text:'',flag:false});

})

app.get('/single', (req, res) => {
    res.render('index',{info:''});
})
app.post('/verifySingle',emailController.validateEmail);
app.post('/verifybulk',emailController.verifyEmails);

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    
})