import Navigation from '../Navigation';
import appConfig from '../../../configs/app-config.json';

export default function NavigationRight ({open}) {
    return (
       <Navigation
          anchor="right" 
          variant="persistent" 
          open={open}
       />
    );
}