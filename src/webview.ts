/// summary:
/// dri nga file makita ug unsay makita sa explorer tree

import * as vscode from 'vscode';
import { countErrors } from './diagnostics';
import { getFaceImage } from './faceMapper';

export class KenCompileViewProvider implements vscode.WebviewViewProvider {

    constructor(private readonly context: vscode.ExtensionContext) {}

    resolveWebviewView(view: vscode.WebviewView) {
        view.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri] 
        };

        const update = () => {
            const errors = countErrors();
            const image = getFaceImage(errors);

            // path sa images (test/kentFace)
            const imageUri = view.webview.asWebviewUri(
                vscode.Uri.joinPath(
                    this.context.extensionUri, 
                    'media',
                    'test', // ilisan ug 'kentface' if di na test
                    image)
            );

            view.webview.html = this.getHtml(imageUri, errors);
        };

        update();

        this.context.subscriptions.push(
            vscode.languages.onDidChangeDiagnostics(update)
        );
    }

    private getHtml(imageUri: vscode.Uri, errors: number): string {
        const errorsText = errors === 0 ? 'none' : String(errors);

        return `
            <html>
                <body style="
                    margin:0;
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                    height:100vh;
                    background:#1e1e1e;
                    color:#d4d4d4;
                    font-family: sans-serif;
                ">
                    <div style="flex:1; display:flex; align-items:center; justify-content:center; width:100%;">
                        <img src="${imageUri}" style="max-width:100%; max-height:100%;" />
                    </div>
                    <div style="width:100%; padding:8px 12px; box-sizing:border-box; text-align:right; border-top:1px solid rgba(255,255,255,0.04);">
                        <span style="font-size:12px; color:#9cdcfe;">errors: ${errorsText}</span>
                    </div>
                </body>
            </html>
        `;
    }
}
