import * as vscode from 'vscode';
import Api from "../api/api";
import { ExportTheme, Metaform } from '../generated/client/api';

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
    switch (element?.contextValue || "") {
			case 'metaforms':
				return this.listMetaformItems();
			case 'pdfexportthemes':
				return this.listPdfExportThemeItems();
			default:
				return this.listRootItems();
		}
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
    const metaforms = await Api.listMetaforms();
		return metaforms.map(metaform => new MetaformTreeItem(metaform));
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
		super(metaform.title || metaform.id || "Untitled", vscode.TreeItemCollapsibleState.None, metaform.id);
	}
	
	contextValue = 'metaform';
}
