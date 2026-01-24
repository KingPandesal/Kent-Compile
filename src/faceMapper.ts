/// summary:
/// dri nga file ibutang ug pila ka error ug unsa nga image ang i-return base sa error count

import * as fs from 'fs';
import * as path from 'path';

export function getFaceImage(errors: number, imagesDir: string): string {

    const safeErrors = Math.max(0, errors);
    const extensions = ['jpeg', 'jpg', 'png'];

    for (const ext of extensions) {
        const filePath = path.join(imagesDir, `${safeErrors}.${ext}`);
        if (fs.existsSync(filePath)) {
            return `${safeErrors}.${ext}`;
        }
    }

    // fallback
    return '0.jpeg';

    // const safeErrors = Math.max(0, errors);
    // return `${safeErrors}.jpeg`;

    // if (errors === 0) {return '1.jpeg';}
    // if (errors === 1) {return '2.jpeg';}
    // if (errors === 2) {return '3.jpeg';}
    // if (errors === 3) {return '4.jpeg';}
    // if (errors === 4) {return '5.jpeg';}
    // if (errors === 5) {return '6.jpeg';}
    // if (errors >= 6) {return '7.jpeg';}
    // return '1.jpeg';
}
