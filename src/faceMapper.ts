/// summary:
/// dri nga file ibutang ug pila ka error ug unsa nga image ang i-return base sa error count

import * as fs from 'fs';
import * as path from 'path';

export function getFaceImage(errors: number, imagesDir: string): string {
    const safeErrors = Math.max(0, errors);
    const extensions = ['jpeg', 'jpg', 'png'];

    try {
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
    } catch (err) {
        // If the directory doesn't exist or isn't readable, fall back to a safe image name.
        return '0.jpeg';
    }
}
