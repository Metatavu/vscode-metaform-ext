import * as vscode from 'vscode';
import Api from './api/api';
import { MetaformTreeDataProvider, MetaformTreeItem, PdfExportThemesTreeItem } from './tree/metaform-tree-data-provider';
import * as fs from 'fs';
import * as path from "path";
import { Metaform } from './generated/client/api';
import { promisify } from "util";
import api from './api/api';

const readdirPromise = promisify(fs.readdir);
const statPromise = promisify(fs.stat);

/**
 * Recursively reads all files in given folder
 * 
 * @param folder folder
 * @returns promise for recursive file tree
 */
const readTree = async (folder: string): Promise<string[]> => {
	const files = await readdirPromise(folder);

  const subfiles: string[][] =  await Promise.all(files.map(async (file) => {
		const absoluteFile = path.resolve(folder, file);
		const fileStat = await statPromise(absoluteFile);
    return fileStat.isDirectory() ? readTree(absoluteFile) : [ absoluteFile ];
	}));
	
  return subfiles.reduce((a, b) => a.concat(b, []));
}

/**
 * Method for extension activation
 * 
 * @param context extension context
 */
export function activate(context: vscode.ExtensionContext) {

	const metaformTreeDataProvider = new MetaformTreeDataProvider();
	vscode.window.registerTreeDataProvider('metaformTreeDataProvider', metaformTreeDataProvider);
	vscode.commands.registerCommand('metaformTreeDataProvider.refresh', () => metaformTreeDataProvider.refresh());

	vscode.commands.registerCommand('metaformTreeDataProvider.downloadMetaform', async (node: MetaformTreeItem) => {
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

	vscode.commands.registerCommand('metaformTreeDataProvider.downloadPdfExportTheme', async (node: PdfExportThemesTreeItem) => {
		const id = node.id!;
		const rootPath = vscode.workspace.rootPath || "";
		const theme = await Api.findExportTheme(id);
		const files = await Api.listExportThemeFiles(id);

		if (theme) {
			const basePath = `${rootPath}/metaform/export-themes/${theme.name}/`;

			files.forEach(file => {
				const filePath = basePath + file.path;
				const folder = path.resolve(filePath, "..");
				fs.mkdirSync(folder, { recursive: true });
				fs.writeFileSync(filePath, file.content, 'utf-8');
			});
			
			vscode.window.showInformationMessage(`Successfully downloaded theme ${basePath}.`)
		} else {
			vscode.window.showErrorMessage("Failed to download theme")
		}
	});

	vscode.commands.registerCommand('metaformTreeDataProvider.updatePdfExportTheme', async (node: PdfExportThemesTreeItem) => {
		const id = node.id!;
		const rootPath = vscode.workspace.rootPath || "";
		const theme = await Api.findExportTheme(id);
		const existingFiles = await Api.listExportThemeFiles(id);

		if (theme) {
			let createCount: number = 0;
			let updateCount: number = 0;
			let deleteCount: number = 0;

			const basePath = `${rootPath}/metaform/export-themes/${theme.name}/`;
			const files = await readTree(basePath);

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const relativePath = file.substring(basePath.length);			
				const index = existingFiles.findIndex(existingFile => existingFile.path === relativePath);
				const content = fs.readFileSync(file, 'utf-8');

				if (index > -1) {
					const updateFile = existingFiles.splice(index, 1)[0];
					if (content && content !== updateFile.content) {
						await api.updateExportThemeFile({ ...updateFile, content: content });
					}
					updateCount++;
				} else {
					createCount++;
					if (content) {
            await api.createExportThemeFile({ path: relativePath, themeId: theme.id!, content: content });
					}
				}
			}

			for (let i = 0; i < existingFiles.length; i++) {
				await api.deleteExportThemeFile(existingFiles[i]);
				deleteCount++;
			}

			vscode.window.showInformationMessage(`Successfully updated theme ${theme.name}. Files updated: ${updateCount}, created ${createCount}, deleted ${deleteCount}.`)
		} else {
			vscode.window.showErrorMessage("Failed to update theme")
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
