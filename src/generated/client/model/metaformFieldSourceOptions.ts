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

export class MetaformFieldSourceOptions {
    /**
    * Source autocomplete field name. This option is used only when using autocomplete strategy
    */
    'autocompleteField'?: string;
    /**
    * Name of the autocomplete item property to be used as field value. This option is used only when using autocomplete strategy
    */
    'autocompleteItemProperty'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "autocompleteField",
            "baseName": "autocompleteField",
            "type": "string"
        },
        {
            "name": "autocompleteItemProperty",
            "baseName": "autocompleteItemProperty",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return MetaformFieldSourceOptions.attributeTypeMap;
    }
}
