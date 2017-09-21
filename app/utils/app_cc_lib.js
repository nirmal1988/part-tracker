//-------------------------------------------------------------------
// Chaincode Library
//-------------------------------------------------------------------
var QRCode = require('qrcode');

module.exports = function (enrollObj, g_options, fcw, logger) {
	var app_chainCode = {};

	// Chaincode -------------------------------------------------------------------------------

	//check if chaincode exists
	app_chainCode.check_if_already_instantiated = function (options, cb) {
		console.log('');
		logger.info('Checking for chaincode...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			cc_function: 'read',
			cc_args: ['selftest']
		};
		fcw.query_chaincode(enrollObj, opts, function (err, resp) {
			if (err != null) {
				if (cb) return cb(err, resp);
			}
			else {
				if (resp.parsed == null || isNaN(resp.parsed)) {	 //if nothing is here, no chaincode
					if (cb) return cb({ error: 'chaincode not found' }, resp);
				}
				else {
					if (cb) return cb(null, resp);
				}
			}
		});
	};

	//check chaincode version
	app_chainCode.check_version = function (options, cb) {
		console.log('');
		logger.info('Checking chaincode and ui compatibility...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			cc_function: 'read',
			cc_args: ['']
		};
		fcw.query_chaincode(enrollObj, opts, function (err, resp) {
			if (err != null) {
				if (cb) return cb(err, resp);
			}
			else {
				if (resp.parsed == null) {							//if nothing is here, no chaincode
					if (cb) return cb({ error: 'chaincode not found' }, resp);
				}
				else {
					if (cb) return cb(null, resp);
				}
			}
		});
	};

	//create part
	app_chainCode.createPart = function (options, cb) {
		console.log('');
		logger.info('Creating Vehicle...');
		QRCode.toDataURL(options.args.partId, { errorCorrectionLevel: 'H' }, function (err, url) {
			console.log(url)
			var opts = {
				peer_urls: g_options.peer_urls,
				peer_tls_opts: g_options.peer_tls_opts,
				channel_id: g_options.channel_id,
				chaincode_id: g_options.chaincode_id,
				chaincode_version: g_options.chaincode_version,
				event_url: g_options.event_url,
				endorsed_hook: options.endorsed_hook,
				ordered_hook: options.ordered_hook,
				cc_function: 'createPart',
				cc_args: [
					options.args.partId,
					options.args.partCode,
					options.args.dateOfManufacture,
					options.args.owner,
					options.args.partType,
					options.args.partName,
					options.args.description,
					options.args.batchCode,
					url
				],
			};
			fcw.invoke_chaincode(enrollObj, opts, cb);
		});
	};

	//update part
	app_chainCode.updatePart = function (options, cb) {
		console.log('');
		logger.info('Creating Vehicle...');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_url: g_options.event_url,
			endorsed_hook: options.endorsed_hook,
			ordered_hook: options.ordered_hook,
			cc_function: 'updatePart',
			cc_args: [
				options.args.partId,
				options.args.vehicleId,
				options.args.dateOfDelivery,
				options.args.dateOfInstallation,
				options.args.owner,
				options.args.warrantyStartDate,
				options.args.warrantyEndDate,
				options.args.ttype,
				options.args.vin
			],
		};
		fcw.invoke_chaincode(enrollObj, opts, cb);
	};

	//get part
	app_chainCode.getPart = function (options, cb) {
		logger.info('fetching part');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_version: g_options.chaincode_version,
			chaincode_id: g_options.chaincode_id,
			cc_function: 'getPart',
			cc_args: [options.args.partId]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	//get all parts
	app_chainCode.getAllParts = function (options, cb) {
		logger.info('fetching all parts');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_version: g_options.chaincode_version,
			chaincode_id: g_options.chaincode_id,
			cc_function: 'getAllParts',
			cc_args: [""]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	app_chainCode.getAllPartDetails = function (options, cb) {
		logger.info('fetching all part details');

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_version: g_options.chaincode_version,
			chaincode_id: g_options.chaincode_id,
			cc_function: 'getAllPartDetails',
			cc_args: [options.args.filter, options.args.filterValue]
		};
		fcw.query_chaincode(enrollObj, opts, cb);
	};

	// //register a owner/user
	// app_chainCode.register_owner = function (options, cb) {
	// 	console.log('');
	// 	logger.info('Creating a owner...');

	// 	var opts = {
	// 		peer_urls: g_options.peer_urls,
	// 		peer_tls_opts: g_options.peer_tls_opts,
	// 		channel_id: g_options.channel_id,
	// 		chaincode_id: g_options.chaincode_id,
	// 		chaincode_version: g_options.chaincode_version,
	// 		event_url: g_options.event_url,
	// 		endorsed_hook: options.endorsed_hook,
	// 		ordered_hook: options.ordered_hook,
	// 		cc_function: 'init_owner',
	// 		cc_args: [
	// 			'o' + leftPad(Date.now() + randStr(5), 19),
	// 			options.args.marble_owner,
	// 			options.args.owners_company
	// 		],
	// 	};
	// 	fcw.invoke_chaincode(enrollObj, opts, function (err, resp) {
	// 		if (cb) {
	// 			if (!resp) resp = {};
	// 			resp.id = opts.cc_args[0];				//pass owner id back
	// 			cb(err, resp);
	// 		}
	// 	});
	// };
	
	// get block height of the channel
	app_chainCode.channel_stats = function (options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts
		};
		fcw.query_channel(enrollObj, opts, cb);
	};

	app_chainCode.query_block = function (blockNumber, options, cb) {
		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			block_id: blockNumber
		};
		fcw.query_block(enrollObj, opts, cb);
	};

	// random string of x length
	function randStr(length) {
		var text = '';
		var possible = 'abcdefghijkmnpqrstuvwxyz0123456789ABCDEFGHJKMNPQRSTUVWXYZ';
		for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}

	// left pad string with "0"s
	function leftPad(str, length) {
		for (var i = str.length; i < length; i++) str = '0' + String(str);
		return str;
	}

	return app_chainCode;
};

