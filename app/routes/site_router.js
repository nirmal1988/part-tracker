/* global __dirname */
/*eslint-env node */
"use strict";
/* global process */
/*******************************************************************************
 * Copyright (c) 2015 IBM Corp.
 *
 * All rights reserved. 
 *
 * Contributors:
 *   David Huffman - Initial implementation
 *******************************************************************************/
var express = require("express");
var router = express.Router();
var fs = require("fs");
var setup = require("../setup.js");
var path = require("path");
var ibc = {};
var chaincode = {};
var ibc_parts = {};
var chaincode_parts = {};

var async = require("async");
var winston = require('winston');								//logger module
var path = require('path');
var enrollObj = null;
var logger = new (winston.Logger)({
	level: 'debug',
	transports: [
		new (winston.transports.Console)({ colorize: true }),
	]
});

var helper = require(path.join(__dirname, '../utils/helper.js'))(process.env.creds_filename, logger);
var fcw = require('../utils/fc_wrangler/index.js')({ block_delay: helper.getBlockDelay() }, logger);		//fabric client wrangler wraps the SDK

// Load our modules.
//var aux     = require("./site_aux.js");

var creds	= require("../user_creds.json");
var wsInteraction = require('../utils/wsInteraction.js');
enrollUser();
// ============================================================================================================================
// Home
// ============================================================================================================================
router.route("/").get(function(req, res){
	check_login(res, req);
	res.render("part2", {title: "Vehicle Manager", bag: {setup: setup, e: process.error, session: req.session}} );
});

router.route("/home").get(function(req, res){
	check_login(res, req);
	res.render("part2", {title: "Vehicle Manager", bag: {setup: setup, e: process.error, session: req.session}} );
});
router.route("/part").get(function(req, res){
	check_login(res, req);
	res.render("part2", {title: "Vehicle Manager", bag: {setup: setup, e: process.error, session: req.session}} );
});
router.route("/updatePart").get(function(req, res){
	check_login(res, req);
	res.render("part2", {title: "Vehicle Manager", bag: {setup: setup, e: process.error, session: req.session}} );
});
router.route("/dashboard").get(function(req, res){
	check_login(res, req);
	res.render("part2", {title: "Vehicle Manager", bag: {setup: setup, e: process.error, session: req.session}} );
});

router.route("/getPart").post(function(req, res){

	chaincode.query.getPart([req.body.partId], function (e, part){
		if(e != null){
			console.log("Get Part error", e);
			res.send(e);
		}
		else{
			res.send(part);
		}
	})
});


router.route("/getAllParts").get(function(req, res){
	var promise = wsInteraction.getAllParts();
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.route("/login").get(function(req, res){
	res.render("login", {title: "Login", bag: {setup: setup, e: process.error, session: req.session}} );
});

router.route("/logout").get(function(req, res){
	req.session.destroy();
	res.redirect("/login");
});

router.route("/:page").post(function(req, res){
	req.session.error_msg = "Invalid username or password";
	
	for(var i in creds){
		if(creds[i].username == req.body.username){
			if(creds[i].password == req.body.password){
				console.log("user has logged in", req.body.username);
				req.session.username = req.body.username;
				req.session.error_msg = null;

				// Roles are used to control access to various UI elements
				if(creds[i].role) {
					console.log("user has specific role:", creds[i].role);
					req.session.user_role = creds[i].role;
				} else {
					console.log("user role not specified, assuming:", "user");
					req.session.user_role = "user";
				}
				
				if(req.session.user_role == "CUSTOMER"){
					res.redirect("/customerVehicle");
				}
				else{
					res.redirect("/part");
				}
				
				return;
			}
			break;
		}
	}
	res.redirect("/login");
});

module.exports = router;



function check_login(res, req){
	if(!req.session.username || req.session.username == ""){
		console.log("! not logged in, redirecting to login");
		res.redirect("/login");
	}
}


module.exports.setup = function(sdk, cc){
	ibc = sdk;
	chaincode = cc;
};

module.exports.setupParts = function(sdk, cc){
	ibc_parts = sdk;
	chaincode_parts = cc;
};

function enrollUser(){
	fcw.enroll(helper.makeEnrollmentOptions(0), function (errCode, obj) {
		if (errCode != null) {
			logger.error('could not enroll...');
		} else {
			enrollObj = obj;			
		}
	});
}
