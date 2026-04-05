const screenHeightDivider = (screen, len) => {
    if(len === 1) return 1
    if(screen === 'xs') {
      if(len === 3) return 1 / 3;
      else return .5
    };
  
    if(screen === "sm") {
      if(len === 3) return 1 / 3;
      else if( len < 5 ) return .5
      else return 1 / 3
    }
  
    if(screen === "md") {
      if(len === 2) return 1;
      else if(len < 7) return .5;
      else return 1 / 3;
    }
  
    if(screen === "lg") {
      if(len === 2) return 1;
      else if(len < 7) return .5;
      else return 1 / 3;
      //else return 1 / 4;
    }
  
    if(screen === "xl") {
      if(len === 2) return 1;
      else if(len < 7) return .5;
      else if(len < 15) return 1 / 3;
      else if(len < 20) return 1 / 4;
      else return 1 / 5;
    }
  }

export default screenHeightDivider;