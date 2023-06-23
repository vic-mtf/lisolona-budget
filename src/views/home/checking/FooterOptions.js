import { Toolbar } from "@mui/material";
import AudioInputButtonOptions from "./AudioInputButtonOptions";
import AudioOutputButtonOptions from "./AudioOutputButtonOptions";
import VideoInputButtonOptions from "./VideoInputButtonOptions";
import { isEqual, isEqualWith, isPlainObject } from "lodash";

export default function FooterOptions () {
    
    return (
        <Toolbar
            variant="dense"
            disableGutters
        >
            <AudioInputButtonOptions/>
            <AudioOutputButtonOptions/>  
            <VideoInputButtonOptions/> 
        </Toolbar>
    );
}

export function compareArraysOfObjects(array1, array2) {
    function customizer(objValue, othValue) {
      if (isPlainObject(objValue) && isPlainObject(othValue)) {
        return isEqual(objValue, othValue);
      }
    }
    return isEqualWith(array1, array2, customizer);
  }