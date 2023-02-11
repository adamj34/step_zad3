import React, { useState, useEffect } from "react";
import axios from "axios";
import Paho from "paho-mqtt";
import Cookies from "js-cookie";

const buildPath = (id1, id2) => {
    if (id1 < id2) {
        return `${id1}${id2}`;
    } else {
        return `${id2}${id1}`;
    }
}

const Chat = ( { userData } ) => {
    const currUserId = JSON.parse(Cookies.get("user"))._id;
    const currUserUsername = JSON.parse(Cookies.get("user")).username;

    const [client, setClient] = useState(null);
    const [oldMessages, setOldMessages] = useState([]);
    const [input, setInput] = useState("");
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const newClient = new Paho.Client(
            "broker.hivemq.com",
            8000,
            currUserId
        );
        newClient.onConnectionLost = onConnectionLost;
        newClient.onMessageArrived = onMessageArrived;

        setClient(newClient);

        axios.get('https://localhost:8000/mainPage/profile/chat/messages', {params: {jointId: buildPath(currUserId, userData._id)}})
            .then((res) => {
            console.log(res.data)
            setOldMessages(res.data.messages || [])
            })
            .catch((err) => console.log(err));
    }, []);


    useEffect(() => {
        if (client) {
            client.connect({ onSuccess: onConnect });
        }

        if (client) {
            return () => {
                client.disconnect();
                console.log("disconnected");
            };
        }
    }, [client]);

        
    const onConnect = () => {
        console.log("connected");
        setConnected(true);
        client.subscribe(`/chat/${buildPath(currUserId, userData._id)}`);
    };
    
    const onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    };
    
    const onMessageArrived = (message) => {
        console.log(message.payloadString)
        setOldMessages((oldMessages) => [...oldMessages, message.payloadString]);
    };
    
    const handleSend = () => {
        const msgContent = `${currUserUsername}: ${input}`;
        const message = new Paho.Message(msgContent);
        message.destinationName = `/chat/${buildPath(currUserId, userData._id)}`;
        client.send(message);
        axios.post('https://localhost:8000/mainPage/profile/chat/messages', {jointId: buildPath(currUserId, userData._id), message: message.payloadString})
        setInput("");
    };
    
    return (
    <div className="chat">
        <h2>{`Chat with ${userData.username}`}</h2>
        <div>
            {oldMessages.map((message, index) => (
                <p key={index}>{message}</p>
            ))}
        </div>
        {connected ? (
        <div id='msgContent'>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
        </div>
        ) : (
            <div>Connecting...</div>
        )}
    </div>
    );
};
    
export default Chat;