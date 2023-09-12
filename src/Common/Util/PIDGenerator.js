import uuidv5 from "uuid/v5";

const namespace = "5ca4beb6-d0ad-5a95-b035-b3dc8d0ae493";
export default function generatePID(email) {
  if (email) {
    const id = email + "_" + new Date().getTime();
    const pId = uuidv5(id, namespace);
    return pId;
  } else {
    return "";
  }
}
export function generatePIDForWizLive(email, date, time, roomId) {
  if (email) {
    let id;
    if (time) {
      id = email + date + time + roomId;
    } else {
      id = email + date + roomId;
    }
    const pId = uuidv5(id, namespace);
    return pId;
  } else {
    return "";
  }
}
