import React, { useState, useEffect, useRef } from 'react';

function MessageList() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const containerRef = useRef(null);

  useEffect(() => {
    // Charger les messages initiaux
    loadMessages();
  }, []);

  useEffect(() => {
    // Ajouter un écouteur de scroll
    containerRef.current.addEventListener('scroll', handleScroll);
    return () => {
      // Supprimer l'écouteur de scroll
      containerRef.current.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const { scrollTop } = containerRef.current;
    if (scrollTop === 0 && !isLoading && hasMore) {
      // Charger plus de messages
      setPageNumber(pageNumber + 1);
    }
  };

  const loadMessages = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/messages?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    const newMessages = await response.json();
    setMessages([...newMessages, ...messages]);
    setIsLoading(false);
    setHasMore(newMessages.length === pageSize);
  };

  return (
    <div ref={containerRef} style={{ height: '400px', overflowY: 'scroll' }}>
      {messages.map((message) => (
        <div key={message.id}>{message.text}</div>
      ))}
      {isLoading && <div>Loading...</div>}
    </div>
  );
}

export default MessageList