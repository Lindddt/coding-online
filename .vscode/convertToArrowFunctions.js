// 批量将函数转换为箭头函数
const vscode = require('vscode');

function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.convertToArrowFunctions', function () {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const selection = editor.selection;

      const text = document.getText(selection);
      const convertedText = text.replace(/function\s*\((.*?)\)\s*{/g, '($1) => {');

      editor.edit(builder => {
        builder.replace(selection, convertedText);
      });
    }
  });

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
