import { DB, readDB, writeDB, Database } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  readDB();
  const room = request.nextUrl.searchParams.get("roomId");
  const check = (<Database>DB).messages.find((x) => x.roomId === room);
  const foundRoom = (<Database>DB).messages.filter((x) => x.roomId === room);
 
  if(!check) 
    return NextResponse.json(
    {
      ok: false,
      message: `Room is not found`,
    },
    { status: 404 }
  );
  return NextResponse.json({
   ok: true,
   messages: foundRoom,
  },
  { status: 200});
};

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const check = (<Database>DB).messages.find((x) => x.roomId === body.roomId);
  if(!check) return NextResponse.json(
     {
       ok: false,
       message: `Room is not found`,
     },
     { status: 404 }
   );

  const messageId = nanoid();
  const roomId = body.roomId;
  const messageText = body.messageText;
  (<Database>DB).messages.push({roomId,messageId,messageText});
  writeDB();

  return NextResponse.json({
    ok: true,
   messageId: messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  const body = await request.json();

  if(!payload){
     return NextResponse.json(
       {
         ok: false,
         message: "Invalid token",
       },
       { status: 401 }
     );

  }

  readDB();
  
  const foundIndex = (<Database>DB).messages.findIndex((x) => x.messageId === body.messageId);
  if(foundIndex === -1) return NextResponse.json(
    {
      ok: false,
      message: "Message is not found",
    },
    { status: 404 }
  );
  (<Database>DB).messages.splice(foundIndex, 1);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
