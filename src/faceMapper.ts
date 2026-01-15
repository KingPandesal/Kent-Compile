import * as vscode from 'vscode';
import * as path from 'path';

export function getFaceImage(errors: number): string {
    if (errors === 0) {return '1.jpeg';}
    if (errors === 1) {return '2.jpeg';}
    if (errors === 2) {return '3.jpeg';}
    if (errors === 3) {return '4.jpeg';}
    if (errors === 4) {return '5.jpeg';}
    if (errors >= 5) {return '6.jpeg';}
    return '7.jpeg';
}
