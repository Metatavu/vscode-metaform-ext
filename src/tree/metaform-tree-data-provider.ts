import { isIP } from 'net';
import * as vscode from 'vscode';
import Api from "../api/api";
import Config from '../config';
import { EmailNotification, ExportTheme, Metaform } from '../generated/client/api';

/**https://example-auth.metaform.fi/auth
 * Tree data provider for Metaform data
 */
export class MetaformTreeDataProvider implements vscode.TreeDataProvider<AbstractTreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<AbstractTreeItem | undefined> = new vscode.EventEmitter<AbstractTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<AbstractTreeItem | undefined> = this._onDidChangeTreeData.event;

	/**
	 * Refreshes the tree
	 */
	public refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	/**
	 * Returns element as tree item
	 * 
	 * @param element element
	 * @returns tree item
	 */
	public getTreeItem(element: MetaformTreeItem): vscode.TreeItem {
		return element;
  }
	
	/**
	 * Returns child items for given element
	 * 
	 * @param element element
	 * @returns child items
	 */
	public getChildren(element?: AbstractTreeItem): Thenable<MetaformTreeItem[]> {
    switch (element?.contextValue || "") {
			case 'metaforms':
				return this.listMetaformItems();
			case 'metaform':
				const metaformItem = element as MetaformTreeItem;
				return this.listMetaformRoots(metaformItem.id);
			case 'pdfexportthemes':
				return this.listPdfExportThemeItems();
			case 'emailnotifications':
				const emailNotificationItem = element as EmailNotificationsTreeItem;
		    return this.listEmailNotificationItems(emailNotificationItem.metaformId);
			default:
				return this.listRootItems();
		}
	}
	
	/**
	 * Lists metaform roots
	 * 
	 * @param metaformId metaform id
	 * @returns root tree items
	 */
	private async listMetaformRoots(metaformId?: string) {
		if (!metaformId) {
			return [];
		}

		return [
			new EmailNotificationsTreeItem(metaformId)
		];
	}

	/**
	 * Lists root tree items
	 * 
	 * @returns root tree items
	 */
	private async listRootItems() {
		return [
			new MetaformsTreeItem(),
			new PdfExportThemesTreeItem()
		];
	}

	/**
	 * Lists Metaforms as tree items
	 * 
	 * @returns Metaforms as tree items
	 */
  private async listMetaformItems() {
	  const metaformApis = Config.getApiConfig().multipleApis;
	
	  const metaformLists = await Promise.all(metaformApis.map(metaformApi=>{
		  console.log(metaformApi);
		Api.setBasePath(metaformApi.apiAddress); 
		Api.setKeycloakPassword(metaformApi.authPassword);
		Api.setKeycloakUser(metaformApi.authUser);
		Api.setKeycloakRealm(metaformApi.authRealm);
		Api.setKeycloakUrl(metaformApi.authUrl);
		Api.setKeycloakClientId(metaformApi.authClientId);
		Api.setkeycloakSecret(metaformApi.authClientSecret);
		return Api.listMetaforms();
	  }));
       console.log(metaformLists);
	  let treeItems: MetaformTreeItem[] = [];

	  metaformLists.forEach(metaformList => {
		treeItems = treeItems.concat(metaformList.map(metaform=> new MetaformTreeItem(metaform)));
	  });

	  console.log(treeItems);

	 return treeItems;
  }

	/**
	 * Lists PDF export themes as tree items
	 * 
	 * @returns PDF export themes as tree items
	 */
  private async listPdfExportThemeItems() {
    const exportThemes = await Api.listExportThemes();
		return exportThemes.map(exportTheme => new PdfExportThemeTreeItem(exportTheme));
  }

	/**
	 * Lists email notifications as tree items
	 * 
	 * @param metaformId metaform id
	 * @returns PDF export themes as tree items
	 */
  private async listEmailNotificationItems(metaformId: string) {
		const emailNotifications = await Api.listEmailNotifications(metaformId);
		return emailNotifications.map(emailNotification => new EmailNotificationTreeItem(emailNotification, metaformId));
  }
  
}

/**
 * Abstract base class for all tree items
 */
export abstract class AbstractTreeItem extends vscode.TreeItem {

	/**
	 * Constructor
	 * 
	 * @param title item title
	 * @param collapsibleState collapsible state
	 * @param id optional id
	 */
	constructor(title: string, collapsibleState: vscode.TreeItemCollapsibleState, id?: string) {
		super(title, collapsibleState);
		this.id = id;
	}

}

/**
 * Tree item for metaforms folder
 */
export class MetaformsTreeItem extends AbstractTreeItem {

	/**
	 * Constructor
	 */
	constructor() {
		super("Metaforms", vscode.TreeItemCollapsibleState.Expanded);
	}
	
	contextValue = 'metaforms';
}

/**
 * Tree item for email notifications folder
 */
export class EmailNotificationsTreeItem extends AbstractTreeItem {

	public metaformId: string;

	/**
	 * Constructor
	 */
	constructor(metaformId: string) {
		super("Email Notifications", vscode.TreeItemCollapsibleState.Expanded);
		this.metaformId = metaformId;
	}
	
	contextValue = 'emailnotifications';
}

/**
 * Tree item for email notification item
 */
export class EmailNotificationTreeItem extends AbstractTreeItem {

	public metaformId: string;

	/**
	 * Constructor
	 * 
	 * @param emailNotification email notification
	 * @param metaformId metaform id
	 */
	constructor(emailNotification: EmailNotification, metaformId: string) {
		super(emailNotification.emails[0] || "Untitled", vscode.TreeItemCollapsibleState.None, emailNotification.id);
		this.metaformId = metaformId;
	}
	
	contextValue = 'emailnotification';
}

/**
 * Tree item for PDF export themes folder
 */
export class PdfExportThemeTreeItem extends AbstractTreeItem {

	/**
	 * Constructor
	 * 
	 * @param exportTheme export theme
	 */
	constructor(exportTheme: ExportTheme) {
		super(exportTheme.name, vscode.TreeItemCollapsibleState.None, exportTheme.id);
	}
	
	contextValue = 'pdfexporttheme';
}

/**
 * Tree item for single PDF export theme
 */
export class PdfExportThemesTreeItem extends AbstractTreeItem {

	/**
	 * Constructor
	 */
	constructor() {
		super("PDF Export themes", vscode.TreeItemCollapsibleState.Expanded);
	}
	
	contextValue = 'pdfexportthemes';
}

/**
 * Tree item for single metaform
 */
export class MetaformTreeItem extends AbstractTreeItem {

	/**
	 * Constructor
	 * 
	 * @param metaform metaform
	 */
	constructor(metaform: Metaform) {
		super(metaform.title || metaform.id || "Untitled", vscode.TreeItemCollapsibleState.Expanded, metaform.id);
	}
	
	contextValue = 'metaform';
}
