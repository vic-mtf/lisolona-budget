import MessagingBoxHeader from "./messaging-box-header/MessagingBoxHeader";
import MessagingBoxContent from "./messaging-box-content/MessagingBoxContent";
import MessagingBoxFooter from "./messaging-box-footer/MessagingBoxFooter";
import { Divider } from "@mui/material";
import MessagingProvider from "./MessagingBoxProvider";
import MediaViewer from "../media-viewer/MediaViewer";

export default function MessagingBox() {
  return (
    <MessagingProvider>
      <MessagingBoxHeader />
      <Divider />
      <MessagingBoxContent />
      <Divider />
      <MessagingBoxFooter />
      <MediaViewer />
    </MessagingProvider>
  );
}
