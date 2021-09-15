export * from './attachmentsApi';
import { AttachmentsApi } from './attachmentsApi';
export * from './auditLogEntriesApi';
import { AuditLogEntriesApi } from './auditLogEntriesApi';
export * from './draftsApi';
import { DraftsApi } from './draftsApi';
export * from './emailNotificationsApi';
import { EmailNotificationsApi } from './emailNotificationsApi';
export * from './exportThemeFilesApi';
import { ExportThemeFilesApi } from './exportThemeFilesApi';
export * from './exportThemesApi';
import { ExportThemesApi } from './exportThemesApi';
export * from './metaformsApi';
import { MetaformsApi } from './metaformsApi';
export * from './repliesApi';
import { RepliesApi } from './repliesApi';
export * from './systemApi';
import { SystemApi } from './systemApi';
import * as fs from 'fs';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;

export const APIS = [AttachmentsApi, AuditLogEntriesApi, DraftsApi, EmailNotificationsApi, ExportThemeFilesApi, ExportThemesApi, MetaformsApi, RepliesApi, SystemApi];
