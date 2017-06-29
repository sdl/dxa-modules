import { ISearchQuery, ISearchResult } from "interfaces/Search";
import { Promise } from "es6-promise";

/**
 * Search related services
 */
export interface ISearchService {

    /**
     * Get search results
     *
     * @param {string} publicationId Publication Id
     * @returns {Promise<ISearchResult[]>} Promise to return the items
     *
     * @memberOf ISearchService
     */
    getSearchResults(query: ISearchQuery): Promise<ISearchResult[]>;
}
