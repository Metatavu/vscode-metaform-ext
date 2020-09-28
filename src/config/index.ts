import * as vscode from 'vscode';
import { ApiConfig, AuthConfig } from '../types';

export default class Config {

	public static getAuthConfig() {
		return (vscode.workspace.getConfiguration("metaform.auth") as any) as AuthConfig;
	}

	public static getApiConfig() {
		return (vscode.workspace.getConfiguration("metaform.api") as any) as ApiConfig;
	}

}