import { DB, readDB, writeDB, Database, Payload, Room } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  return NextResponse.json({
    ok: true,
    rooms: (<Database>DB).rooms,
    totalRooms: (<Database>DB).rooms.length
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();
  if (!payload) {
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

  const foundRoom = (<Database>DB).rooms.find((x) => x.roomName === body.roomName);
  if (foundRoom) {
   return NextResponse.json(
     {
       ok: false,
       message: `Room ${body.roomName} already exists`,
     },
     { status: 400 }
   );
  }

  const roomId = nanoid();
  const roomName = body.roomName;
  const newRoom = { roomId , roomName };

  //call writeDB after modifying Database
  (<Database>DB).rooms.push(newRoom);
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId: roomId,
    message: `Room ${body.roomName} has been created`,
  });
};
