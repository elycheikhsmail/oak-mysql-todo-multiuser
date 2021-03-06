import { Context, Status } from "../deps-managed.ts";
import { getDb } from "../../config/mysql/dbclient.ts";
//---------------------------------------------
import { getBearerTokenPayload } from "../../config/getBareerToken.ts";
//------------------------------------------------


export async function taskListCtr(ctx: Context) {
  // Default variable for minimise if else in code
  let isReady = true;
  // Default variable  details in response when inspect behavur happed
  let details = "";
  //--------------------------------------------------------------------
  const dataFromClient = await getBearerTokenPayload(ctx);
  if (!dataFromClient.isValide) {
    isReady = false;
    details = dataFromClient.details;
  }
  //--------------------------------------------------------------

  // default tasks
  let tasks = [];
  // get data from db
  try {
    const sql = "SELECT  id , text FROM task WHERE ownerId = ? ";
    const args = [dataFromClient.userId]
    const db = await getDb();
    tasks = await db.query(sql,args);
    await db.close() 
  } catch (_error) {
    isReady = false;
    details = "some errors happen in db connect or sql execution";
    console.log(_error);
  }

  if (isReady) ctx.response.body = tasks;
  // else {
  //   ctx.response.status = Status.InternalServerError;
  //   ctx.response.body = { details };
  // }
   //----------------------------------
  else {
    if (dataFromClient.isValide) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = { details };
    } else {
      ctx.response.status = Status.NotFound;
      ctx.response.body = { details };
    }
  }
  //----------------------------------


}
