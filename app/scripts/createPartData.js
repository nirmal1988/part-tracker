var winston = require('winston');								//logger module
var path = require('path');

// --- Set Our Things --- //
var logger = new (winston.Logger)({
	level: 'debug',
	transports: [
		new (winston.transports.Console)({ colorize: true }),
	]
});

var args = process.argv.slice(2);
var config_file = 'app_local.json';
if (args[0]) {
	config_file = args[0];
	logger.info('Config file passed in as argument');
	logger.info('Using custom config file', config_file);
} else {
	logger.info('Using default config file', config_file);	
}

var helper = require(path.join(__dirname, '../utils/helper.js'))(config_file, logger);			//set the config file name here
var fcw = require(path.join(__dirname, '../utils/fc_wrangler/index.js'))({ block_delay: helper.getBlockDelay() }, logger);
logger.info('First we enroll');
fcw.enrollWithAdminCert(helper.makeEnrollmentOptionsUsingCert(0), function (enrollErr, enrollResp) {
	if (enrollErr != null) {
		logger.error('error enrolling', enrollErr, enrollResp);
	} else {
		console.log('---------------------------------------');
		logger.info('Now we insert data');
		console.log('---------------------------------------');

		const channel = helper.getChannelId();
		const first_peer = helper.getFirstPeerName(channel);
		
		
		var g_options = helper.makeAppLibOptions();

		var opts = {
			peer_urls: g_options.peer_urls,
			peer_tls_opts: g_options.peer_tls_opts,
			channel_id: g_options.channel_id,
			chaincode_id: g_options.chaincode_id,
			chaincode_version: g_options.chaincode_version,
			event_url: g_options.event_url,
			endorsed_hook: function(err) {
				//if (err) sendMsg({ msg: 'tx_step', state: 'endorsing_failed' });
				//else sendMsg({ msg: 'tx_step', state: 'ordering' });
			},
			ordered_hook: function(err) {
				//if (err) sendMsg({ msg: 'tx_step', state: 'ordering_failed' });
				//else sendMsg({ msg: 'tx_step', state: 'committing' });
			},
			cc_function: 'createPart',
			//Expecting 7 - PartId, Part Code, Manufacture Date, User, Part Type, Part Name, Description
			//cc_args: ["P001", "C001", "01-01-2017","BMW","Test","Break","Test"],
		};
   
var partData = [
	{
		partId: "11761716360", 
		partCode: "AF5534", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Air Intake Parts",
		partName: "BMW Secondary Air Pump Kit (540i)",
		description: "BMW Secondary Air Pump Kit (540i)"
	},
	{
		partId: "11761716361", 
		partCode: "AF5534", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Air Intake Parts",
		partName: "BMW Turbocharger Installation Kit",
		description: "BMW Turbocharger Installation Kit"
	},
	{
		partId: "11761716362", 
		partCode: "AF5534", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Air Intake Parts",
		partName: "BMW Mass Air Flow Sensor - Bosch",
		description: "BMW Mass Air Flow Sensor - Bosch"
	},
	{
		partId: "11761716363", 
		partCode: "AF5535", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Body Exterior Parts",
		partName: "BMW Lug Bolt Kit (Set of 20)",
		description: "BMW Lug Bolt Kit (Set of 20)"
	},
	{
		partId: "11761716364", 
		partCode: "AF5535", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Body Exterior Parts",
		partName: "BMW Black Chrome Fender Grille Set",
		description: "BMW Black Chrome Fender Grille Set"
	},
	{
		partId: "11761716365", 
		partCode: "AF5535", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Body Exterior Parts",
		partName: "BMW Tail Light Repair Kit",
		description: "BMW Tail Light Repair Kit"
	},
	{
		partId: "11761716366", 
		partCode: "AF5536", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Body Interior Parts",
		partName: "BMW Ambient Temperature Sensor Repair Kit",
		description: "BMW Ambient Temperature Sensor Repair Kit"
	},
	{
		partId: "11761716367", 
		partCode: "AF5536", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Body Interior Parts",
		partName: "BMW Carbon Fiber Interior Trim Kit",
		description: "BMW Carbon Fiber Interior Trim Kit"
	},
	{
		partId: "11761716368", 
		partCode: "AF5536", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Body Interior Parts",
		partName: "BMW Speed Sensor - Bosch",
		description: "BMW Speed Sensor - Bosch"
	},
	{
		partId: "11761716369", 
		partCode: "AF5537", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Brake Parts",
		partName: "BMW Brake Kit - Brembo/Akebono",
		description: "BMW Brake Kit - Brembo/Akebono"
	},
	{
		partId: "11761716370", 
		partCode: "AF5537", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Brake Parts",
		partName: "BMW Brake Kit - Zimmermann/Textar",
		description: "BMW Brake Kit - Zimmermann/Textar"
	},
	{
		partId: "11761716371", 
		partCode: "AF5537", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Brake Parts",
		partName: "BMW Brake Kit with Lines - Akebono/Brembo",
		description: "BMW Brake Kit with Lines - Akebono/Brembo"
	},
	{
		partId: "11761716372", 
		partCode: "AF5538", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Climate Control Parts",
		partName: "BMW A/C Compressor - Denso",
		description: "BMW A/C Compressor - Denso"
	},
	{
		partId: "11761716373", 
		partCode: "AF5538", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Climate Control Parts",
		partName: "BMW Blower Motor Resistor (E38) - Rein",
		description: "BMW Blower Motor Resistor (E38) - Rein"
	},
	{
		partId: "11761716374", 
		partCode: "AF5538", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Climate Control Parts",
		partName: "BMW Heater Hose (E30) - OEM Rein",
		description: "BMW Heater Hose (E30) - OEM Rein"
	},
	{
		partId: "11761716375", 
		partCode: "AF5539", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Clutch Parts",
		partName: "BMW Clutch Installation Kit",
		description: "BMW Clutch Installation Kit"
	},
	{
		partId: "11761716376", 
		partCode: "AF5539", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Clutch Parts",
		partName: "BMW Dual Mass Flywheel - LuK",
		description: "BMW Dual Mass Flywheel - LuK"
	},
	{
		partId: "11761716377", 
		partCode: "AF5539", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Clutch Parts",
		partName: "BMW Bell Housing Bolt Set - OEM Rein",
		description: "BMW Bell Housing Bolt Set - OEM Rein"
	},
	{
		partId: "11761716378", 
		partCode: "AF5540", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Cooling System Parts",
		partName: "BMW Water Pump Replacement Kit",
		description: "BMW Water Pump Replacement Kit"
	},
	{
		partId: "11761716379", 
		partCode: "AF5540", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Cooling System Parts",
		partName: "BMW E46 Cooling System Overhaul Kit",
		description: "BMW E46 Cooling System Overhaul Kit"
	},
	{
		partId: "11761716380", 
		partCode: "AF5540", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Cooling System Parts",
		partName: "BMW Coolant Hose Kit (E38 750iL)",
		description: "BMW Coolant Hose Kit (E38 750iL)"
	},
	{
		partId: "11761716381", 
		partCode: "AF5541", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Drive Belts Parts",
		partName: "BMW Accessory Drive Belt Kit",
		description: "BMW Accessory Drive Belt Kit"
	},
	{
		partId: "11761716382", 
		partCode: "AF5541", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Drive Belts Parts",
		partName: "BMW A/C Drive Belt Kit",
		description: "BMW A/C Drive Belt Kit"
	},
	{
		partId: "11761716383", 
		partCode: "AF5541", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Drive Belts Parts",
		partName: "BMW Belt Tensioner (X5) - INA",
		description: "BMW Belt Tensioner (X5) - INA"
	},
	{
		partId: "11761716384", 
		partCode: "AF5542", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Driveshaft and Axle Parts",
		partName: "BMW Drive Shaft Flex Joint Kit",
		description: "BMW Drive Shaft Flex Joint Kit"
	},
	{
		partId: "11761716385", 
		partCode: "AF5542", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Driveshaft and Axle Parts",
		partName: "BMW Wheel Hub Assembly Front - FAG",
		description: "BMW Wheel Hub Assembly Front - FAG"
	},
	{
		partId: "11761716386", 
		partCode: "AF5542", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Driveshaft and Axle Parts",
		partName: "BMW Wheel Bearing Rear - FAG",
		description: "BMW Wheel Bearing Rear - FAG"
	},
	{
		partId: "11761716387", 
		partCode: "AF5543", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Engine Electrical Parts",
		partName: "BMW Ignition Coil Kit (Set of 8) - Bosch",
		description: "BMW Ignition Coil Kit (Set of 8) - Bosch"
	},
	{
		partId: "11761716388", 
		partCode: "AF5543", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Engine Electrical Parts",
		partName: "BMW Spark Plug Kit (Set of 10)",
		description: "BMW Spark Plug Kit (Set of 10)"
	},
	{
		partId: "11761716389", 
		partCode: "AF5543", 
		batchCode: "09182017", 
		dateOfManufacturer: "2017-09-18", 
		user: "BMW", 
		partType: "Engine Electrical Parts",
		partName: "MW Ignition Coil Kit (Set of 6)",
		description: "MW Ignition Coil Kit (Set of 6)"
	}
];

var _o = 0;
insertData();	
function insertData(){	
	console.log("Insert part data # ", _o);
	if(_o >= partData.length){
		console.log("insert complete");
		return;
	}
	opts.cc_args = [
		partData[_o].partId, 
		partData[_o].partCode,
		//partData[_o].batchCode,
		partData[_o].dateOfManufacturer,
		partData[_o].user,
		partData[_o].partType,
		partData[_o].partName,
		partData[_o].description
	];	
	fcw.invoke_chaincode(enrollResp, opts, function (err, resp) {
		_o++;
		logger.info( _o.partId +'done. Errors:', (!err) ? 'nope' : err);
		insertData();
	});	
}




		// fcw.instantiate_chaincode(enrollResp, opts, function (err, resp) {
		// 	console.log('---------------------------------------');
		// 	logger.info('Instantiate done. Errors:', (!err) ? 'nope' : err);
		// 	console.log('---------------------------------------');
		// });
	}




});

