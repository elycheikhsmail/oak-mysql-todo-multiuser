import { Context, Status } from "../deps-managed.ts";
import { getDb } from "../../config/mysql/dbclient.ts";
//---------------------------------------------
import { getBearerTokenPayload } from "../../config/getBareerToken.ts";
//------------------------------------------------


export async function taskUpdateCtr(ctx: Context) {
  // Default variable for minimise if else in code
  let isReady = true;
  // Default variable  details in response when inspect behavur happed
  let details = "";
  //Default variable for db
  let textDefault = "";
  let id = -1;
  let dbTotalChanges = 0;
  // extract data from body
  if (ctx.request.body().type == "json" && ctx.request.hasBody) {
    // extract data from body request
    const body = ctx.request.body({ type: "json" });
    const values = await body.value;
    const { text } = values;
    if (!text) {
      isReady = false;
      details = "invalide text";
    } else textDefault = text;
  } else {
    isReady = false;
    details = "invalide request body type not json or empty";
  }
  // extract id
  if (isReady) {
    const pathname = ctx.request.url.pathname;
    const urlData = pathname.split("/");
    const idStr = String(urlData.at(-1));
    id = parseInt(idStr);
  }

  //--------------------------------------------------------------------
  const dataFromClient = await getBearerTokenPayload(ctx);
  if (!dataFromClient.isValide) {
    isReady = false;
    details = dataFromClient.details;
  }
  //--------------------------------------------------------------


  try {
    const sql = "UPDATE task SET text=? WHERE id = ? AND ownerId = ? ";
    const args = [textDefault, id, dataFromClient.userId];
    const db = await getDb();
    const result = await db.query(sql, args);
    dbTotalChanges = result.affectedRows; 
    await db.close() 
  } catch (_error) {
    isReady = false;
    details = "failed to connect to the db or execute sql";
  }

  if (dbTotalChanges == 0) {
    isReady = false;
  }

  if (isReady) {
    ctx.response.body = {
      id,
      text: textDefault,
      dbChanges: dbTotalChanges,
    };
  } 
  // else {
  //   ctx.response.status = Status.NotFound;
  //   ctx.response.body = { details, dbChanges: dbTotalChanges };
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
