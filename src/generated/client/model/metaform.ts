/**
 * Metaform REST API
 * REST API for Metaform
 *
 * The version of the OpenAPI document: 2.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from '../api';
import { MetaformFilter } from './metaformFilter';
import { MetaformScripts } from './metaformScripts';
import { MetaformSection } from './metaformSection';

export class Metaform {
    'id'?: string;
    'replyStrategy'?: Metaform.ReplyStrategyEnum;
    'exportThemeId'?: string;
    /**
    * Are anonymous replies allowed or not
    */
    'allowAnonymous'?: boolean;
    /**
    * Are drafts allowed or not
    */
    'allowDrafts'?: boolean;
    'title'?: string;
    'sections'?: Array<MetaformSection>;
    'filters'?: Array<MetaformFilter>;
    'scripts'?: MetaformScripts;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "replyStrategy",
            "baseName": "replyStrategy",
            "type": "Metaform.ReplyStrategyEnum"
        },
        {
            "name": "exportThemeId",
            "baseName": "exportThemeId",
            "type": "string"
        },
        {
            "name": "allowAnonymous",
            "baseName": "allowAnonymous",
            "type": "boolean"
        },
        {
            "name": "allowDrafts",
            "baseName": "allowDrafts",
            "type": "boolean"
        },
        {
            "name": "title",
            "baseName": "title",
            "type": "string"
        },
        {
            "name": "sections",
            "baseName": "sections",
            "type": "Array<MetaformSection>"
        },
        {
            "name": "filters",
            "baseName": "filters",
            "type": "Array<MetaformFilter>"
        },
        {
            "name": "scripts",
            "baseName": "scripts",
            "type": "MetaformScripts"
        }    ];

    static getAttributeTypeMap() {
        return Metaform.attributeTypeMap;
    }
}

export namespace Metaform {
    export enum ReplyStrategyEnum {
        PUBLIC = <any> 'PUBLIC',
        PRIVATE = <any> 'PRIVATE'
    }
}
