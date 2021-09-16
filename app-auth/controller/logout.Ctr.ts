import { Context } from "../deps-managed.ts";

//import { getBearerTokenPayload } from "../../config/getBareerToken.ts";
 
// deno-lint-ignore require-await
export async function logoutCtr(ctx: Context) {
 // const dataFromClient = await getBearerTokenPayload(ctx);
  ctx.cookies.set("iduser",null )
  ctx.response.body = { message:"logout"};

 

}
