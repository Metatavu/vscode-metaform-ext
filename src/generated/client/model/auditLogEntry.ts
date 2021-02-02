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
import { AuditLogEntryType } from './auditLogEntryType';

export class AuditLogEntry {
    /**
    * Entity identifier
    */
    'id'?: string;
    /**
    * Id of creator user
    */
    'userId'?: string;
    /**
    * Id of the reply
    */
    'replyId'?: string;
    /**
    * Id of the attachment
    */
    'attachmentId'?: string;
    /**
    * Time of accessing the reply
    */
    'createdAt'?: Date;
    /**
    * Description of the event
    */
    'message'?: string;
    'logEntryType'?: AuditLogEntryType;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "userId",
            "baseName": "userId",
            "type": "string"
        },
        {
            "name": "replyId",
            "baseName": "replyId",
            "type": "string"
        },
        {
            "name": "attachmentId",
            "baseName": "attachmentId",
            "type": "string"
        },
        {
            "name": "createdAt",
            "baseName": "createdAt",
            "type": "Date"
        },
        {
            "name": "message",
            "baseName": "message",
            "type": "string"
        },
        {
            "name": "logEntryType",
            "baseName": "logEntryType",
            "type": "AuditLogEntryType"
        }    ];

    static getAttributeTypeMap() {
        return AuditLogEntry.attributeTypeMap;
    }
}
