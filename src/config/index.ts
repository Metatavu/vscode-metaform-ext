import * as vscode from 'vscode';
import { ApiConfig, AuthConfig } from '../types';

/**
 * Helper class for reading configuration
 */
export default class Config {

	/**
	 * Returns authentication configuration
	 * 
	 * @returns authentication configuration
	 */
	public static getAuthConfig() {
		return (vscode.workspace.getConfiguration("metaform.auth") as any) as AuthConfig;
	}

	/**
	 * Returns api configuration
	 * 
	 * @returns api configuration
	 */
	public static getApiConfig() {
		return (vscode.workspace.getConfiguration("metaform.api") as any) as ApiConfig;
	}

}