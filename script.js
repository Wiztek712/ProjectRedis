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
async function addCall(callHour, callPhoneNumber, callDescription, callDuration = '0',callStatus = "Non asssigne") {

  let client;

  // Call's fields
  const object = {
    Time: callHour,
    Phone_Number: callPhoneNumber,
    Status : callStatus,
    Duration_In_Seconds : callDuration,
    Operator : "",
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
  let InProgressCalls = [];
  try {
    client = await createClient().on('error', err => console.log('Redis Client Error', err)).connect();

    const keys = await client.keys('call:*');
    for (let key in keys) {
      let call_id = "call:" + key;
      const callData = await client.hGetAll(call_id);
      if(callData.Status === "En cours"){
        console.log("call id : ", call_id);
        console.log("Description : ", callData.Description);
        console.log("Operator in charge : ", callData.Operator);
        InProgressCalls.push(callData);
      } 
    }
  } catch (err) {
      console.error('Error during insertion:', err);
  } finally { await client.disconnect(); }
}

export {addCall, addOperator, changeCallState, listInProgressCalls, changeCallOperator};

