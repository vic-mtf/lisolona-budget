import RichTextEditor from "./RichTextEditor";
import ImageLikeSkeleton from "./ImageLikeSkeleton";

const App = () => {
  return (
    <div style={{ position: "relative", height: "100vh", overflowY: "auto" }}>
      <ImageLikeSkeleton />
    </div>
  );
};

export default App;
