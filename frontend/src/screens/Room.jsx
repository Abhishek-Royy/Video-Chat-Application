// import React, { useEffect, useCallback, useState } from "react";
// import ReactPlayer from "react-player";
// import peer from "../service/peer";
// import { useSocket } from "../context/SocketProvider";

// const Room = () => {
//   const socket = useSocket();

//   const [remoteSocketId, setremoteSocketId] = useState(null);
//   const [myStream, setmyStream] = useState();

//   const handelUserJoined = useCallback(({ email, id }) => {
//     console.log(`Email ${email} joined room..`);
//     setremoteSocketId(id);
//   }, []);

//   const handelCallUser = useCallback(async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });
//     const offer = await peer.getOffer();
//     socket.emit("user:call", { to: remoteSocketId, offer });
//     setmyStream(stream);
//   }, [remoteSocketId, offer]);

//   const handleIncomingCall = useCallback(({ from, offer }) => {
//     console.log(`Incoming Call`, from, offer);
//   }, []);

//   useEffect(() => {
//     socket.on("user:joined", handelUserJoined);
//     socket.on("incoming:call", handleIncomingCall);

//     return () => {
//       socket.off("user:joined", handelUserJoined);
//       socket.off("incoming:call", handleIncomingCall);
//     };
//   }, [socket, handelUserJoined]);

//   return (
//     <>
//       <h1>Join Room Page</h1>
//       <h4>{remoteSocketId ? "Connected" : "No one in Room"}</h4>
//       {remoteSocketId && <button onClick={handelCallUser}>CALL</button>}
//       {myStream && (
//         <ReactPlayer
//           playing
//           muted
//           height="150px"
//           width="300px"
//           url={myStream}
//         />
//       )}
//     </>
//   );
// };

// export default Room;


import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";

const Room = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room..`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);

      const offer = await peer.getOffer();
      socket.emit("user:call", { to: remoteSocketId, offer });
    } catch (error) {
      console.error("Error getting user media:", error);
    }
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(({ from, offer }) => {
    console.log(`Incoming Call from ${from}`, offer);
    // Handle the incoming call and offer here
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
    };
  }, [socket, handleUserJoined, handleIncomingCall]);

  return (
    <>
      <h1>Join Room Page</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in Room"}</h4>
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      {myStream && (
        <video
          autoPlay
          playsInline
          muted
          height="150px"
          width="300px"
          srcObject={myStream}
        />
      )}
    </>
  );
};

export default Room;
