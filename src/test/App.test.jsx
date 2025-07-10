import { useState } from "react";
import { Virtualizer } from "virtua";

const App = () => {
  const [currentGroup, setCurrentGroup] = useState("");
  console.log(currentGroup);

  const flatList = groupedData.flatMap((group) => [
    { type: "header", title: group.title },
    ...group.items.map((item) => ({
      type: "item",
      name: item,
      group: group.title,
    })),
  ]);

  return (
    <div style={{ position: "relative", height: "600px", overflowY: "auto" }}>
      {/* Sticky header simulé */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#fff",
          padding: "8px",
          fontWeight: "bold",
          borderBottom: "1px solid #ccc",
          zIndex: 10,
        }}>
        {currentGroup}
      </div>

      <Virtualizer
        onScroll={(offset, visibleRange) => {
          if (visibleRange && typeof visibleRange.start === "number") {
            const firstVisible = flatList[visibleRange.start];
            setCurrentGroup(firstVisible?.group || firstVisible?.title || "");
          }
        }}>
        {flatList.map((entry, index) => (
          <div
            key={index}
            style={{
              padding: "8px",
              background: entry.type === "header" ? "#f0f0f0" : "#fff",
              borderBottom: "1px solid #eee",
            }}>
            {entry.type === "header" ? entry.title : entry.name}
          </div>
        ))}
      </Virtualizer>
    </div>
  );
};

// 🧪 Générateur de noms aléatoires
const generateRandomName = () => {
  const syllables = [
    "ka",
    "li",
    "za",
    "mo",
    "ri",
    "ta",
    "yo",
    "lu",
    "ne",
    "ki",
    "do",
    "fa",
    "ge",
  ];
  const name =
    syllables[Math.floor(Math.random() * syllables.length)] +
    syllables[Math.floor(Math.random() * syllables.length)] +
    (Math.random() > 0.5
      ? syllables[Math.floor(Math.random() * syllables.length)]
      : "");
  return name.charAt(0).toUpperCase() + name.slice(1);
};

// 📦 Générer et grouper 1000 noms par lettre
const generateGroupedData = (count = 1000000) => {
  const groups = {};

  for (let i = 0; i < count; i++) {
    const name = generateRandomName();
    const firstLetter = name[0].toUpperCase();

    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(name);
  }

  // ✨ Format en groupedData
  const groupedData = Object.keys(groups)
    .sort()
    .map((letter) => ({
      title: letter,
      items: groups[letter],
    }));

  return groupedData;
};

// ✅ Exemple d’utilisation
const groupedData = generateGroupedData(1000);
console.log(groupedData);

export default App;
