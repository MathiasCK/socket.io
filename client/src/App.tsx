import {useEffect, useState} from "react";
import * as io from "socket.io-client";

const App = () => {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messagesReceived, setMessagesReceived] = useState([]);

  const socket = io.connect("http://localhost:8080");

  useEffect(() => {
    socket.on("receive_message", data => {
      // @ts-ignore
      setMessagesReceived([...messagesReceived, data]);
    });
  }, [socket, messagesReceived]);

  const sendMessage = () => {
    if (message !== "") {
      socket.emit("send_message", {
        id: socket.id,
        message,
        room,
      });
    }
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Room number ..."
        onChange={e => {
          setRoom(e.target.value);
        }}
      />
      <button onClick={joinRoom}>Join room</button>
      <input
        onChange={e => {
          setMessage(e.target.value);
        }}
        type="text"
        placeholder="Message ..."
      />
      <button onClick={sendMessage}>Send message</button>
      {messagesReceived.map((data: any) => (
        <p key={data.id}>
          {data.id} : {data.message}
        </p>
      ))}
    </div>
  );
};

export default App;
