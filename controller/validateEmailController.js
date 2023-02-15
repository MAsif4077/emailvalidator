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
        validateBulk: async function(req,res){
      try{
        const email=req.body.emails;
    
        var lines=email.split(/\n/);
        console.log("lines ",lines);;
    
        var output=[];
        for(var i=0;i<lines.length;i++){
            if(/\S/.test(lines[i])){
                output.push(lines[i].trim());
            }
    
        }
       console.log("output",output);
       var emails=output;
           if (!Array.isArray(emails)) {
             res.send("Error: Email input should be an array.");
           }  else{ var validEmails = [];
             var invalidEmails = [];
             var acceptAllEmails = [];
             var pendingVerification = [];
             var promises = [];
             for (const email of emails) {
               var domain = email.split('@')[1];
           var emailAddress = `${randomstring.generate(10)}@${domain}`
               // console.log("Domain", domain);
               // console.log("emailAddress", emailAddress);
               var promise = new Promise((resolve, reject) => {
           emailVerify.verify(emailAddress,async function(err, info) {
                   if (err) {
                     await pendingVerification.push(email);
                    // console.log("Pending ",pendingVerification);
                   } else if (info.success) {
                   await acceptAllEmails.push(email);
                    // console.log("Accept-All",acceptAllEmails)
                   } else {
                 emailVerify.verify(email,async function(err, info) {
                       if (info.success) {
                        await validEmails.push(email);
                       //  console.log("Valid",validEmails)
                       } else {
                        await invalidEmails.push(email);
                        // console.log("Invalid ",invalidEmails)
                       }
                     })
                   }
                   resolve();
                 })
               });
               promises.push(promise);
               console.log(promise);
             }
             Promise.all(promises).then(() => {
              var data={
               valid:validEmails,
               invalid:invalidEmails,
               acceptAll:acceptAllEmails,
               pending:pendingVerification
              }
              console.log("data....",data);
               res.render('bulkEmails',{title:'Bulk Domain Validator',text:data,flag:true});
             });
           }
    }catch(err){
        res.send(err);
    }
       

    }

    }