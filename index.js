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
*Auto update config
*@type {Boolean} autoUpdate  Default is false
*@type {Number} duration Set duration of autoUpdate in milliseconds default is 5 hours
*/

var update={
	auto:false,
	duration:60*1000*60*5
};

/**
*config for mail recipents and sender
*@type {Array} from String array of sender
*@type {Array} to String array of recipents
*/
var mailOptions={
	from:['"Bishal Timilsina" <throwaway@gmail.com>'],
	to:['"Bishal Timilsina" <youremail@example.com>']
};


/**
*Config for mail server
*TODO: Add smpt and other config support
*@type {String} service Service defined by nodemailer for popular services
*@type {String} user Username of email
*@type {String} pass Password of email
*/
var mailConfig={
	service:"Gmail",
	auth:{
		user:"throwaway@gmail.com",
		pass:"dfafdasf"
	}
};

/**
*Git url
*@type {String} origin Git remote repository url uses origin if none specified
*@type {String} branch Branch name of remote repository
*/
var repo={
	origin:"origin",
	branch:"master"
};


/**
*Used to send log on email
*@type {String} serverLog Server log message on command execution, change to add headers to it
*/
var serverLog='';

/**
*Deploy the git updates
*/
function deploy(){

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
	}else if(platform.indexOf("wind32")!==-1){
		var pull=spawn("cmd",["/c","script.bat"],{cwd:`${__dirname}`});
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

		sendMail(subject,serverLog,function(err,info){
			if(err) console.error(`Error sending mail.\n ${err}`);
			else{
				console.dir(info);
				console.log("Mail sent to webmaster");
			}

			console.log(`Killing the server`);
			process.exit(0);
			
		});
		
	});

}

/**
*Log buffer data to console and store on serverLog for mail body
*@params {Buffer|String} data
*/
function out(data){
	console.log(`${data}`);
	serverLog+=data
}

/**
*Send mail to user about deployment
*@param {String} subject Subject of mail
*@param {String} message Message of mail body
*@param {sendMailCallback} callback Error as first param and response data as second param
*/
function sendMail(subject,message,callback){
	
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

/**
*Auto update according to set duration
*@param {Integer} duration Duration of interval in milliseconds
*/
function autoUpdate(duration){
	setInterval(function(){
		console.log("Running auto update");
		deploy();
	},duration);
}

//schedule auto update if auto is true
!update.auto || autoUpdate(update.duration);

/**
 * Module exports.
 * @public
 */

//functions
module.exports.deploy=deploy;

//variables
module.exports.update=update;
module.exports.repo=repo;
module.exports.mailConfig=mailConfig;
module.exports.mailOptions=mailOptions;
