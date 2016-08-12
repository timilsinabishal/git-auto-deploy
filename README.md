# git-auto-deploy

git-auto-deploy  is the npm module for automatic deploying of node server.It launches the shell script to pull the git from origin and exit the server. Remember to use tools like forever or pm2 to respawn the server process.

[![NPM](https://nodei.co/npm/git-auto-deploy.png)](https://nodei.co/npm/git-auto-deploy/)
#Usage

Add a route for webhook in your framework.  
Example for express

    var gad = require('git-auto-deploy');
    .............................
    .............................
    app.post('/webhook',function(req,res){
      var secret = "yoursecretkey";
      if(req.body.secret == secret){
        gad.deploy();
      }
    }
    ............................

Example to setup mail address for automatic mail of deploy logs and custom repository setup
    
    ----------------------------
    var mailOptions={
      from:['"Sender Name" <sender@email.com>'],
      to:['"Receiver Name" <receiver@mail.com>']
    };

    var mailConfig={
      service:"Gmail",
      auth:{
        user:"username@gmail.com",
        pass:"password"
      }
    };

    var repo={
      origin:"remote url",
      branch:"branch name"
    };

    var mail=gad.createMail(mailConfig,mailOptions);
    gad.deploy(repo,mail);


For auto update after specified duration use:

    setInterval(function(){
      gad.deploy()
    },duration);