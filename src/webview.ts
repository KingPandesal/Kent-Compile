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
                    overflow:hidden;
                ">
                    <div style="
                        flex:1; 
                        display:flex; 
                        align-items:center; 
                        justify-content:center; 
                        width:100%;
                        overflow:hidden;
                    ">
                        <img src="${imageUri}" style="
                            width:100%;
                            height:100%;
                            max-width:240px;
                            max-height:240px;
                            object-fit:contain;
                            transition: all 0.15s ease;
                        " />
                    </div>

                    <div style="
                        width:100%; 
                        padding:4px 8px; 
                        box-sizing:border-box; 
                        text-align:center; 
                        border-top:1px solid rgba(255,255,255,0.04);
                        overflow:hidden;
                    ">
                        <span style="
                            font-size:12px; 
                            color: rgb(255,255,255);
                        ">errors: ${errorsText}</span>
                    </div>
                </body>
            </html>
        `;
    }
}
