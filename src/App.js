import React, { Component } from "react";
import "./App.css";
import socket from "socket.io-client";

const io = socket.connect("http://localhost:3213");

class App extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
      messages: [],
      room: "",
      currentRoom: "",
      someoneTyping: false
    };
    io.on("message-to-users", message => {
      let messages = [...this.state.messages, message.message];
      this.setState({ messages });
    });

    io.on("joined-room", message => {
      let messages = [...this.state.messages, message.message];
      this.setState({ messages });
    });

    io.on("someone-typing", () => {
      console.log("hit?");
      this.setState({ someoneTyping: true });
    });
  }

  handleClick() {
    io.emit("send-message", {
      message: this.state.message,
      room: this.state.currentRoom
    });
  }

  handleRoomChange() {
    this.setState({ currentRoom: this.state.room });
    io.emit("room-change", { room: this.state.room });
  }

  handleChange(e) {
    this.setState({ message: e.target.value });
    if (this.state.message.length > 0) {
      io.emit("typing", { typing: true, room: this.state.currentRoom });
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Socket Demo</h1>
        <h3>Is someone typing? {this.state.someoneTyping ? "Yes" : "No"}</h3>
        <div>
          <input
            placeholder="Write Message"
            onChange={e => this.handleChange(e)}
          />
          <button onClick={() => this.handleClick()}>Send Message</button>
        </div>
        <div>
          <input
            placeholder="room name"
            onChange={e => this.setState({ room: e.target.value })}
          />
          <button onClick={() => this.handleRoomChange()}>Set Room</button>
        </div>
        <div>{this.state.currentRoom}</div>
        {this.state.messages.map((val, i) => {
          return <div>{val}</div>;
        })}
      </div>
    );
  }
}

export default App;
