/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// creating new part in blockchain
func createPart(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running createPart")

	if len(args) != 9 {
		fmt.Println("Incorrect number of arguments. Expecting 9 - PartId, Part Code, Manufacture Date, User, Part Type, Part Name, Description, Batch Code, QR Code")
		return shim.Error("Incorrect number of arguments. Expecting 9")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]);

	var bt Part
	bt.PartId 			= args[0]
	bt.PartCode			= args[1]
	bt.PartType			= args[4]
	bt.PartName			= args[5]
	bt.Description			= args[6]
	bt.BatchCode			= args[7]
	bt.QRCode			= args[8]
	var tx Transaction
	tx.DateOfManufacture		= args[2]
	tx.TType 			= "CREATE"
	tx.User 			= args[3]
	bt.Transactions = append(bt.Transactions, tx)

	//Commit part to ledger
	fmt.Println("createPart Commit Part To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.PartId, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	//Update All Parts Array
	allBAsBytes, err := stub.GetState("allParts")
	if err != nil {
		return shim.Error("Failed to get all Parts")
	}
	var allb AllParts
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all Parts")
	}
	allb.Parts = append(allb.Parts,bt.PartId)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allParts", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// Updating existing part in blockchain
func updatePart(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running updatePart")

	if len(args) != 9 {
		fmt.Println("Incorrect number of arguments. Expecting 9 - PartId, Vehicle Id, Delivery Date, Installation Date, User, Warranty Start Date, Warranty End Date, Type, vin")
		return shim.Error("Incorrect number of arguments. Expecting 9")
	}
	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]);

	//Get and Update Part data
	bAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to get Part #" + args[0])
	}
	var bch Part
	err = json.Unmarshal(bAsBytes, &bch)
	if err != nil {
		return shim.Error("Failed to Unmarshal Part #" + args[0])
	}

	var tx Transaction
	tx.TType 	= args[7];

	tx.VehicleId		= args[1]
	tx.DateOfDelivery	= args[2]
	tx.DateOfInstallation	= args[3]
	tx.User  		= args[4]
	tx.WarrantyStartDate	= args[5]
	tx.WarrantyEndDate	= args[6]
	tx.Vin	= args[8]

	bch.Transactions = append(bch.Transactions, tx)

	//Commit updates part to ledger
	fmt.Println("updatePart Commit Updates To Ledger");
	btAsBytes, _ := json.Marshal(bch)
	err = stub.PutState(bch.PartId, btAsBytes)
	if err != nil {		
		fmt.Println("error");
		return shim.Error(err.Error())
	}
	fmt.Println("success");
	return shim.Success(nil)
}