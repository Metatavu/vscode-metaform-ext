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

/**
* Option object for Metaform field
*/
export class MetaformFieldOption {
    /**
    * Option name
    */
    'name': string;
    /**
    * Option text
    */
    'text': string;
    /**
    * Defines whether option should be checked by default.
    */
    'checked'?: boolean;
    /**
    * Defines whether option should be selected by default.
    */
    'selected'?: boolean;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "text",
            "baseName": "text",
            "type": "string"
        },
        {
            "name": "checked",
            "baseName": "checked",
            "type": "boolean"
        },
        {
            "name": "selected",
            "baseName": "selected",
            "type": "boolean"
        }    ];

    static getAttributeTypeMap() {
        return MetaformFieldOption.attributeTypeMap;
    }
}
