'use strict';

const nodemailer=require('nodemailer');
const spawn=require('child_process').spawn;
const os=require('os');

var autoUpdate=true;
var duration=60*1000*60*5; //5 hours

var serverLog='';
function deploy(){


	console.log(`Execution path: ${process.cwd()}`);
	console.log('');
	console.log("Checking os platform");
	var platform=os.platform();

	console.log(`Platform: ${platform}`);
	if(platform.indexOf("linux")!==-1){
		var pull=spawn("./script.sh",[],{cwd:`${__dirname}`});
	}else{
		var pull=spawn("cmd",["/c","script.bat"],{cwd:`${__dirname}`});
	}

	
	pull.stdout.on("data",out);

	pull.stderr.on("data",out);

	pull.on('close', (code) => {
		console.log(`Child process exited with code ${code}`);
		var subject="Auto deployment of server completed";

		sendMail(subject,serverLog,function(err,info){
			if(err) console.err(`Error sending mail.\n${err}`);
			else{
				console.log("info");
				console.log("Mail sent to webmaster");
			}

			console.log(`Killing the server`);
			process.exit(0);
			
		});
		
	});

}

function out(data){
	console.log(`${data}`);
	serverLog+=data
}

//send mail to user about deployment
function sendMail(subject,message,callback){
	/*Send mail to the owner about the updates
	*Checking
	*/
	var transporter=nodemailer.createTransport({
		service:'gmail',
		auth:{
			user:"someemail@gmail.com",
			pass:'kfdasldfasi'
		}
	});

	var mailOptions={
		from:"Bishal Timilsina",
		to:"bishaltimilsina@gmail.com",
		subject: subject, // Subject line
	    text: `Server Log:\n ${message}`, // plaintext body
	    // html: '<b>Server log</b>' // html body
	}

	transporter.sendMail(mailOptions,function(err,info){
		if(err) callback(err);
		callback(null,info);
	});
}

function update(){
	setInterval(function(){
		console.log("interval");
	},duration);
}

!autoUpdate || update();

module.exports.deploy=deploy;
module.exports.setInterval=setInterval;