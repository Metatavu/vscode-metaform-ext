import * as request from 'request';
import * as http from 'http';
import Config from "../config";
import { URL, URLSearchParams } from 'url';
import { AccessToken } from '../types';

export default class Auth {

  public static async getAccessToken(): Promise<AccessToken> {
    return new Promise((resolve, reject) => {
      const authConfig = Config.getAuthConfig();
      const url = `${authConfig.serverUrl}/realms/${authConfig.realm}/protocol/openid-connect/token`;
  
      const body = new URLSearchParams();
      body.append("client_id", authConfig.clientId);
      body.append("client_secret", authConfig.clientSecret);
      body.append("username", authConfig.username);
      body.append("password", authConfig.password);
      body.append("grant_type", "password");

      const options = { body: body.toString(), headers: { "content-type": "application/x-www-form-urlencoded" } };
  
      request.post(url, options, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
            resolve(JSON.parse(body));
          } else {
            reject(body);
          }
        }
      });
    });
  }
}