import * as vscode from 'vscode';
import { getApi } from './api/api';
import { MetaformTreeDataProvider, MetaformTreeItem, PdfExportThemesTreeItem, EmailNotificationTreeItem, EmailNotificationsTreeItem } from './tree/metaform-tree-data-provider';
import * as fs from 'fs';
import * as path from "path";
import { EmailNotification, Metaform } from './generated/client/api';
import { promisify } from "util";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
};

/**
 * Writes a file to local file
 * 
 * @param filePath file path
 * @param content content
 */
const writeFile = (filePath: string, content: string) => {
	const folder = path.resolve(filePath, "..");
	fs.mkdirSync(folder, { recursive: true });
	fs.writeFileSync(filePath, content, 'utf-8');
};

/**
 * Method for extension activation
 * 
 * @param context extension context
 */
export function activate(context: vscode.ExtensionContext) {

	const metaformTreeDataProvider = new MetaformTreeDataProvider();
	vscode.window.registerTreeDataProvider('metaformTreeDataProvider', metaformTreeDataProvider);
	vscode.commands.registerCommand('metaformTreeDataProvider.refresh', () => metaformTreeDataProvider.refresh());

	vscode.commands.registerCommand('metaformTreeDataProvider.createMetaform', async (node: MetaformTreeItem) => {
		await getApi(node.getApiName()).createMetaform({});
    metaformTreeDataProvider.refresh();
  });
  
	vscode.commands.registerCommand('metaformTreeDataProvider.downloadMetaform', async (node: MetaformTreeItem) => {
		const rootPath = vscode.workspace.rootPath || "";
		const metaform = await getApi(node.getApiName()).findMetaform(node.id!);

		if (metaform) {
			const formPath = `${rootPath}/${metaform.id}.json`;
			fs.writeFileSync(formPath, JSON.stringify(metaform, null, 2), 'utf-8');
			vscode.window.showInformationMessage(`Successfully read metaform JSON into ${formPath}.`);
		} else {
			vscode.window.showErrorMessage("Failed to fetch Metaform");
		}
	});

	vscode.commands.registerCommand('metaformTreeDataProvider.downloadPdfExportTheme', async (node: PdfExportThemesTreeItem) => {
		const id = node.id!;
		const rootPath = vscode.workspace.rootPath || "";
		const theme = await getApi(node.getApiName()).findExportTheme(id);
		const files = await getApi(node.getApiName()).listExportThemeFiles(id);

		if (theme) {
			const basePath = `${rootPath}/metaform/export-themes/${theme.name}/`;

			files.forEach(file => {
				writeFile(basePath + file.path, file.content);
			});
			
			vscode.window.showInformationMessage(`Successfully downloaded theme ${basePath}.`);
		} else {
			vscode.window.showErrorMessage("Failed to download theme");
		}
	});

	vscode.commands.registerCommand('metaformTreeDataProvider.updatePdfExportTheme', async (node: PdfExportThemesTreeItem) => {
		const id = node.id!;
		const rootPath = vscode.workspace.rootPath || "";
		const theme = await getApi(node.getApiName()).findExportTheme(id);
		const existingFiles = await getApi(node.getApiName()).listExportThemeFiles(id);

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
						await getApi(node.getApiName()).updateExportThemeFile({ ...updateFile, content: content });
					}
					updateCount++;
				} else {
					createCount++;
					if (content) {
            await getApi(node.getApiName()).createExportThemeFile({ path: relativePath, themeId: theme.id!, content: content });
					}
				}
			}

			for (let i = 0; i < existingFiles.length; i++) {
				await getApi(node.getApiName()).deleteExportThemeFile(existingFiles[i]);
				deleteCount++;
			}

			vscode.window.showInformationMessage(`Successfully updated theme ${theme.name}. Files updated: ${updateCount}, created ${createCount}, deleted ${deleteCount}.`);
		} else {
			vscode.window.showErrorMessage("Failed to update theme");
		}
	});

	vscode.commands.registerCommand('metaformTreeDataProvider.downloadEmailNotification', async (node: EmailNotificationTreeItem) => {
		const metaformId = node.metaformId;
		const emailNotificationId = node.id!;
		const emailNotification = await getApi(node.getApiName()).findEmailNotification(metaformId, emailNotificationId);
		const rootPath = vscode.workspace.rootPath || "";
		
		if (emailNotification) {
			const filePath = `${rootPath}/metaform/${metaformId}/email-notifications/${emailNotificationId}.json`;
			writeFile(filePath, JSON.stringify(emailNotification, null, 2));		
			vscode.window.showInformationMessage(`Successfully downloaded email notification ${filePath}.`);
		} else {
			vscode.window.showErrorMessage(`Failed to downloaded email notification ${emailNotificationId}.`);
		}
	});

	vscode.commands.registerCommand('metaformTreeDataProvider.createEmailNotification', async (node: EmailNotificationsTreeItem) => {
		const metaformId = node.metaformId;
		
		await getApi(node.getApiName()).createEmailNotification(metaformId, {
			'subjectTemplate': 'Example subject',
			'contentTemplate': 'Example content',
			'emails': ["reciepient@example.com"],
			'notifyIf': {
				"field": "example",
				"equals": "value"
			}
		});

		metaformTreeDataProvider.refresh();
	});

	vscode.commands.registerCommand('metaformTreeDataProvider.updateEmailNotification', async (node: EmailNotificationTreeItem) => {
		const metaformId = node.metaformId;
		const emailNotificationId = node.id!;
		const rootPath = vscode.workspace.rootPath || "";
		const filePath = `${rootPath}/metaform/${metaformId}/email-notifications/${emailNotificationId}.json`;

		const value = await vscode.window.showInputBox({
			prompt: "Are you sure?",
			value: "Yes"
		});

		if (value && value.toLowerCase() === "yes") {
			vscode.window.showInformationMessage(`Updating email notification ${emailNotificationId}...`);
			const emailNotification = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as EmailNotification;
			await getApi(node.getApiName()).updateEmailNotification(metaformId, emailNotification);
			vscode.window.showInformationMessage(`Successfully updated email notification ${emailNotificationId}`);
		}

		metaformTreeDataProvider.refresh();
	});

	vscode.commands.registerCommand('metaformTreeDataProvider.deleteEmailNotification', async (node: EmailNotificationTreeItem) => {
		const metaformId = node.metaformId;
		const emailNotificationId = node.id!;

		const value = await vscode.window.showInputBox({
			prompt: "Are you sure?",
			value: "Yes"
		});

		if (value && value.toLowerCase() === "yes") {
			vscode.window.showInformationMessage(`Deleting email notification ${emailNotificationId}...`);
			await getApi(node.getApiName()).deleteEmailNotification(metaformId, emailNotificationId);
			vscode.window.showInformationMessage(`Successfully deleted email notification ${emailNotificationId}`);
		}

		metaformTreeDataProvider.refresh();
	});
	
	vscode.commands.registerCommand('metaformTreeDataProvider.putMetaform', async (node: MetaformTreeItem) => {
		const id = node.id!;
		const rootPath = vscode.workspace.rootPath || "";

		const value = await vscode.window.showInputBox({
			prompt: "Are you sure?",
			value: "Yes"
		});

		if (value && value.toLowerCase() === "yes") {
			vscode.window.showInformationMessage(`Updating metaform ${id}...`);
			const formPath = `${rootPath}/${id}.json`;
			const metaform = JSON.parse(fs.readFileSync(formPath, 'utf-8')) as Metaform;
			await getApi(node.getApiName()).updateMetaform(metaform);
			vscode.window.showInformationMessage(`Successfully updated metaform ${id}`);	
		}
	});
	
	vscode.commands.registerCommand('metaformTreeDataProvider.deleteMetaform', async (node: MetaformTreeItem) => {
		const id = node.id!;
		const value = await vscode.window.showInputBox({
			prompt: "Are you sure?",			
		});

		if (value) {
			const metaform = await getApi(node.getApiName()).deleteMetaform(id);
			vscode.window.showInformationMessage(`Successfully deleted metaform ${id}`);
		}
	});

}

export function deactivate() {}
