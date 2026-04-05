export default function createCompleteUrl(...pathnames) {
    const origin = window.location.origin;
    let completeUrl = origin;
    pathnames.map(pathname => pathname?.trim()).forEach(pathname => {
        if(pathname.startsWith('/') && pathname !== '/') 
            completeUrl += pathname;
        else
            completeUrl += pathname ? ('/' + pathname) : '';
    })

    return completeUrl;
}
