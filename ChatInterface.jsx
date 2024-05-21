import React, { useState, useEffect } from 'react';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messageInput, setMessageInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [fileAttachment, setFileAttachment] = useState(null);

  const handleTextChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setFileAttachment(event.target.files[0]);
    }
  };

  const submitMessage = () => {
    if (!messageInput.trim() && !fileAttachment) return;
    const newUserMessage = { type: 'user', content: messageInput, attachment: fileAttachment };
    setConversationHistory([...conversationHistory, newUserMessage]);
    setMessageInput('');
    setFileAttachment(null);
  };

  useEffect(() => {
    if (conversationHistory.length && conversationHistory[conversationHistory.length - 1].type === 'user') {
      setTimeout(() => {
        const autoReplyFromBot = { type: 'bot', content: 'Thanks for your message. We will reply shortly.', attachment: null };
        setConversationHistory([...conversationHistory, autoReplyFromBot]);
      }, 1000);
    }
  }, [conversationHistory]);

  const displayMessages = () => conversationHistory.map((msg, index) => (
    <div key={index} className={`message ${msg.type}`}>
      <div className="message-content">{msg.content}</div>
      {msg.attachment && <a href={URL.createObjectURL(msg.attachment)} download>Download attachment</a>}
    </div>
  ));

  return (
    <div className="chat-interface">
      <div className="chat-window">
        {displayMessages()}
      </div>
      <div className="input-area">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={messageInput} 
          onChange={handleTextChange}
        />
        <input 
          type="file" 
          onChange={handleFileChange}
        />
        <button onClick={submitMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;