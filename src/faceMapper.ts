/// summary:
/// dri nga file ibutang ug pila ka error ug unsa nga image ang i-return base sa error count

export function getFaceImage(errors: number): string {

    const safeErrors = Math.max(0, errors);
    return `${safeErrors}.jpeg`;

    // if (errors === 0) {return '1.jpeg';}
    // if (errors === 1) {return '2.jpeg';}
    // if (errors === 2) {return '3.jpeg';}
    // if (errors === 3) {return '4.jpeg';}
    // if (errors === 4) {return '5.jpeg';}
    // if (errors === 5) {return '6.jpeg';}
    // if (errors >= 6) {return '7.jpeg';}
    // return '1.jpeg';
}
