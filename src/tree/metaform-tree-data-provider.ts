import * as vscode from 'vscode';
import { getApi } from "../api/api";
import Config from '../config';
import { EmailNotification, ExportTheme, Metaform } from '../generated/client/api';

/**
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
    if (!element) {
      return this.listRootItems();
    }
    
    const apiName = element.getApiName();

    switch (element.contextValue || "") {
			case 'metaforms':
				return this.listMetaformItems(apiName);
			case 'metaform':
				const metaformItem = element as MetaformTreeItem;
				return this.listMetaformRoots(apiName, metaformItem.id);
			case 'pdfexportthemes':
				return this.listPdfExportThemeItems(apiName);
			case 'emailnotifications':
				const emailNotificationItem = element as EmailNotificationsTreeItem;
		    return this.listEmailNotificationItems(apiName, emailNotificationItem.metaformId);
			default:
				return this.listFormRootItems(apiName);
		}
	}
	
	/**
	 * Lists api nodes
	 * 
	 * @returns api nodes
	 */
	private async listRootItems() {
    return Config.getApiNames().map(apiName => new ApiTreeItem(apiName));
	}
	
	/**
	 * Lists metaform roots
	 * 
   * @param apiName name of API
	 * @param metaformId metaform id
	 * @returns root tree items
	 */
	private async listMetaformRoots(apiName: string, metaformId?: string) {
		if (!metaformId) {
			return [];
		}

		return [
			new EmailNotificationsTreeItem(apiName, metaformId)
		];
	}

	/**
	 * Lists root tree items
	 * 
   * @param apiName API name
	 * @returns root tree items
	 */
	private async listFormRootItems(apiName: string) {
		return [
			new MetaformsTreeItem(apiName),
			new PdfExportThemesTreeItem(apiName)
		];
	}

	/**
	 * Lists Metaforms as tree items
	 * 
   * @param apiName API name
	 * @returns Metaforms as tree items
	 */
  private async listMetaformItems(apiName: string) {
    const metaforms = await getApi(apiName).listMetaforms();
		return metaforms.map(metaform => new MetaformTreeItem(apiName, metaform));
  }

	/**
	 * Lists PDF export themes as tree items
	 * 
   * @param apiName API name
	 * @returns PDF export themes as tree items
	 */
  private async listPdfExportThemeItems(apiName: string) {
    const exportThemes = await getApi(apiName).listExportThemes();
		return exportThemes.map(exportTheme => new PdfExportThemeTreeItem(apiName, exportTheme));
  }

	/**
	 * Lists email notifications as tree items
	 * 
   * @param apiName API name
	 * @param metaformId metaform id
	 * @returns PDF export themes as tree items
	 */
  private async listEmailNotificationItems(apiName: string, metaformId: string) {
		const emailNotifications = await getApi(apiName).listEmailNotifications(metaformId);
		return emailNotifications.map(emailNotification => new EmailNotificationTreeItem(apiName, emailNotification, metaformId));
  }
  
}

/**
 * Abstract base class for all tree items
 */
export abstract class AbstractTreeItem extends vscode.TreeItem {

  private apiName: string;

	/**
	 * Constructor
	 * 
   * @param apiName API name
	 * @param title item title
	 * @param collapsibleState collapsible state
	 * @param id optional id
	 */
	constructor(apiName: string, title: string, collapsibleState: vscode.TreeItemCollapsibleState, id?: string) {
		super(title, collapsibleState);
    this.id = id;
    this.apiName = apiName;
  }
  
  /**
   * Returns name of API node is attached to
   * 
   * @returns name of API node is attached to
   */
  public getApiName() {
    return this.apiName;
  }

}

/**
 * Tree item for metaforms folder
 */
export class MetaformsTreeItem extends AbstractTreeItem {

	/**
	 * Constructor
   * 
   * @param apiName name of API
	 */
	constructor(apiName: string) {
		super(apiName, "Metaforms", vscode.TreeItemCollapsibleState.Expanded);
	}
	
	contextValue = 'metaforms';
}

/**
 * Tree item for metaforms folder
 */
export class ApiTreeItem extends AbstractTreeItem {

	/**
	 * Constructor
   * 
   * @param apiName name of API
	 */
	constructor(apiName: string) {
		super(apiName, apiName, vscode.TreeItemCollapsibleState.Expanded);
	}
	
	contextValue = 'api';
}

/**
 * Tree item for email notifications folder
 */
export class EmailNotificationsTreeItem extends AbstractTreeItem {

	public metaformId: string;

	/**
	 * Constructor
   * 
   * @param apiName name of API
	 */
	constructor(apiName: string, metaformId: string) {
		super(apiName, "Email Notifications", vscode.TreeItemCollapsibleState.Expanded);
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
   * @param apiName name of API
	 * @param emailNotification email notification
	 * @param metaformId metaform id
	 */
	constructor(apiName: string, emailNotification: EmailNotification, metaformId: string) {
		super(apiName, emailNotification.emails[0] || "Untitled", vscode.TreeItemCollapsibleState.None, emailNotification.id);
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
   * @param apiName name of API
	 * @param exportTheme export theme
	 */
	constructor(apiName: string, exportTheme: ExportTheme) {
		super(apiName, exportTheme.name, vscode.TreeItemCollapsibleState.None, exportTheme.id);
	}
	
	contextValue = 'pdfexporttheme';
}

/**
 * Tree item for single PDF export theme
 */
export class PdfExportThemesTreeItem extends AbstractTreeItem {

	/**
	 * Constructor
   * 
   * @param apiName name of API
	 */
	constructor(apiName: string) {
		super(apiName, "PDF Export themes", vscode.TreeItemCollapsibleState.Expanded);
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
   * @param apiName name of API
	 * @param metaform metaform
	 */
	constructor(apiName: string, metaform: Metaform) {
		super(apiName, metaform.title || metaform.id || "Untitled", vscode.TreeItemCollapsibleState.Expanded, metaform.id);
	}
	
	contextValue = 'metaform';
}
