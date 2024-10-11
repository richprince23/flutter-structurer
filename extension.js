const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.createFlutterFeature', async function (uri) {
        if (!uri) {
            uri = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select project folder'
            });

            if (!uri || uri.length === 0) {
                vscode.window.showErrorMessage('No folder selected.');
                return;
            }

            uri = uri[0];
        }

        // Prompt user for feature name
        const featureName = await vscode.window.showInputBox({
            prompt: 'Enter the name of the Feature/Module'
        });

        if (!featureName) {
            vscode.window.showErrorMessage('No feature name provided!');
            return;
        }

        const projectPath = uri.fsPath;
        const libFolderPath = path.join(projectPath, 'lib');
        const featureFolderPath = path.join(libFolderPath, featureName);
        const foldersToCreate = ['data', 'models', 'widgets', 'pages', 'providers', 'services'];

        // Check if 'lib' folder exists, if not, create it
        if (!fs.existsSync(libFolderPath)) {
            fs.mkdirSync(libFolderPath);
        }

        // Check if the feature folder exists, if not, create it
        if (!fs.existsSync(featureFolderPath)) {
            fs.mkdirSync(featureFolderPath);
        }

        // Create the subfolders inside the feature folder
        foldersToCreate.forEach(folder => {
            const folderToCreate = path.join(featureFolderPath, folder);
            if (!fs.existsSync(folderToCreate)) {
                fs.mkdirSync(folderToCreate);
                vscode.window.showInformationMessage(`Created: ${path.relative(projectPath, folderToCreate)}`);
            }
        });

        vscode.window.showInformationMessage(`Flutter feature "${featureName}" created successfully!`);
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};