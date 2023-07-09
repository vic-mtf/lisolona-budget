import { useState } from "react"
import { useSelector } from "react-redux";

const ARRAY_SIZE = 20;
const RESPONSE_TIME_IN_MS = 1000;

function loadMessages(startCursor = 0) {
  return new Promise(resolve => {
    let newArray = []
    setTimeout(() => {
      for (let i = startCursor; i < startCursor + ARRAY_SIZE; i++) {
        const newItem = {
          key: i,
          value: `This is item ${i}`
        };
        newArray = [...newArray, newItem];
      }
      resolve({ hasNextPage: true, data: newArray });
    }, RESPONSE_TIME_IN_MS);
  });
}

export function useLoadMessages() {
  const savedMessages = useSelector(store => store.data.messages);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(
    savedMessages.slice(0, ARRAY_SIZE) ?? []
  );
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState();

  async function loadMore() {
    setLoading(true);
    try {
      const { data, hasNextPage: newHasNextPage } = await loadMessages(messages.length);
      setMessages(current => [...current, ...data]);
      setHasNextPage(newHasNextPage);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  return { loading, messages, hasNextPage, error, loadMore };
}
