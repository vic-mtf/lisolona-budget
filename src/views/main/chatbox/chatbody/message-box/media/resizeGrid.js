export default function resizeGrid (index=0, len=0, size=165) {
    let cols = 1;
    let rows = 1;
    switch(len) {
        case 1:
            cols = 2;
            rows = 2;
            break;
        case 2:
            rows = 2;
            break;
        case 3:
            if(index === 0)
                rows = 2;
            else rows = 1;
            break;
        default: break;
    }
    let height = len === 1 ? undefined : rows * size ;
    let width = len === 1 ? undefined : cols * size;
    let minHeight = size;
    let minWidth = len === 1 ? size * 2 : undefined;
    return {cols, rows, width, height, minHeight, minWidth};
}