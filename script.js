import { createClient } from 'redis';

// Function to add a new operator to the call center
async function addOperator(key, opLastName, opFirstName) {

  let client;

  const object = {
    Last_Name: opLastName,
    First_Name: opFirstName
  };

  try {
    client = await createClient().on('error', err => console.log('Redis Client Error', err)).connect();

    await client.hSet(key, object);
    console.log('Object successfully stocked');

  } catch (err) {
      console.error('Error during insertion:', err);

  } finally {await client.disconnect();}
}

// Function to add a new call to the call center
async function addCall(callHour, callPhoneNumber, callOperator, callDescription, callDuration = '0',callStatus = "Non asssigné") {

  let client;

  const object = {
    Time: callHour,
    Phone_Number: callPhoneNumber,
    Status : callStatus,
    Duration_In_Seconds : callDuration,
    Operator : callOperator,
    Description : callDescription
  };
  
  try {
    client = await createClient().on('error', err => console.log('Redis Client Error', err)).connect();

    const callId = await client.incr('call_id');
    const key = `call:${callId}`;

    await client.hSet(key, object);
    console.log('Object successfully stocked');

  } catch (err) {
      console.error('Error during insertion:', err);

  } finally {await client.disconnect();}
}

// Function to create random call duration
function randomDuration(offset) {
  let intOffset = parseInt(offset);
  let randomNumber = Math.random() * 300;
  return (intOffset + (Math.round(randomNumber * 10) / 10)).toString();
}

// Function to change the state of a call
async function changeCallState(callId_, Status_ = "Terminé"){
  
  let client;

  try {
    client = await createClient().on('error', err => console.log('Redis Client Error', err)).connect();
    
    const callStatus = await client.hGet(callId_, "Status");
    const callDuration = await client.hGet(callId_, "Duration_In_Seconds");

    if (Object.keys(callId_).length === 0) {
        console.log(`Call with ID ${callId_} does not exist.`);
        return;
    }

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

  } finally {await client.disconnect();}
}

export {addCall, addOperator, changeCallState};