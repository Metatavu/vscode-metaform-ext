import Auth from "../auth";
import Config from "../config";
// eslint-disable-next-line max-len
import { ApiKeyAuth, Authentication, EmailNotification, EmailNotificationsApi, ExportThemeFile, ExportThemeFilesApi, ExportThemesApi, Metaform, MetaformsApi, OAuth} from "../generated/client/api";

interface AuthenticatedApi {  
  setDefaultAuthentication: (auth: Authentication) => void
}

/**
 * Class for handling API operations
 */
class Api {

  private apiName: string;

  /**
   * Constructor for API object
   * 
   * @param apiName API name
   */
  constructor(apiName: string) {
    this.apiName = apiName;
  }

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
   * Create email notification
   * 
   * @param metaformId metaform id
   * @param emailNotification email notification
   * @returns create email notification
   */
  public async createEmailNotification(metaformId: string, emailNotification: EmailNotification) {
    try {
      const api = await this.getEmailNotificationsApi();
      return (await api.createEmailNotification(emailNotification, metaformId)).body;
    } catch (e) {
      console.error("Failed to create email notification", e);
      throw e;
    }
  }

  /**
   * Lists email notifications from API
   * 
   * @param metaformId metaform id
   * @returns email notifications
   */
  public async listEmailNotifications(metaformId: string) {
    try {
      const api = await this.getEmailNotificationsApi();
      return (await api.listEmailNotifications(metaformId)).body;
    } catch (e) {
      console.error("Failed to list email notifications", e);
      throw e;
    }
  }

  /**
   * Update email notification
   * 
   * @param metaformId metaform id
   * @param emailNotification email notification
   * @returns update email notification
   */
  public async updateEmailNotification(metaformId: string, emailNotification: EmailNotification) {
    try {
      const api = await this.getEmailNotificationsApi();
      return (await api.updateEmailNotification(emailNotification, metaformId, emailNotification.id!)).body;
    } catch (e) {
      console.error("Failed to update email notification", e);
      throw e;
    }
  }

  /**
   * Delete email notification
   * 
   * @param metaformId metaform id
   * @param emailNotificationId email notification id
   */
  public async deleteEmailNotification(metaformId: string, emailNotificationId: string) {
    try {
      const api = await this.getEmailNotificationsApi();
      return (await api.deleteEmailNotification(metaformId, emailNotificationId));
    } catch (e) {
      console.error("Failed to delete email notification", e);
      throw e;
    }
  }

  /**
   * Find email notification from API
   * 
   * @param metaformId metaform id
   * @param emailNotificationId email notification id
   * @returns email notification
   */
  public async findEmailNotification(metaformId: string, emailNotificationId: string) {
    try {
      const api = await this.getEmailNotificationsApi();
      return (await api.findEmailNotification(metaformId, emailNotificationId)).body;
    } catch (e) {
      console.error("Failed to list email notifications", e);
      throw e;
    }
  }

  /**
   * Creates new metaform to API
   * 
   * @param id id
   * @returns metaform
   */
  public async createMetaform(metaform: Metaform) {
    try {
      const api = await this.getMetaformsApi();
      return (await api.createMetaform(metaform)).body;
    } catch (e) {
      console.error("Failed to create metaform", e);
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
      console.error("Failed to update metaform", e.body);
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
    return await this.applyAuthentication(new MetaformsApi(this.getBasePath()));    
  }

  /**
   * Gets initialized export themes api
   */
  private async getExportThemesApi() {
    return await this.applyAuthentication(new ExportThemesApi(this.getBasePath()));    
  }

  /**
   * Gets initialized export theme files api
   */
  private async getExportThemeFilesApi() {
    return await this.applyAuthentication(new ExportThemeFilesApi(this.getBasePath()));    
  }

  /**
   * Gets initialized email notifications api
   * 
   * @returns initialized email notifications api
   */
  private async getEmailNotificationsApi() {
    return await this.applyAuthentication(new EmailNotificationsApi(this.getBasePath()));    
  }

  /**
   * Returns base path for given API name
   * 
   * @returns base path for API
   */
  private getBasePath() {
    return Config.getApiConfig(this.apiName).url;
  }

  /**
   * Applies authentication to API instance
   * 
   * @param api API instance
   */
  private async applyAuthentication<T extends AuthenticatedApi>(api: T): Promise<T> {
    const accessToken = await this.getAccessToken();
    
    const auth = new OAuth();
    auth.accessToken = accessToken;
    api.setDefaultAuthentication(auth);

    return api;
  }

  /**
   * Returns access token
   * 
   * @returns access token
   */
  private async getAccessToken(): Promise<string> {
    const accessToken = await Auth.getAccessToken(this.apiName);
    return accessToken?.access_token;
  }

}

/**
 * Returns initialized API instance
 * 
 * @param apiName API name
 * @returns initialized API instance
 */
export function getApi(apiName: string) {
  return new Api(apiName);
}