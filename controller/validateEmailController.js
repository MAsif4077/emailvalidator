const  emailVerify= require('email-verify');
const randomstring = require('randomstring');

module.exports={

    validateEmail: async function(req,res){
        try{ 
             let email= req.body.emails;
             console.log(email);
              const domain = email.split('@')[1];
              const emailAddress = `${randomstring.generate(10)}@${domain}`;
              console.log(emailAddress);
              
              emailVerify.verify(emailAddress, function(err, info) {
            if (err) {
                      res.send("Error",err)
                    } 
                    else { 
                      if (info.success) {
                        res.render('index',{info:"Accept-All"});

                   } else if (info.success == false) {
                   emailVerify.verify(email, function(err, info){
                if(info.success){
                    res.render('index',{info:`${email} is Valid`});
         
        }
        else{
          res.render('index',{info:`${email} is Invalid`})
        }
      })
    }
  }
});
   
   
        }catch(err){
            res.send("Something went wrong",err)

        }
  
    },

    }