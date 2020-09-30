import Auth from "../auth";
import Config from "../config";
// eslint-disable-next-line max-len
import { Authentication, ExportThemeFile, ExportThemeFilesApi, ExportThemesApi, Metaform, MetaformsApi, OAuth} from "../generated/client/api";

interface AuthenticatedApi {  
  setDefaultAuthentication: (auth: Authentication) => void
}

const basePath = Config.getApiConfig().url;

export default new class Api {

  /**
   * Finds an export theme from API
   * 
   * @param id id
   * @returns export theme
   */
  public async findExportTheme(id: string) {
    try {
      const api = await this.getExportThemesApi();
      return (await api.findExportTheme(id)).body;
    } catch (e) {
      console.error("Failed to find export theme", e);
      throw e;
    }
  }

  /**
   * Lists export themes from API
   * 
   * @returns export themes
   */
  public async listExportThemes() {
    try {
      const api = await this.getExportThemesApi();
      return (await api.listExportThemes()).body;
    } catch (e) {
      console.error("Failed to list export themes", e);
      throw e;
    }
  }

  /**
   * Creates export theme file into API
   * 
   * @param exportThemeFile export theme file to be created
   * @returns created export theme file
   */
  public async createExportThemeFile(exportThemeFile: ExportThemeFile) {
    try {
      const api = await this.getExportThemeFilesApi();
      return (await api.createExportThemeFile(exportThemeFile, exportThemeFile.themeId)).body;
    } catch (e) {
      console.error("Failed to create export theme file", e);
      throw e;
    }
  }

  /**
   * Lists export theme files from API
   * 
   * @param exportThemeId export theme id
   * @returns export theme files
   */
  public async listExportThemeFiles(exportThemeId: string) {
    try {
      const api = await this.getExportThemeFilesApi();
      return (await api.listExportThemeFiles(exportThemeId)).body;
    } catch (e) {
      console.error("Failed to list export themes", e);
      throw e;
    }
  }  

  /**
   * Updates export theme file into API
   * 
   * @param exportThemeFile export theme file to be updated
   * @returns export theme files
   */
  public async updateExportThemeFile(exportThemeFile: ExportThemeFile) {
    try {
      const api = await this.getExportThemeFilesApi();
      return (await api.updateExportThemeFile(exportThemeFile, exportThemeFile.themeId, exportThemeFile.id!)).body;
    } catch (e) {
      console.error("Failed to update export theme file", e);
      throw e;
    }
  }

  /**
   * Deletes export theme file from API
   * 
   * @param exportThemeFile export theme file to be delete
   */
  public async deleteExportThemeFile(exportThemeFile: ExportThemeFile) {
    try {
      const api = await this.getExportThemeFilesApi();
      return (await api.deleteExportThemeFile(exportThemeFile.themeId, exportThemeFile.id!)).body;
    } catch (e) {
      console.error("Failed to delete export theme file", e);
      throw e;
    }
  }

  /**
   * Finds a metaform from API
   * 
   * @param id id
   * @returns metaform
   */
  public async findMetaform(id: string) {
    try {
      const api = await this.getMetaformsApi();
      return (await api.findMetaform(id)).body;
    } catch (e) {
      console.error("Failed to find metaform", e);
      throw e;
    }
  }

  /**
   * Lists metaforms from API
   * 
   * @returns metaforms
   */
  public async listMetaforms() {
    try {
      const api = await this.getMetaformsApi();
      return (await api.listMetaforms()).body;
    } catch (e) {
      console.error("Failed to list metaforms", e);
      throw e;
    }
  }

  public async updateMetaform(metaform: Metaform) {
    try {
      const api = await this.getMetaformsApi();
      (await api.updateMetaform(metaform, metaform.id!));
    } catch (e) {
      console.error("Failed to delete metaform", e);
      throw e;
    }
  }

  public async deleteMetaform(id: string) {
    try {
      const api = await this.getMetaformsApi();
      (await api.deleteMetaform(id));
    } catch (e) {
      console.error("Failed to delete metaform", e);
      throw e;
    }
  }

  /**
   * Gets initialized metaforms api
   */
  private async getMetaformsApi() {
    return await this.applyAuthentication(new MetaformsApi(basePath));    
  }

  /**
   * Gets initialized export themes api
   */
  private async getExportThemesApi() {
    return await this.applyAuthentication(new ExportThemesApi(basePath));    
  }

  /**
   * Gets initialized export theme files api
   */
  private async getExportThemeFilesApi() {
    return await this.applyAuthentication(new ExportThemeFilesApi(basePath));    
  }

  private async applyAuthentication<T extends AuthenticatedApi>(api: T): Promise<T> {
    const accessToken = await this.getAccessToken();
    
    const auth = new OAuth();
    auth.accessToken = accessToken;
    api.setDefaultAuthentication(auth);

    return api;
  }

  private async getAccessToken(): Promise<string> {
    const accessToken = await Auth.getAccessToken();
    return accessToken?.access_token;
  }

}
