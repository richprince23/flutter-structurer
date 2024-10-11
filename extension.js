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

        // Prompt user for feature names
        const featureNamesInput = await vscode.window.showInputBox({
            prompt: 'Enter the name(s) of the Feature(s) - (comma-separated for multiple)'
        });

        if (!featureNamesInput) {
            vscode.window.showErrorMessage('No feature name(s) provided!');
            return;
        }

        const featureNames = featureNamesInput.split(',').map(name => name.trim()).filter(name => name !== '');

        if (featureNames.length === 0) {
            vscode.window.showErrorMessage('No valid feature name(s) provided!');
            return;
        }

        const projectPath = uri.fsPath;
        const libFolderPath = path.join(projectPath, 'lib');
        const foldersToCreate = ['data', 'models', 'widgets', 'pages', 'providers', 'services'];

        // Check if 'lib' folder exists, if not, create it
        if (!fs.existsSync(libFolderPath)) {
            fs.mkdirSync(libFolderPath);
        }

        for (const featureName of featureNames) {
            const featureFolderPath = path.join(libFolderPath, featureName);

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
        }

        vscode.window.showInformationMessage(`All requested Flutter features have been created!`);
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};