export default function getGridSize (length, small, systemGrid = 12) {
    switch(length) {
        case 1:
            return {
                height: '100%',
                width: '100%',
            }
        case 2: 
            return {
                height: {
                    xs: '50%',
                    md: '100%'
                },
                width: {
                    xs: '100%',
                    md: '50%'
                }
            }
        case 3: 
            return {
                xs: systemGrid / 1,
                md:  systemGrid / 2,
                height: {
                    xs: 'calc(100% / 3)',
                    md: '50%'
                },
                width: {
                    xs: '100%',
                    md: '50%'
                }
            }
        case 4: 
            return {
                xs: systemGrid/ 2,
                height: {
                    xs: '50%',
                    md: '50%'
                },
                width: {
                    xs: '50%',
                    md: '50%'
                }
            }
        case 5: 
            return {
                md: systemGrid / 3,
            }
        case 6: 
            return {
                md: systemGrid / 3,
                xs: systemGrid/ 2,
            }
        case 7: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / 3,
                md: systemGrid / 2,
            }
        case 8: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / 2,
            }
        case 9: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / 3,
            }
        case 10: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / 4,
            }
        case 11: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / 4,
            }
        case 12: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / 4,
            }
        case 13: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / 5,
            }
        case 14: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / 5,
            }
            case 15: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / 5,
            }
        case 16: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / (small ? 4 : 6),
            }
        case 17: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / 6,
            }
        case 18: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / 6,
            }
        case 19: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / 5,
            }
        case 20: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid,
            }
        case 21: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid,
            }
        case 22: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid,
            }
        case 23: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid,
            }
        case 24: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid,
            }
            case 25: 
        return {
            xs: systemGrid/ 2,
            md: systemGrid,
        }
        case 26: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid,
            }
        case 27: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid,
            }
        case 28: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid,
            }
        case 29: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid,
            }
            case 30: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid,
            }
        case 31: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid,
            }
            case 32: 
        return {
            xs: systemGrid/ 2,
            md: systemGrid,
        }
        case 33: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid,
            }
        case 34: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid,
            }
        default: 
            return {
                xs: systemGrid/ 2,
                md: systemGrid / 7,
            }
    }
}