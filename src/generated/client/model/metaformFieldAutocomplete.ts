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
import { MetaformFieldAutocompleteOptions } from './metaformFieldAutocompleteOptions';
import { MetaformFieldAutocompleteService } from './metaformFieldAutocompleteService';

export class MetaformFieldAutocomplete {
    'service': MetaformFieldAutocompleteService;
    'options'?: MetaformFieldAutocompleteOptions;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "service",
            "baseName": "service",
            "type": "MetaformFieldAutocompleteService"
        },
        {
            "name": "options",
            "baseName": "options",
            "type": "MetaformFieldAutocompleteOptions"
        }    ];

    static getAttributeTypeMap() {
        return MetaformFieldAutocomplete.attributeTypeMap;
    }
}

