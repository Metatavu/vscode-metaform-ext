import * as vscode from 'vscode';
import { ApiConfig, AuthConfig } from '../types';

/**
 * Helper class for reading configuration
 */
export default class Config {

  /**
   * Returns list of configured API names
   * 
   * @returns list of configured API names
   */
  public static getApiNames() {
    const config = vscode.workspace.getConfiguration("metaform.apis");
    const keys = Object.keys(config);
    return keys.filter(key => config.has(key));
  }

	/**
	 * Returns authentication configuration
	 * 
   * @param apiName API name
	 * @returns authentication configuration
	 */
	public static getAuthConfig(apiName: string) {
    return (vscode.workspace.getConfiguration("metaform.apis") as any)[apiName].auth;
	}

	/**
	 * Returns api configuration
	 * 
   * @param apiName API name
	 * @returns api configuration
	 */
	public static getApiConfig(apiName: string) {
    return (vscode.workspace.getConfiguration("metaform.apis") as any)[apiName].api;
	}

}
