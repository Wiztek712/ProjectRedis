import { addCall, addOperator, changeCallState, changeCallOperator, listInProgressCalls } from "./script.js";

addOperator('Operator:44', 'Hamilton', 'Lewis')
addOperator('Operator:63', 'Russell', 'George')

/*addOperator('Operator:16', 'Leclerc', 'Charles')
addOperator('Operator:55', 'Sainz', 'Carlos')

addOperator('Operator:33', 'Verstappen', 'Max')
addOperator('Operator:11', 'Perez', 'Sergio')

addOperator('Operator:10', 'Gasly', 'Pierre')
addOperator('Operator:31', 'Ocon', 'Esteban')

addOperator('Operator:14', 'Alonso', 'Fernando')
addOperator('Operator:18', 'Stroll', 'Lance')

addOperator('Operator:4', 'Norris', 'Lando')
addOperator('Operator:81', 'Piastri', 'Oscar')

addOperator('Operator:22', 'Tsunoda', 'Yuki')
addOperator('Operator:40', 'Lawson', 'Liam')

addOperator('Operator:24', 'Zhou', 'Guanyu')
addOperator('Operator:77', 'Bottas', 'Valtteri')

addOperator('Operator:23', 'Albon', 'Alexander')
addOperator('Operator:43', 'Colapinto', 'Franco')

addOperator('Operator:27', 'Hulkenberg', 'Nico')
addOperator('Operator:20', 'Magnussen', 'Kevin')*/


addCall('8h12', '0781881212', 'Operator:44', 'Pole position');


// Calls can be turned into the following states: "Non pris en compte", "En cours" or "Terminé"
// changeCallState('call:2');
// changeCallState('call:20');
listInProgressCalls();
