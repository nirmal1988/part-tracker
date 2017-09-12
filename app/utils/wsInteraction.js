/*eslint-env node */
// ==================================
// incoming messages, look for type
// ==================================
var ibc = {};
var chaincode = {};
var ibc_parts = {};
var chaincode_parts = {};
var broadcast = null;
var app_cc_lib = null;
var known_height = 0;
var checkPeriodically = null;
var enrollInterval = null;

var winston = require('winston');								//logger module
var path = require('path');
var async = require("async");
var logger = new (winston.Logger)({
	level: 'debug',
	transports: [
		new (winston.transports.Console)({ colorize: true }),
	]
});

var helper = require(path.join(__dirname, './helper.js'))(process.env.creds_filename, logger);
var fcw = require('./fc_wrangler/index.js')({ block_delay: helper.getBlockDelay() }, logger);		//fabric client wrangler wraps the SDK

module.exports.setup = function(l_broadcast, l_app_cc_lib){
	// ibc = sdk;
	// chaincode = cc;

	broadcast = l_broadcast;
	app_cc_lib = l_app_cc_lib;

	// --- Keep Alive  --- //
	clearInterval(enrollInterval);
	enrollInterval = setInterval(function () {					//to avoid REQUEST_TIMEOUT errors we periodically re-enroll
		let enroll_options = helper.makeEnrollmentOptions(0);
		fcw.enroll(enroll_options, function (err, enrollObj2) {
			if (err == null) {
				//app_cc_lib = require(path.join(__dirname, './app_cc_lib.js'))(enrollObj2, opts, fcw, logger);
			}
		});														//this seems to be safe 3/27/2017
	}, helper.getKeepAliveMs());
};

module.exports.setupParts = function(sdk, cc){
	ibc_parts = sdk;
	chaincode_parts = cc;
};


module.exports.getAllParts = function(){
	var options = {
		peer_urls: [helper.getPeersUrl(first_peer)],		
		endorsed_hook: endorse_hook,
		ordered_hook: orderer_hook
	};
	return new Promise(
        function (resolve, reject) {
			app_cc_lib.getAllParts(options, function (err, resp) {
				if (err != null) reject(err);
				else {
					resolve({parts: resp.parsed.parts});
				}
			});			
		});
};

module.exports.getPart = function(partId){
	var options = {
		peer_urls: [helper.getPeersUrl(first_peer)],		
		endorsed_hook: endorse_hook,
		ordered_hook: orderer_hook
	};
	options.args = {
		partId: partId
	};
	return new Promise(
        function (resolve, reject) {
			app_cc_lib.getPart(options, function (err, resp) {
				if (err != null) reject(err);
				else {
					resolve(resp.parsed);
				}
			});			
		});
};

module.exports.updatePartDetails = function(part){
	var options = {
		peer_urls: [helper.getPeersUrl(first_peer)],		
		endorsed_hook: endorse_hook,
		ordered_hook: orderer_hook
	};
	options.args = {
		partId: part.partId, 
		vehicleId: part.vehicleId, 
		dateOfDelivery: part.dateOfDelivery, 
		dateOfInstallation: part.dateOfInstallation, 
		owner: part.owner, 
		warrantyStartDate: part.warrantyStartDate, 
		warrantyEndDate: part.warrantyEndDate, 
		ttype: part.tranType,
		vin: part.vin
	};
	
	return new Promise(
        function (resolve, reject) {
			app_cc_lib.updatePart(options, function (err, resp) {
				if (err != null) reject(err);
				else {
					resolve("true");
				}
			});			
		});
};

// endorsement stage callback
function endorse_hook(err) {
	if (err) sendMsg({ msg: 'tx_step', state: 'endorsing_failed' });
	//else sendMsg({ msg: 'tx_step', state: 'ordering' });
}

// ordering stage callback
function orderer_hook(err) {
	if (err) sendMsg({ msg: 'tx_step', state: 'ordering_failed' });
	//else sendMsg({ msg: 'tx_step', state: 'committing' });
}

const channel = helper.getChannelId();
const first_peer = helper.getFirstPeerName(channel);

