/*eslint-env node */
/* global process */
/*******************************************************************************
 * Copyright (c) 2015 IBM Corp.
 *
 * All rights reserved. 
 *
 * Contributors:
 *   David Huffman - Initial implementation
 *******************************************************************************/
//Environments are either:
// 	1 - Bluemix Production
// 	2 - Bluemix Development
// 	3 - Localhost Development

//var vcap_app = {application_uris: []};						//default blank
//var ext_uri = '';

var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var azureVM_URL = "win10dv31190.cloudapp.net:3000"; //"win10dv35865.cloudapp.net:3000";
//var host =  appEnv.bind;
var host =  azureVM_URL; 
var port = appEnv.port;

var vcap_app = {application_uris: [ appEnv.url.split("//")[1] ]};						//default blank
//var vcap_app = {application_uris: [host]};						//default blank
//var ext_uri = vcap_app.application_uris[0];
var ext_uri = azureVM_URL;

console.log("appEnv : ", ext_uri, "->", host, ":", port);

exports.SERVER = 	{
							HOST:host,
							PORT: port,
							DESCRIPTION: 'Bluemix environment',
							EXTURI: ext_uri,
						 };

exports.SERVER.vcap_app = vcap_app;

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////     Common     ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
exports.DEBUG = vcap_app;
exports.USER1 = 'bob';									//left username
exports.USER2 = 'leroy';								//right username


/*
 if(process.env.VCAP_APPLICATION){
	vcap_app = JSON.parse(process.env.VCAP_APPLICATION);
	for(var i in vcap_app.application_uris){
		if(vcap_app.application_uris[i].indexOf(vcap_app.name) >= 0){
			ext_uri = vcap_app.application_uris[i];
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////    2. Bluemix Development    ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
else if(process.env.VCAP_APP_HOST){
		exports.SERVER = 	{	
								HOST: process.env.VCAP_APP_HOST,
								PORT: process.env.VCAP_APP_PORT,
								DESCRIPTION: 'Bluemix - Development',
								EXTURI: ext_uri,
							 };
}

////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////     3. Localhost - Development    ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
else{
	exports.SERVER = 	{
							HOST:'localhost',
							PORT: 3000,
							DESCRIPTION: 'Localhost',
							EXTURI: process.env.EXTURI || 'localhost:3000',
						 };
}

exports.SERVER.vcap_app = vcap_app;

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////     Common     ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
exports.DEBUG = vcap_app;
exports.USER1 = 'bob';									//left username
exports.USER2 = 'leroy';								//right username
*/