/* tslint:disable */
/* eslint-disable */
/**
 * TGMon API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface TypesJobResDoc
 */
export interface TypesJobResDoc {
    /**
     * 
     * @type {string}
     * @memberof TypesJobResDoc
     */
    createdAt?: string;
    /**
     * 
     * @type {string}
     * @memberof TypesJobResDoc
     */
    deletedAt?: string;
    /**
     * 
     * @type {string}
     * @memberof TypesJobResDoc
     */
    iD?: string;
    /**
     * 
     * @type {string}
     * @memberof TypesJobResDoc
     */
    jobReqID?: string;
    /**
     * 
     * @type {Array<number>}
     * @memberof TypesJobResDoc
     */
    sprite?: Array<number>;
    /**
     * 
     * @type {Array<number>}
     * @memberof TypesJobResDoc
     */
    thumbnail?: Array<number>;
    /**
     * 
     * @type {string}
     * @memberof TypesJobResDoc
     */
    updatedAt?: string;
    /**
     * 
     * @type {Array<number>}
     * @memberof TypesJobResDoc
     */
    vtt?: Array<number>;
}

/**
 * Check if a given object implements the TypesJobResDoc interface.
 */
export function instanceOfTypesJobResDoc(value: object): value is TypesJobResDoc {
    return true;
}

export function TypesJobResDocFromJSON(json: any): TypesJobResDoc {
    return TypesJobResDocFromJSONTyped(json, false);
}

export function TypesJobResDocFromJSONTyped(json: any, ignoreDiscriminator: boolean): TypesJobResDoc {
    if (json == null) {
        return json;
    }
    return {
        
        'createdAt': json['CreatedAt'] == null ? undefined : json['CreatedAt'],
        'deletedAt': json['DeletedAt'] == null ? undefined : json['DeletedAt'],
        'iD': json['ID'] == null ? undefined : json['ID'],
        'jobReqID': json['JobReqID'] == null ? undefined : json['JobReqID'],
        'sprite': json['Sprite'] == null ? undefined : json['Sprite'],
        'thumbnail': json['Thumbnail'] == null ? undefined : json['Thumbnail'],
        'updatedAt': json['UpdatedAt'] == null ? undefined : json['UpdatedAt'],
        'vtt': json['Vtt'] == null ? undefined : json['Vtt'],
    };
}

export function TypesJobResDocToJSON(json: any): TypesJobResDoc {
    return TypesJobResDocToJSONTyped(json, false);
}

export function TypesJobResDocToJSONTyped(value?: TypesJobResDoc | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'CreatedAt': value['createdAt'],
        'DeletedAt': value['deletedAt'],
        'ID': value['iD'],
        'JobReqID': value['jobReqID'],
        'Sprite': value['sprite'],
        'Thumbnail': value['thumbnail'],
        'UpdatedAt': value['updatedAt'],
        'Vtt': value['vtt'],
    };
}

