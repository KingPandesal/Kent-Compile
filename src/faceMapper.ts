import * as vscode from 'vscode';
import * as path from 'path';

export function getFaceImage(errors: number): string {
    if (errors === 0) {return '1.png';}
    if (errors === 1) {return '2.png';}
    if (errors === 2) {return '3.png';}
    if (errors === 3) {return '4.png';}
    if (errors === 4) {return '5.png';}
    if (errors >= 5) {return '6.png';}
    return '7.png';
}
