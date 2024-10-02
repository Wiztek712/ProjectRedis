import { createClient } from 'redis';

// Function to add a new operator to the call center
async function addOperator(key, opLastName, opFirstName) {

  let client;

  // Operator's fields
  const object = {
    Last_Name: opLastName,
    First_Name: opFirstName
  };

  try {
    // Connection to database
    client = await createClient().on('error', err => console.log('Redis Client Error', err)).connect();

    await client.hSet(key, object); // Filling database with the Operator and it's key
    console.log('Object successfully stocked');

  } catch (err) {
      console.error('Error during insertion:', err);

  } finally {await client.disconnect();} // Deconnection from database
}

// Function to check if the operator exists (used in addCall in order to assign a valid operator to a call)
async function doesThisOperatorExist(key) {

  let client;

  try {
    // Connection to database
    client = await createClient().on('error', err => console.log('Redis Client Error', err)).connect();

    const exists = await client.exists(key);
    await client.disconnect(); // Deconnection from database
    return exists === 1; // Return True if the operator exists and False if it doesn't exist

  } catch (err) {
    console.error('Error during verification', err);
    await client.disconnect(); // Deconnection from database
    return false;
  }
}

// Function to add a new call to the call center
async function addCall(callHour, callPhoneNumber, callDescription, callDuration = '0',callStatus = "Non asssigne", callOperator = "") {

  let client;

  // Call's fields
  const object = {
    Time: callHour,
    Phone_Number: callPhoneNumber,
    Status : callStatus,
    Duration_In_Seconds : callDuration,
    Operator : callOperator,
    Description : callDescription
  };
  
  try {
    // Connection to database
    client = await createClient().on('error', err => console.log('Redis Client Error', err)).connect();

    // CallId incrementation
    const callId = await client.incr('call_id');
    const key = `call:${callId}`;

    await client.hSet(key, object); // Filling database with the Operator and it's key
    console.log('Object successfully stocked');

  } catch (err) {
      console.error('Error during insertion:', err);

  } finally {await client.disconnect();} // Deconnection from database
}

// Function to create random call duration
function randomDuration(offset) {
  let intOffset = parseInt(offset);
  let randomNumber = Math.random() * 300;
  return (intOffset + (Math.round(randomNumber * 10) / 10)).toString();
}

// Function to change the state of a call
// Calls can be turned into the following states: "Non pris en compte", "En cours" or "Termine"
async function changeCallState(callId_, Status_ = "Termine"){
  
  let client;

  try {
    // Connection to database
    client = await createClient().on('error', err => console.log('Redis Client Error', err)).connect();
    
    // Getting the status and the duration
    const callStatus = await client.hGet(callId_, "Status");
    const callDuration = await client.hGet(callId_, "Duration_In_Seconds");

    // Checking if the callId exists
    if (Object.keys(callId_).length === 0) {
        console.log(`Call with ID ${callId_} does not exist.`);
        return;
    }

    // Checking if fields are valid
    if (!callStatus || !callDuration) {
      console.log(`Call with ID ${callId_} does not exist or has incomplete data.`);
      return;
  }

  // Update the duration with a random value
  let newDuration = randomDuration(callDuration);

  // Update the status and duration back in Redis
  await client.hSet(callId_, "Status", Status_);
  await client.hSet(callId_, "Duration_In_Seconds", newDuration);

  console.log(`Call ${callId_} updated with Status: ${Status_} and Duration: ${newDuration}`);


  } catch (err) {
      console.error('Error during insertion:', err);

  } finally {await client.disconnect();} // Deconnection from database
}

// Function to change the Operator of a call
async function changeCallOperator(callId_, operator_){
  
  // We check if the Operator exists (or if we want to remove the Operator)
  if(await doesThisOperatorExist(operator_) || operator_==""){
    let client;

    try {
      // Connection to database
      client = await createClient().on('error', err => console.log('Redis Client Error', err)).connect();

      // Checking if the callId exists
      if (Object.keys(callId_).length === 0) {
          console.log(`Call with ID ${callId_} does not exist.`);
          return;
      }

      // Update the status and duration back in Redis
      await client.hSet(callId_, "Operator", operator_);


    } catch (err) {
        console.error('Error during insertion:', err);

    } finally {
      await client.disconnect(); // Deconnection from database
    }

  } else {
    console.log('This operator does not exist.');
  }
  return;
}

// Function to retrieve in progress calls
async function listInProgressCalls(){
  
  let client;
  let InProgressCalls = []; // At the end we return a list of the calls

  try {
    client = await createClient().on('error', err => console.log('Redis Client Error', err)).connect();

    // List all the calls from their id
    const keys = await client.keys('call:*');
    for (let key in keys) {
      let call_id = "call:" + key; // key only has the number, we have to add "call:" to it
      const callData = await client.hGetAll(call_id);
      if(callData.Status === "En cours"){
        // only retrieve call that are marked 'En cours"
        InProgressCalls.push(callData);
      } 
    }
    // return the list
    return InProgressCalls;
  } catch (err) {
      console.error('Error during insertion:', err);
  } finally { await client.disconnect(); }
}

// Function to display the calls that are in progress with some info
function displayListInProgressCalls(list){
  for (let i = 0; i < list.length; i++) {
    let element = list[i]
    console.log("Operator in charge :", element.Operator);
    console.log("Since", element.Duration_In_Seconds, "seconds");
    console.log("Description :", element.Description);
  }; 
}

// Function to retrieve every in progress calls for a peticular operator
async function listInProgressCallsByOperator(Operator_){

  // Retrieve the list if in progress calls
  let listCalls = await listInProgressCalls();
  let client;

  try {
    client = await createClient().on('error', err => console.log('Redis Client Error', err)).connect();
    // Looking for calls that involve the operator
    let oneTimeDisplayOperator = 0; // In order to know if the operator has calls and for displaying its name one time only.
    for (let i = 0; i < listCalls.length; i++) {
      let element = listCalls[i]
      if(element.Operator === Operator_){
        oneTimeDisplayOperator++; 
        if (oneTimeDisplayOperator === 1){ // For diplaying its name only at beginning of all its calls.
          console.log("List of ongoing calls for Operator", Operator_);
        }
        console.log("In communication since", element.Duration_In_Seconds, "seconds");
        console.log("Description :", element.Description);
      }
    }
    if(oneTimeDisplayOperator === 0){ // Inform the user if the operator has no calls
      console.log(Operator_, "has no calls ongoing");
    }
  } catch (err) {
      console.error('Error during insertion:', err);
  } finally { await client.disconnect(); }
}

export {addCall, addOperator, changeCallState, listInProgressCalls, changeCallOperator, listInProgressCallsByOperator, displayListInProgressCalls};
