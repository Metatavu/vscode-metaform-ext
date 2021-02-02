/**
 * Metaform REST API
 * REST API for Metaform
 *
 * The version of the OpenAPI document: 2.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from '../api';

export enum AuditLogEntryType {
    VIEWREPLY = <any> 'VIEW_REPLY',
    LISTREPLY = <any> 'LIST_REPLY',
    MODIFYREPLY = <any> 'MODIFY_REPLY',
    DELETEREPLY = <any> 'DELETE_REPLY',
    CREATEREPLY = <any> 'CREATE_REPLY',
    VIEWREPLYATTACHMENT = <any> 'VIEW_REPLY_ATTACHMENT',
    DOWNLOADREPLYATTACHMENT = <any> 'DOWNLOAD_REPLY_ATTACHMENT',
    EXPORTREPLYPDF = <any> 'EXPORT_REPLY_PDF',
    EXPORTREPLYXLSX = <any> 'EXPORT_REPLY_XLSX'
}