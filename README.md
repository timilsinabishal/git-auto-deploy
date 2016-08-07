# git-auto-deploy

    This repository  is still not tested and in development so things may break try to fix it in your own. 
Git-Deploy  is the npm module for automatic deploying of node server.It lauches the shell script to pull the git from origin and exit the server. Remember to use tools like forever or pm2 to respawn the server.  

[![NPM](https://nodei.co/npm/git-auto-deploy.png)](https://nodei.co/npm/git-auto-deploy/)
#Usage

Add a route for webhook in your framework.  
Example for express

    var deploy=require('git-deploy');
    .............................
    .............................
    app.post('/webhook',function(req,res){
      var secret=="yoursecretkey";
      if(req.body.secret=secret){
        deploy();
      }
    }
    ............................
