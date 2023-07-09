
import InfiniteScroll from 'react-infinite-scroll-component';
import { 
    CircularProgress,
    Box as MuiBox
} from "@mui/material";
import { useMemo, useState } from 'react';
import dbConfig from '../configs/database-config.json';
import { useSelector } from 'react-redux';
import InfiniteList, { Container } from '../components/InfinitList';

const style = {
  height: 50,
}

const URL_MESSAGE_WORKER = `${process.env.PUBLIC_URL}/workers/messages.js`;

function MessageContent () {
  const messageWorker = useMemo(() => new Worker(URL_MESSAGE_WORKER), []);
  const userId = useSelector(store => store.user.id);
  const [messages, setMessages] = useState([
    {value: 0, message: `values ${0}`},
    {value: 1, message: `values ${1}`},
    {value: 2, message: `values ${2}`},
    {value: 3, message: `values ${3}`},
    {value: 4, message: `values ${4}`},
    {value: 5, message: `values ${5}`},
    {value: 6, message: `values ${6}`},
    {value: 7, message: `values ${7}`},
    {value: 8, message: `values ${8}`},
    {value: 9, message: `values ${9}`},
    {value: 10, message: `values ${10}`},
    {value: 11, message: `values ${11}`},
    {value: 12, message: `values ${12}`},
    {value: 13, message: `values ${13}`},
    {value: 14, message: `values ${14}`},
    {value: 15, message: `values ${15}`},
    {value: 16, message: `values ${16}`},
    {value: 17, message: `values ${17}`},
    {value: 18, message: `values ${18}`},
    {value: 19, message: `values ${19}`},
    {value: 20, message: `values ${20}`},
    {value: 21, message: `values ${21}`},
    {value: 22, message: `values ${22}`},
    {value: 23, message: `values ${23}`},
    {value: 24, message: `values ${24}`},
    {value: 25, message: `values ${25}`},
    {value: 26, message: `values ${26}`},
    {value: 27, message: `values ${27}`},
    {value: 28, message: `values ${28}`},
    {value: 29, message: `values ${29}`},
    {value: 30, message: `values ${30}`},
    {value: 31, message: `values ${31}`},
    {value: 32, message: `values ${32}`},
    {value: 33, message: `values ${33}`},
    {value: 34, message: `values ${34}`},
    {value: 35, message: `values ${35}`},
    {value: 36, message: `values ${36}`},
    {value: 36, message: `values ${36}`},
    {value: 36, message: `values ${36}`},
    {value: 39, message: `values ${39}`},
    {value: 40, message: `values ${40}`},
    {value: 41, message: `values ${41}`},
    {value: 42, message: `values ${42}`},
    {value: 43, message: `values ${43}`},
    {value: 44, message: `values ${44}`},
    {value: 45, message: `values ${45}`},
    {value: 46, message: `values ${46}`},
    {value: 47, message: `values ${47}`},
    {value: 48, message: `values ${48}`},
    {value: 49, message: `values ${49}`}
  ]);

  const loadMessages = (setState) => {
    messageWorker.onmessage =  event => {
      //const data = new Array(25).fill(null)
      setState(({items}) => {
        return {
          items: items.concat(
            (new Array(25)).fill(null).map((_, key) => ({
              value: items.length + key,
              message: `value: ${items.length + key}`,
            }))
          ), 
          isLoading: false
        };
      });
    };
    const key = `${dbConfig.name}-user-database-id`;
    const dbName = window.localStorage.getItem(key);
    messageWorker.postMessage({dbConfig, userId, dbName, offset: 0});
  }

  return (
    <MuiBox>
      <MuiBox 
      height={500} 
      overflow="hidden"
      sx={{
        display: 'flex',
        //flexDirection: 'column-reverse',
      }}
    >
      <Container 
        items={messages}
        onLoadMore={loadMessages}
      >
        {({ items, isLoading, isEndReached, onReachThreshold }) => (
          <InfiniteList
            containerClassName="InfiniteList InfiniteList--with-height"
            root="container"
            isLoading={isLoading}
            isEndReached={isEndReached}
            onReachThreshold={onReachThreshold}
            threshold={150}
            style={{
              height: 300,
              overflow: 'auto',
            }}
          >
            {items.map(item => (
              <div className="InfiniteList__Item" key={item.id}>
                {item.message}
              </div>
            ))}
            {isLoading && <li className="InfiniteList__Item">Loading...</li>}
          </InfiniteList>
        )}
      </Container>
      </MuiBox>
    </MuiBox>
  )
}

export default MessageContent
