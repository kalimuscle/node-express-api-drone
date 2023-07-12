import {getConnection}  from './db.js';


export const logDroneBatteryLevels = async () => {

  const db = await getConnection();

  await db.read();

  let {drones} = db.data;
  let dronesBatteriesCapacity = [];
  const timestamp = new Date().toISOString();
  const eventLog = `Battery levels checked for drones at ${timestamp}`;
  console.log(eventLog);

  console.table(drones, ["serial_number","battery_capacity"] )
}
