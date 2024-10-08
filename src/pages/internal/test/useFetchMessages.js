import { useEffect, useState } from "react";

const API = `${process.env.REACT_APP_API_URL}/api`;

const useFetchMessages = (selectedRoom) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API}/chats/collaborator/${selectedRoom._id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        throw new Error("Failed to fetch messages");
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!selectedRoom || !selectedRoom._id) return;

    fetchMessages();
  }, [selectedRoom]); // Dependency array includes 'selectedRoom'

  return { loading, error, messages, refresh: fetchMessages };
};

export default useFetchMessages;
