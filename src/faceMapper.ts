/// summary:
/// dri nga file ibutang ug pila ka error ug unsa nga image ang i-return base sa error count

import * as fs from 'fs';
import * as path from 'path';

export function getFaceImage(errors: number, imagesDir: string): string {
    const safeErrors = Math.max(0, errors);
    const extensions = ['jpeg', 'jpg', 'png'];

    // 1️⃣ Try exact match first (0.jpeg, 1.png, etc.)
    for (const ext of extensions) {
        const exactPath = path.join(imagesDir, `${safeErrors}.${ext}`);
        if (fs.existsSync(exactPath)) {
            return `${safeErrors}.${ext}`;
        }
    }

    // 2️⃣ Fallback: find highest-numbered image in folder
    const files = fs.readdirSync(imagesDir);

    const numberedImages = files
        .map(file => {
            const match = file.match(/^(\d+)\.(jpeg|jpg|png)$/i);
            return match ? { file, index: Number(match[1]) } : null;
        })
        .filter(Boolean) as { file: string; index: number }[];

    if (numberedImages.length === 0) {
        return '0.jpeg'; // absolute last-resort fallback
    }

    // sort descending → highest number first
    numberedImages.sort((a, b) => b.index - a.index);

    return numberedImages[0].file;
}

// export function getFaceImage(errors: number, imagesDir: string): string {

//     const safeErrors = Math.max(0, errors);
//     const extensions = ['jpeg', 'jpg', 'png'];

//     for (const ext of extensions) {
//         const filePath = path.join(imagesDir, `${safeErrors}.${ext}`);
//         if (fs.existsSync(filePath)) {
//             return `${safeErrors}.${ext}`;
//         }
//     }

//     // fallback
//     return '0.jpeg';

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
// }
