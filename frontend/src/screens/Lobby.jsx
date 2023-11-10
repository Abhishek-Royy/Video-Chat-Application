import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const Lobby = () => {
  const [email, setemail] = useState("");
  const [room, setroom] = useState("");

  const socket = useSocket();
  // console.log(socket);

  const navigate = useNavigate();

  const handelSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handelJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handelJoinRoom);
    return () => {
      socket.off("room:join", handelJoinRoom);
    };
  }, [socket, handelJoinRoom]);

  return (
    <div>
      <h1>Hello from Lobby</h1>
      <form onSubmit={handelSubmit}>
        <label htmlFor="email">Email ID: </label>
        <input
          type="email"
          id="email"
          placeholder="Enter Email Id"
          onChange={(e) => setemail(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room Id: </label>
        <input
          type="text"
          id="room"
          placeholder="Enter Room Number"
          onChange={(e) => setroom(e.target.value)}
        />
        <br />
        <button>Join</button>
      </form>
    </div>
  );
};

export default Lobby;
