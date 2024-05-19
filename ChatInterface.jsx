import React, { useState, useEffect } from 'react';
import './ChatInterface.css';

const ChatInterface = () => {
  const [userInput, setUserInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [attachment, setAttachment] = useState(null);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleAttachmentChange = (event) => {
    if (event.target.files[0]) {
      setAttachment(event.target.files[0]);
    }
  };

  const sendMessage = () => {
    if (!userInput.trim() && !attachment) return;
    const newMessage = { type: 'user', content: userInput, attachment: attachment };
    setChatLog([...chatLog, newMessage]);
    setUserInput('');
    setAttachment(null);
  };

  useEffect(() => {
    if (chatLog.length && chatLog[chatLog.length - 1].type === 'user') {
      setTimeout(() => {
        const botMessage = { type: 'bot', content: 'Thanks for your message. We will reply shortly.', attachment: null };
        setChatLog([...chatLog, botMessage]);
      }, 1000);
    }
  }, [chatLog]);

  const renderChatLog = () => chatLog.map((message, index) => (
    <div key={index} className={`message ${message.type}`}>
      <div className="message-content">{message.content}</div>
      {message.attachment && <a href={URL.createObjectURL(message.attachment)} download>Download attachment</a>}
    </div>
  ));

  return (
    <div className="chat-interface">
      <div className="chat-window">
        {renderChatLog()}
      </div>
      <div className="input-area">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={userInput} 
          onChange={handleInputChange}
        />
        <input 
          type="file" 
          onChange={handleAttachmentChange}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;