import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const Chatbot = () => {
    const [userQuery, setUser Query] = useState("");
    const [messages, setMessages] = useState([]);

    const fetchPrediction = async (query) => {
        try {
            const response = await axios.post("http://localhost:5000/api/chat", {
                user_query: query,
            });
            return response.data.response; // Adjust based on your response structure
        } catch (error) {
            console.error("Error fetching prediction:", error);
            return "Sorry, I couldn't process your request.";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetchPrediction(userQuery);
        setMessages([...messages, { text: userQuery, sender: "user" }, { text: response, sender: "bot" }]);
        setUser Query(""); // Clear input field
    };

    return (
        <div className="chatbot-container position-fixed bottom-0 end-0 p-3" style={{ width: "300px" }}>
            <div className="card">
                <div className="card-header">
                    Chatbot
                </div>
                <div className="card-body" style={{ height: "300px", overflowY: "auto" }}>
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.sender === "user" ? "text-end" : "text-start"}>
                            <div className={`badge ${msg.sender === "user" ? "bg-primary" : "bg-success"} text-wrap`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        value={userQuery}
                        onChange={(e) => setUser Query(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button type="submit" className="btn btn-primary">Send</button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;