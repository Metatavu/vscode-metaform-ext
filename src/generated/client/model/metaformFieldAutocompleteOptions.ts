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

export class MetaformFieldAutocompleteOptions {
    /**
    * Base URL for code server based services
    */
    'codeServerBaseUrl'?: string;
    /**
    * Classification id for Code Server services
    */
    'codeServerClassificationId'?: string;
    /**
    * Parent concept code id for Code Server services
    */
    'codeServerParentConceptCodeId'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "codeServerBaseUrl",
            "baseName": "codeServerBaseUrl",
            "type": "string"
        },
        {
            "name": "codeServerClassificationId",
            "baseName": "codeServerClassificationId",
            "type": "string"
        },
        {
            "name": "codeServerParentConceptCodeId",
            "baseName": "codeServerParentConceptCodeId",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return MetaformFieldAutocompleteOptions.attributeTypeMap;
    }
}

