import * as vscode from 'vscode';
import Api from './api/api';
import { MetaformTreeDataProvider, MetaformTreeItem } from './tree/metaform-tree-data-provider';
import * as fs from 'fs';
import { Metaform } from './generated/client/api';

export function activate(context: vscode.ExtensionContext) {

	vscode.window.registerTreeDataProvider('metaformTreeDataProvider', new MetaformTreeDataProvider());

	vscode.commands.registerCommand('metaformTreeDataProvider.getMetaform', async (node: MetaformTreeItem) => {
		const id = node.id!;
		const rootPath = vscode.workspace.rootPath || "";
		const metaform = await Api.findMetaform(node.id!);

		if (metaform) {
			const formPath = `${rootPath}/${metaform.id}.json`;
			fs.writeFileSync(formPath, JSON.stringify(metaform, null, 2), 'utf-8');
			vscode.window.showInformationMessage(`Successfully read metaform JSON into ${formPath}.`)
		} else {
			vscode.window.showErrorMessage("Failed to fetch Metaform")
		}
	});
	
	vscode.commands.registerCommand('metaformTreeDataProvider.putMetaform', async (node: MetaformTreeItem) => {
		const id = node.id!;
		const rootPath = vscode.workspace.rootPath || "";

		const value = await vscode.window.showInputBox({
			prompt: "Are you sure?",
			value: "Yes"
		});

		if (value && value.toLowerCase() == "yes") {
			vscode.window.showInformationMessage(`Updating metaform ${id}...`);
			const formPath = `${rootPath}/${id}.json`;
			const metaform = JSON.parse(fs.readFileSync(formPath, 'utf-8')) as Metaform;
			await Api.updateMetaform(metaform);
			vscode.window.showInformationMessage(`Successfully updated metaform ${id}`)			
		}
	});
	
	vscode.commands.registerCommand('metaformTreeDataProvider.deleteMetaform', async (node: MetaformTreeItem) => {
		const id = node.id!;
		const value = await vscode.window.showInputBox({
			prompt: "Are you sure?",			
		});

		if (value) {
			const metaform = await Api.deleteMetaform(id);
			vscode.window.showInformationMessage(`Successfully deleted metaform ${id}`)
		}
	});

}

export function deactivate() {}
