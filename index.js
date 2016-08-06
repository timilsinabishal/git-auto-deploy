'user strict';

const spawn=require('child_process').spawn;
const os=require('os');

deploy();
function deploy(url,cmd,callback){

	console.log("checking os platform");
	console.log(`execution path: ${process.cwd()}`)
	var platform=os.platform();

	console.log(`platform: ${__dirname}`);
	if(platform.indexOf("linux")!==-1){
		var pull=spawn("script.sh",[`${__dirname}`]);
	}else{
		var pull=spawn("cmd",["/c","script.bat"]);
	}

	
	pull.stdout.on("data",(data) => {
		console.log(`stdout: ${data}`);
	});

	pull.stderr.on("data",(data) => {
		console.log(`stderr: ${data}`);
	});

	pull.on('close', (code) => {
		console.log(`Child process exited with code ${code}`);
	});

}

function out(data){
	console.log(data);
}

module.exports=deploy;