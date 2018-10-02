﻿/**
 * Product Release Version interface
 *
 * @export
 * @interface IProductReleaseVersion
 */
export interface IProductReleaseVersion {
    /**
     * Product Release Version title
     *
     * @type {string}
     * @memberOf IProductReleaseVersion
     */
    title: string;

    /**
     * Normalized title, used for comparison
     *
     * @type {string}
     * @memberOf IProductReleaseVersion
     */
    value: string;

    /**
     * If Product Release Version has a warning
     *
     * @type {string}
     * @memberOf IProductReleaseVersion
     */
    hasWarning?: boolean;
}