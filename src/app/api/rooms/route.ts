import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { Payload } from "@lib/DB";

export const GET = async () => {
  readDB();
  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: DB.rooms.length
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();
  let role = null;
  try {
    if(payload){
      role = (<Payload>payload).role;
    }
  } catch {
   return NextResponse.json(
     {
       ok: false,
       message: "Invalid token",
     },
     { status: 401 }
   );
  }

  readDB();

  
  const body = await request.json();
  const { roomName } = body;

  const foundRoom = DB.roomName.find(
    (x:any) => x.roomName === roomName
  );
  if (foundRoom) {
   return NextResponse.json(
     {
       ok: false,
       message: `Room ${"replace this with room name"} already exists`,
     },
     { status: 400 }
   );
  }

  const roomId = nanoid();

  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId: roomId,
    message: `Room ${body.roomName} has been created`,
  });
};
