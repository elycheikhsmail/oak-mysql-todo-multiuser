import { app } from "./_init-app.ts";
import { Context } from "https://deno.land/x/oak@v9.0.0/mod.ts";
// add middlares before routes

import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
//app.keys = ["userId"]

app.use(oakCors({
  origin:[
    "http://localhost:3000","https://todo-multiuser-oak.herokuapp.com","https://suspicious-brahmagupta-be675f.netlify.app"
  ], 
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Origine',
    'Access-Control-Allow-Credentials',
    'Access-Control-Request-Headers',
    'access-control-allow-headers', 
  ],
 

  credentials:true

})); 

app.use(
  async (ctx: Context, next) => {
    const m = ctx.request.method;
    const p = ctx.request.url.pathname;
   // ctx.response.headers.append("Access-Control-Allow-Credentials","true")
    console.log(`request :  ${m}    ${p}`);

    await next();
  },
);


 
 
// end
export { app };
