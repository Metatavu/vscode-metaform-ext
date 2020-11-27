import * as request from 'request';
import Config from "../config";
import { URLSearchParams } from 'url';
import { AccessToken } from '../types';

/**
 * Class for handling authentication related operataions
 */
export default class Auth {

  /**
   * Resolves an access token and returns it
   * 
   * @returns an access token
   */
  public static async getAccessToken(serverUrl: string, realm: string, clientId: string, username: string, password: string, clientSecret: string): Promise<AccessToken> {
    return new Promise((resolve, reject) => {
      const url = `${serverUrl}/realms/${realm}/protocol/openid-connect/token`;
      console.log(url);
      const body = new URLSearchParams();
      body.append("client_id", clientId);
      body.append("client_secret", clientSecret);
      body.append("username", username);
      body.append("password", password);
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