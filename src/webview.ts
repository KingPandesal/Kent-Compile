/// summary:
/// dri nga file makita ug unsay makita sa explorer tree

import * as vscode from 'vscode';
import * as fs from 'fs';
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

            const albumName = vscode.workspace.getConfiguration().get<string>('kentCompile.album') || 'ken-default';

            // absolute path sa album folder (for fs.existsSync)
            let albumPath = vscode.Uri.joinPath(
                this.context.extensionUri,
                'media',
                'album',
                albumName
            ).fsPath;

            let usedAlbum = albumName;
            if (!fs.existsSync(albumPath)) {
                usedAlbum = 'Ken Default';
                albumPath = vscode.Uri.joinPath(
                    this.context.extensionUri,
                    'media',
                    'album',
                    usedAlbum
                ).fsPath;
                vscode.window.showWarningMessage(`Album '${albumName}' not found — falling back to 'Ken Default'.`);
            }

            const image = getFaceImage(errors, albumPath);

            // convert to webview-safe URI
            const imageUri = view.webview.asWebviewUri(
                vscode.Uri.joinPath(
                    this.context.extensionUri,
                    'media',
                    'album',
                    usedAlbum,
                    image
                )
            );

            view.webview.html = this.getHtml(imageUri, errors);
        };

        update();

        this.context.subscriptions.push(
            vscode.languages.onDidChangeDiagnostics(update)
        );

        // update when the album configuration changes
        const configSub = vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('kentCompile.album')) {
                update();
            }
        });

        this.context.subscriptions.push(configSub);
    }

    private getHtml(imageUri: vscode.Uri, errors: number): string {
        // const errorsText = errors === 0 ? 'none' : String(errors);
        const hoverText = errors === 0 ? 'No errors' : (errors === 1 ? '1 error' : `${errors} errors`);

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
                        <img src="${imageUri}" title="${hoverText}" alt="Ken face — ${hoverText}" style="
                            width:100%;
                            height:100%;
                            max-width:240px;
                            max-height:240px;
                            object-fit:contain;
                            transition: all 0.15s ease;
                        " />
                    </div>
                </body>
            </html>
        `;
    }
}
