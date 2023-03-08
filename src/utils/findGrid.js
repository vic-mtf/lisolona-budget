export default function findGrid (gridNbr, stymeGridNber = 12) {
    const systemGridNbr = Math.round(gridNbr / stymeGridNber) + 1;
    const defaulNbr = 3 + systemGridNbr;
    let row = Math.ceil(gridNbr / defaulNbr);
    let col = stymeGridNber / Math.ceil(gridNbr / row);
    return col;
}