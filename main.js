import { addCall, addOperator, changeCallState, listInProgressCalls, changeCallOperator, listInProgressCallsByOperator, displayListInProgressCalls } from "./script.js";


//Initialisation (uncomment if laready executed once)

await addOperator('Operator:44', 'Hamilton', 'Lewis');
await addOperator('Operator:63', 'Russell', 'George');

await addOperator('Operator:16', 'Leclerc', 'Charles');
await addOperator('Operator:55', 'Sainz', 'Carlos');

await addCall('9h30', '0781456789', 'Fastest Lap', "18", "En cours", "Operator:44");
await addCall('10h45', '0781234567', 'Race Finish', "45", "Termine", "Operator:44");
await addCall('11h15', '0781987654', 'Safety Car Deployment', "0", "Non pris en compte");

await addCall('8h45', '0781345678', 'Pit Stop Request', "18", "En cours", "Operator:63");
await addCall('9h50', '0781543298', 'Track Position Inquiry', "26", "En cours", "Operator:63");
await addCall('10h20', '0781456789', 'Fuel Status Check', "6", "Termine", "Operator:63");

await addCall('8h55', '0781238901', 'Tire Pressure Issue', "18", "En cours", "Operator:16");
await addCall('9h25', '0781789456', 'Lap Time Update', "49", "Termine", "Operator:16");
await addCall('10h10', '0781345698', 'Overtake Attempt');

await addCall('9h05', '0781222333', 'Mechanical Issue', "0", "Non pris en charge");
await addCall('9h45', '0781678954', 'Strategy Change Request', "0", "Non pris en charge");
await addCall('10h30', '0781987123', 'Team Radio Problem', "150", "En cours", "Operator:55");

// Initialisation finished

// Put your functions below
await changeCallState("call:6");
await changeCallState("call:9", "Termine");
await changeCallOperator("call:6", "Operator:44");
await changeCallOperator("call:6", "Operator:2");
await changeCallState("call:20");
let list = await listInProgressCalls();
console.log("Display the list of ongoing calls");
displayListInProgressCalls(list);
console.log("Display the list of ongoing calls for operator 44");
await listInProgressCallsByOperator("Operator:44");