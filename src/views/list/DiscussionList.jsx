import { useState } from "react";
import { faker } from "@faker-js/faker";
import DiscussionItem from "./DiscussionItem";
import { useCallback } from "react";
import { useMemo } from "react";
import { List as MUIList } from "@mui/material";
import MenuDiscussion from "./MenuDiscussion";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";

export default function DiscussionList() {
  const [data, setUsers] = useState(generateData(1000));
  const [item, setItem] = useState({ contextMenu: null, data: null });

  const [pinList] = useState([]); // redux selector...

  const users = useMemo(() => {
    let sortedData = [...data].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    const fistElements = pinList.map((pinId) =>
      sortedData.find(({ id }) => id === pinId)
    );
    const lastElements = sortedData.filter(({ id }) => !pinList.includes(id));
    return [...fistElements, ...lastElements];
  }, [data, pinList]);

  const itemContent = useCallback(
    ({ index, style, ...otherProps }) => {
      const data = users[index];
      return (
        <div key={data.id} style={style}>
          <DiscussionItem
            {...data}
            onContextMenu={(event) => {
              event.preventDefault();
              setItem((item) => ({
                contextMenu:
                  item.contextMenu === null
                    ? {
                        mouseX: event.clientX + 2,
                        mouseY: event.clientY - 6,
                      }
                    : null,
                data,
              }));
            }}
            dataIndex={index}
            divider={index !== users.length - 1}
          />
        </div>
      );
    },
    [users]
  );

  return (
    <>
      <div
        onClick={() =>
          setUsers((users) => [
            ...users,
            ...generateData(1, { updatedAt: new Date() }),
          ])
        }
        style={{
          height: "100%",
          width: "100%",
          overflow: "hidden",
          contain: "strict",
        }}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              height={height}
              rowCount={users.length}
              rowHeight={72.5}
              rowRenderer={itemContent}
              scrollToIndex={data.length - 1}
              width={width}
              noContentRenderer={MUIList}
              style={{ overflowX: "hidden" }}
            />
          )}
        </AutoSizer>
      </div>
      <MenuDiscussion
        open={Boolean(item.data)}
        contextMenu={item.contextMenu}
        data={item.data}
        onClose={() => {
          setItem({ contextMenu: null, data: null });
        }}
      />
    </>
  );
}

const generateData = (count = 300, props) =>
  new Array(count).fill(null).map(() => ({
    name: faker.person.fullName(),
    src: faker.image.avatar(),
    id: faker.database.mongodbObjectId(),
    updatedAt: props?.updatedAt || faker.date.past(),
    message: generateMessage(),
    type: ["room", "direct"][faker.number.int({ max: 1 })],
    news: faker.number.int({ min: 0, max: 100 }),
    status: ["online", "offline"][faker.number.int({ max: 1 })],
  }));

const generateMessage = () => ({
  id: faker.database.mongodbObjectId(),
  content: faker.lorem.sentence(),
  createdAt: faker.date.recent(),
  type: ["text", "document", "media"][faker.number.int({ max: 2 })],
  subType: ["image", "video", "audio", "voice"][faker.number.int({ max: 3 })],
  sender: {
    name: faker.person.fullName(),
    src: faker.image.avatar(),
    id: faker.database.mongodbObjectId(),
  },
});
