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

            view.webview.html = this.getHtml(imageUri);
        };

        update();

        this.context.subscriptions.push(
            vscode.languages.onDidChangeDiagnostics(update)
        );
    }

    private getHtml(imageUri: vscode.Uri): string {
        return `
            <html>
                <body style="
                    margin:0;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    height:100vh;
                    background:#1e1e1e;
                ">
                    <img src="${imageUri}" style="max-width:100%; max-height:100%;" />
                </body>
            </html>
        `;
    }
}