module.exports.process_msg = function(ws, data, owner){
	var options = {
		peer_urls: [helper.getPeersUrl(first_peer)],
		ws: ws,
		endorsed_hook: endorse_hook,
		ordered_hook: orderer_hook
	};

	if(data.type == "chainstats"){
		console.log("Chainstats msg");
		app_cc_lib.channel_stats(null, cb_chainstats);
	}	
	else if(data.type == "createPart"){
		console.log("Create Part ", data, owner);
		if(data.part){
			console.log('Part manufacture date:'+data.part.dateOfManufacture);
			options.args = {
				partId: data.part.partId, 
				partCode: data.part.partCode, 
				dateOfManufacture: data.part.dateOfManufacture, 
				owner: owner,
				partType: data.part.partType,
				partName: data.part.partName,
				description: data.part.description
			};
			app_cc_lib.createPart(options, function (err, resp) {
				if (err != null) send_err(err, data);
				else {
					options.ws.send(JSON.stringify({ msg: 'partCreated', 
					partId: data.part.partId,
					state: 'finished' 
					}));
				}
			});
		}
	}
	else if(data.type == "updatePart"){
		console.log("Update Part ", data, owner);
		if(data.part){
			options.args = {
				partId: data.part.partId, 
				vehicleId: data.part.vehicleId, 
				dateOfDelivery: data.part.dateOfDelivery, 
				dateOfInstallation: data.part.dateOfInstallation, 
				owner: owner, 
				warrantyStartDate: data.part.warrantyStartDate, 
				warrantyEndDate: data.part.warrantyEndDate, 
				ttype: data.part.tranType,
				vin: data.part.vin
			};
			app_cc_lib.updatePart(options, function (err, resp) {
				if (err != null) send_err(err, data);
				else {
					options.ws.send(JSON.stringify({ msg: 'partUpdated', 
					partId: data.part.partId,
					state: 'finished' 
					}));
				}
			});
		}		
	}
	else if(data.type == "getPart"){
		console.log("Get Part", data.partId);
		options.args = {
			partId: data.partId
		};
		app_cc_lib.getPart(options, function (err, resp) {
			if (err != null) send_err(err, data);
			else {
				options.ws.send(JSON.stringify({ msg: 'part', 
				part: resp.parsed,
				state: 'finished' 
				}));
			}
		});
	}
	else if(data.type == "getAllParts"){
		console.log("Get All Parts", owner);
		app_cc_lib.getAllParts(options, function (err, resp) {
			if (err != null) send_err(err, data);
			else {
				options.ws.send(JSON.stringify({ msg: 'allParts', 
				parts: resp.parsed.parts,
				state: 'finished' 
				}));
			}
		});
	}

	//call back for getting a block's stats, lets send the chain/block stats
	function cb_blockstats(e, stats){
		if(chain_stats.height) stats.height = chain_stats.height - 1;
		sendMsg({msg: "chainstats", e: e, chainstats: chain_stats, blockstats: stats});
	}

	//send a message, socket might be closed...
	function sendMsg(json){
		if(ws){
			try{
				ws.send(JSON.stringify(json));
			}
			catch(e){
				console.log("error ws", e);
			}
		}
	}

	// endorsement stage callback
function endorse_hook(err) {
	if (err) sendMsg({ msg: 'tx_step', state: 'endorsing_failed' });
	else sendMsg({ msg: 'tx_step', state: 'ordering' });
}

// ordering stage callback
function orderer_hook(err) {
	if (err) sendMsg({ msg: 'tx_step', state: 'ordering_failed' });
	else sendMsg({ msg: 'tx_step', state: 'committing' });
}
	
	var blockHistoryHeight = 0;
	function cb_chainstats (err, resp) {
		var newBlock = false;
		if (err != null) {
			var eObj = {
				msg: 'error',
				e: err,
			};
			if (options.ws) options.ws.send(JSON.stringify(eObj)); 								//send to a client
			else broadcast(eObj);																//send to all clients
		} else {
			if (resp && resp.height && resp.height.low) {
				
				if (resp.height.low > known_height && known_height !=0) {
						logger.info('New block detected!', resp.height.low, resp);
						known_height = resp.height.low;
						newBlock = true;
						logger.debug('[checking] there are new things, sending to all clients');
						
						var g_options = {block_delay: helper.getBlockDelay()}
						app_cc_lib.query_block(resp.height.low-1,null, function (err, resp) {
							var newBlock = false;
							if (err != null) {
								var eObj = {
									msg: 'error',
									e: err,
								};
								if (options.ws) options.ws.send(JSON.stringify(eObj)); 								//send to a client
							} else {
								blockChain.push(resp.parsed);
								options.ws.send(JSON.stringify({ msg: 'newBlock', 
								blocks: resp.parsed,
								state: 'finished' 
								}));
							}
						});
					} else {
						known_height = resp.height.low;
						logger.debug('[checking] on demand req, sending to a client');
						for (var i=0;i<resp.height.low;i++){
							if(!blockChain[i])
								blockChain.push(null);
						}
						getBlockDetails(resp.height.low);
					}
				
			}
		}
	}

	var blockChain = [];
	function getBlockDetails(blockNumber){
		var g_options = {block_delay: helper.getBlockDelay()}
		app_cc_lib.query_block(blockNumber-1,null, function (err, resp) {
			if (err != null) {
				var eObj = {
					msg: 'error',
					e: err,
				};
				if (options.ws) options.ws.send(JSON.stringify(eObj)); 								//send to a client
			} else {
				blockChain[resp.parsed.block_id] = resp.parsed;
				blockHistoryHeight++;
				if(resp.parsed.block_id > 0 && (blockHistoryHeight < 10) ){
					
					getBlockDetails(resp.parsed.block_id);
				}
				else{
					options.ws.send(JSON.stringify({ msg: 'blockChain', 
					blocks: blockChain,
					state: 'finished' 
					}));
				}
			}
		});
	}
};

