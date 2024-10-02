import { createClient } from 'redis';

async function doesThisOperatorExist(key) {

  let client;

  try {
      client = await createClient().on('error', err => console.log('Redis Client Error', err)).connect();

      const exists = await client.exists(key);
      await client.disconnect();
      return exists === 1;

  } catch (err) {
      console.error('Error during verification', err);
      await client.disconnect();
      return false;
  }
}

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

async function addCall(callHour, callPhoneNumber, callStatus, callDuration, callOperator, callDescription) {

  let client;

  if(await doesThisOperatorExist(callOperator)){
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

  } else {

    console.log('This operator does not exist.')
  }
}


export {addCall, addOperator};