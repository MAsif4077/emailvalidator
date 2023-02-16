const emailVerify = require('email-verify');
const randomstring = require('randomstring');

module.exports = {
  validateEmail: async function(req, res) {
    try {
      let email = req.body.emails;
      console.log(email);
      const domain = email.split('@')[1];
      const emailAddress = `${randomstring.generate(10)}@${domain}`;
      console.log(emailAddress);

      emailVerify.verify(emailAddress, function(err, info) {
        if (err) {
          res.status(500).send("Error: " + err);
        } else {
          if (info.success) {
            res.render('index', {info: "Accept-All"});
          } else if (info.success == false) {
            emailVerify.verify(email, function(err, info) {
              if (info.success) {
                res.render('index', {info: `${email} is Valid`});
              } else {
                res.render('index', {info: `${email} is Invalid`})
              }
            })
          }
        }
      });

    } catch (err) {
      res.status(500).send("Error: " + err);
    }
  },
  verifyEmails: async function (req,res) {
    const email = req.body.emails;
    const lines = email.split(/\n/);
    const output = lines.filter(line => /\S/.test(line)).map(line => line.trim());
    
    const validEmails = [];
    const invalidEmails = [];
    const acceptAllEmails = [];
  
    for (const email of output) {
      const domain = email.split('@')[1];
      const emailAddress = `${randomstring.generate(10)}@${domain}`;
  
      try {
        const info = await new Promise((resolve, reject) => {
          emailVerify.verify(emailAddress, (err, info) => {
            if (err) {
              reject(err);
            } else {
              resolve(info);
            }
          });
        });
  
        if (info.success) {
          acceptAllEmails.push(email);
        } else {
          const info = await new Promise((resolve, reject) => {
            emailVerify.verify(email, (err, info) => {
              if (err) {
                reject(err);
              } else {
                resolve(info);
              }
            });
          });
  
          if (info.success) {
            validEmails.push(email);
          } else {
            invalidEmails.push(email);
          }
        }
      } catch (err) {
        console.error(`Error verifying email ${email}: ${err}`);
      }
    }
    var data={
    valid:validEmails,
    invalid:invalidEmails,
    acceptall:acceptAllEmails

  }
    console.log("....",data);
    res.render('bulkEmails',{title:'Bulk Domain Validator',text:data,flag:true});
    
  }


}