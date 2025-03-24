import React, { useState } from "react";
import { faker } from "@faker-js/faker";
import MessageItem from "./MessageItem";
import { List as MUIList, Fade, Container } from "@mui/material";
import { useCallback } from "react";
import { useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import MenuDiscussion from "./MenuDiscussion";
import { GroupedVirtuoso } from "react-virtuoso";
import { useRef } from "react";
import { useEffect } from "react";
import { useLayoutEffect } from "react";
import { VirtuosoMessageListLicense } from "@virtuoso.dev/message-list";
import { VirtuosoMessageList } from "@virtuoso.dev/message-list";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import getSize from "./getSize";
import { VList } from "virtua";
// import { VirtuosoMessageListLicense } from "@virtuoso.dev/message-list";
// import { VirtuosoMessageList } from "@virtuoso.dev/message-list";

const MAX_DISPLAY = 50;

export default function MessageList() {
  const [data] = useState(
    new Array(1000).fill(null).map(() => generateMessage())
  );
  const VListRef = useRef(null);
  const VListStateMemo = useMemo(() => ({ isPrepend: false }), []);
  const itemsRef = useMemo(() => [], []);
  const rootRef = useRef(null);
  const groupedVirtuosoRef = useRef();
  const { messages, groups, groupCounts } = useMemo(() => {
    const bulkGroups = groupMessageByDate(data);
    const groupCounts = [];
    const groups = [];
    const messages = [];
    Object.keys(bulkGroups).forEach((title) => {
      const bulkGroup = bulkGroups[title];
      groupCounts.push(bulkGroup.length);
      groups.push(title);
      messages.push(...bulkGroup);
    });

    return { messages, groups, groupCounts };
  }, [data]);

  const [item, setItem] = useState({ contextMenu: null, data: null });

  //   const users = useMemo(() => {
  //     let sortedData = [...data].sort(
  //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //     );

  //     const fistElements = pinList.map((pinId) =>
  //       sortedData.find(({ id }) => id === pinId)
  //     );
  //     const lastElements = sortedData.filter(({ id }) => !pinList.includes(id));
  //     return [...fistElements, ...lastElements];
  //   }, [data, pinList]);

  // const itemContent = useCallback(
  //   ({ index, style }) => {
  //     const props = data[index];

  //     return (
  //       <div key={props.id} style={{ ...style, border: "1px solid gray" }}>
  //         <MessageItem
  //           {...props}
  //           onContextMenu={(event) => {
  //             event.preventDefault();
  //             setItem((item) => ({
  //               contextMenu:
  //                 item.contextMenu === null
  //                   ? {
  //                       mouseX: event.clientX + 2,
  //                       mouseY: event.clientY - 6,
  //                     }
  //                   : null,
  //               props,
  //             }));
  //           }}
  //           dataIndex={index}
  //         />
  //       </div>
  //     );
  //   },
  //   [data]
  // );

  useLayoutEffect(() => {
    VListRef.current?.scrollToIndex(data.length - 1, {
      align: "end",
    });
  }, [data.length]);

  return (
    <>
      <div
        ref={rootRef}
        style={{
          height: "100%",
          width: "100%",
          overflow: "hidden",
          contain: "strict",
        }}>
        <VList
          ref={VListRef}
          style={{ flex: 1 }}
          reverse
          shift={VListStateMemo.isPrepend}
          overscan={4}
          onScroll={(offset) => {
            // if (!ref.current) return;
            // shouldStickToBottom.current =
            //   offset - ref.current.scrollSize + ref.current.viewportSize >=
            // FIXME: The sum may not be 0 because of sub-pixel value when browser's window.devicePixelRatio has decimal value
            -1.5;
            if (offset < 100) {
              VListStateMemo.isPrepend = true;
              // setItems((p) => [
              //   ...Array.from(
              //     {
              //       length: 100,
              //     },
              //     () => createItem()
              //   ),
              //   ...p,
              // ]);
            }
          }}>
          {data.map((props, index) => (
            <MessageItem
              {...props}
              key={props?.id}
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
                  props,
                }));
              }}
              dataIndex={index}
            />
          ))}
        </VList>
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

const generateMessage = () => ({
  id: faker.database.mongodbObjectId(),
  clientId: faker.database.mongodbObjectId(),
  content: faker.lorem.sentence({ min: 10, max: 200 }),
  createdAt: faker.date.between({ from: "06/01/2024", to: new Date() }),
  type: ["text", "document", "media"][faker.number.int({ max: 2 })],

  subType: ["image", "video", "audio", "voice"][faker.number.int({ max: 3 })],
  sender: {
    name: faker.person.fullName(),
    src: faker.image.avatar(),
    id: faker.database.mongodbObjectId(),
  },
});

const groupMessageByDate = (messages = []) => {
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  const group = {};
  sortedMessages.forEach((message) => {
    const date = formatDate(message?.createdAt, "fr", { today: "literal" });
    if (!Array.isArray(group[date])) group[date] = [];
    group[date].push(message);
  });
  return group;
};

const formatDate = (bulkDate, lang = "fr", options) => {
  const date = new Date(bulkDate || Date.now());
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const intl = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });

  if (diffDays === 0) {
    return options?.today === "literal"
      ? intl.format(diffDays, "day")
      : new Intl.DateTimeFormat(lang, {
          hour: "numeric",
          minute: "numeric",
        }).format(date);
  } else if (diffDays === 1) {
    return intl.format(-1, "day");
  } else if (diffDays === 2) {
    return intl.format(-2, "day");
  } else if (diffDays < 7) {
    return new Intl.DateTimeFormat(lang, { weekday: "long" }).format(date);
  } else if (date.getFullYear() === now.getFullYear()) {
    return new Intl.DateTimeFormat(lang, {
      month: "long",
      day: "numeric",
    }).format(date);
  } else {
    return new Intl.DateTimeFormat(lang, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }
};
