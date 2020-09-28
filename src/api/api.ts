import Auth from "../auth";
import Config from "../config";
// eslint-disable-next-line max-len
import { Authentication, Metaform, MetaformsApi, OAuth, RepliesApi } from "../generated/client/api";

interface AuthenticatedApi {  
  setDefaultAuthentication: (auth: Authentication) => void
}

const basePath = Config.getApiConfig().url;

export default new class Api {

  public async listMetaforms() {
    try {
      const api = await this.getMetaformsApi();
      const realmId = Config.getAuthConfig().realm;
      return (await api.listMetaforms(realmId)).body;
    } catch (e) {
      console.error("Failed to list metaforms", e);
      throw e;
    }
  }

  public async findMetaform(id: string) {
    try {
      const api = await this.getMetaformsApi();
      const realmId = Config.getAuthConfig().realm;
      return (await api.findMetaform(realmId, id)).body;
    } catch (e) {
      console.error("Failed to find metaform", e);
      throw e;
    }
  }

  public async updateMetaform(metaform: Metaform) {
    try {
      const api = await this.getMetaformsApi();
      const realmId = Config.getAuthConfig().realm;
      (await api.updateMetaform(metaform, realmId, metaform.id!));
    } catch (e) {
      console.error("Failed to delete metaform", e);
      throw e;
    }
  }

  public async deleteMetaform(id: string) {
    try {
      const api = await this.getMetaformsApi();
      const realmId = Config.getAuthConfig().realm;
      (await api.deleteMetaform(realmId, id));
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
