import * as vscode from 'vscode';

export function countErrors(): number {
    let total = 0;

    for (const [, diagnostics] of vscode.languages.getDiagnostics()) {
        total += diagnostics.filter(
            d => d.severity === vscode.DiagnosticSeverity.Error
        ).length; 
    }

    return total;
}
