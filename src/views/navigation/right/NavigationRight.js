import Navigation from '../Navigation';

export default function NavigationRight ({open}) {
    return (
       <Navigation
          anchor="right" 
          variant="persistent" 
          open={open}
       />
    );
}