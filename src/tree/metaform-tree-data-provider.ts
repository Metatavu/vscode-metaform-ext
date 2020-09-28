import * as vscode from 'vscode';
import Api from "../api/api";
import { Metaform } from '../generated/client/api';

export class MetaformTreeDataProvider implements vscode.TreeDataProvider<MetaformTreeItem> {

	public refresh(): void {
	}

	public getTreeItem(element: MetaformTreeItem): vscode.TreeItem {
		return element;
  }
  
	public getChildren(element?: MetaformTreeItem): Thenable<MetaformTreeItem[]> {
    return this.listMetaformItems();
  }

  private async listMetaformItems() {
    const metaforms = await Api.listMetaforms();
		return metaforms.map(metaform => new MetaformTreeItem(metaform));
  }
  
}

export class MetaformTreeItem extends vscode.TreeItem {

	constructor(metaform: Metaform) {
		super(metaform.title || metaform.id || "Untitled", vscode.TreeItemCollapsibleState.None);
		this.id = metaform.id;
	}
	
	contextValue = 'metaform';
}
