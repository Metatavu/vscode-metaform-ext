/**
 * Interface describing an access token
 */
export interface AccessToken {
  created: Date;
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_expires_in?: number;
  firstName?: string;
  lastName?: string;
  userId?: string;
}

/**
 * Interface describing API config
 */
export interface ApiConfig {
	url: string;	
}

/**
 * Interface describing authentication config
 */
export interface AuthConfig {
	serverUrl: string;
	realm: string;
	clientId: string;
	clientSecret: string;
	username: string;
	password: string;
}