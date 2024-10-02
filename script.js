import { createClient } from 'redis';

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

async function addCall(key, callHour, callPhoneNumber, callStatus, callDuration, callOperator, callDescription) {

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

    await client.hSet(key, object);
    console.log('Object successfully stocked');

  } catch (err) {
      console.error('Error during insertion:', err);

  } finally {await client.disconnect();}
}

addOperator('utilisateur:1001', "Griezmann", "Antoine");
addCall('call:1001', '8h12', '0781881212', 'En cours', '75', 'utilisateur:1001', 'Appel pour une pizza')