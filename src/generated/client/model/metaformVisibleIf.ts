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
* Rule that defines whether specified object is visible
*/
export class MetaformVisibleIf {
    /**
    * Field where the visible if rule is relative to
    */
    'field'?: string;
    /**
    * Value must be equal to this value. If value is specified \"true\" field must have any value selected
    */
    'equals'?: string;
    /**
    * Value must be not equal to this value.
    */
    'notEquals'?: string;
    'and'?: Array<MetaformVisibleIf>;
    'or'?: Array<MetaformVisibleIf>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "field",
            "baseName": "field",
            "type": "string"
        },
        {
            "name": "equals",
            "baseName": "equals",
            "type": "string"
        },
        {
            "name": "notEquals",
            "baseName": "not-equals",
            "type": "string"
        },
        {
            "name": "and",
            "baseName": "and",
            "type": "Array<MetaformVisibleIf>"
        },
        {
            "name": "or",
            "baseName": "or",
            "type": "Array<MetaformVisibleIf>"
        }    ];

    static getAttributeTypeMap() {
        return MetaformVisibleIf.attributeTypeMap;
    }
}

