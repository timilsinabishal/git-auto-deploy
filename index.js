/*!
 * git-auto-deploy
 * Copyright(c) 2016 Bishal Timilsina
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */
const nodemailer=require('nodemailer');
const spawn=require('child_process').spawn;
const os=require('os');


/**
*Used to send log on email
*@type {String} serverLog Server log message on command execution, change to add headers to it
*/
var serverLog='';

/**
*Log buffer data to console and store on serverLog for mail body
*@param {Buffer|String} data
*/
function out(data){
	console.log(`${data}`);
	serverLog+=data
}

/**
 * Module exports.
 * @public
 */

/**
 * Deploy the updates
 * @param  {?Object} repo Repository information
 * @param  {?Object} mail Mail configuration for nodemailer
 */
module.exports.deploy=function(repo,mail){


	/**
	*Git url
	*@type {String} origin Git remote repository url uses origin if none specified
	*@type {String} branch Branch name of remote repository
	*/
	var repo=repo || {
		origin:"origin",
		branch:"master"
	};

	//get the execution path of program
	console.log(`Execution path: ${process.cwd()}`);
	console.log('');
	//check os platform ,currently linux and windows is supported
	console.log("Checking os platform");
	var platform=os.platform();

	console.log(`Platform: ${platform}`);
	//run shell file for linux
	if(platform.indexOf("linux")!==-1){
		var pull=spawn("./script.sh",[repo.origin,repo.branch],{cwd:`${__dirname}`});
	//run batch file for windows
	}else if(platform.indexOf("win32")!==-1){
		var pull=spawn("cmd",["/c","script.bat"],[repo.origin,repo.branch],{cwd:`${__dirname}`});
	}else{
		console.log("Operating system is not supported.");
		return;
	}

	//Prints output data
	pull.stdout.on("data",out);
	//Prints errors
	pull.stderr.on("data",out);
	//Send message on end of script execution
	pull.on('close', (code) => {
		console.log(`Child process exited with code ${code}`);
		var subject="Auto deployment of server completed";


		!mail || sendMail(subject,serverLog,function(err,info){
			if(err) console.error(`Error sending mail.\n ${err}`);
			else{
				console.dir(info);
				console.log("Mail sent to webmaster");
			}

			console.log(`Killing the server`);
			process.exit(0);
			
		});
		
	});



	/**
	*Send mail to user about deployment
	*@param {String} subject Subject of mail
	*@param {String} message Message of mail body
	*@param {sendMailCallback} callback Error as first param and response data as second param
	*/
	function sendMail(subject,message,callback){
		
		var mailOptions = mail.mailOptions;
		var mailConfig = mail.mailConfig;
		//Send mail to the owner about the updates
		var transporter=nodemailer.createTransport(mailConfig);

		mailOptions.subject=subject;
		mailOptions.text=`Server Log:\n ${message}`;
		// mailOptions.html='<b>Server log</b>' // html body

		transporter.sendMail(mailOptions,function(err,info){
			if(err) callback(err);
			callback(null,info);
		});
	}

}

/**
 * Mail config
 * @param  {!Object} mailConfig  Configuration file for mail auth and service type
 * @param  {!Object} mailOptions Options for sender,receiver
 * @return {Object.<mailConfig,mailOptions}
 */
module.exports.createMail=function(mailConfig,mailOptions){
	
	return {mailConfig:mailConfig,mailOptions:mailOptions};
}