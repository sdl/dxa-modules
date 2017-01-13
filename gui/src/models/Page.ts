import * as ServerModels from "interfaces/ServerModels";
import { IPage } from "interfaces/Page";
import { Api } from "utils/Api";
import { Net, IWebRequest, LoadableObject } from "sdl-models";

/**
 * Page model
 *
 * @export
 * @class Page
 * @extends {LoadableObject}
 */
export class Page extends LoadableObject {

    private _publicationId: string;
    private _pageId: string;
    private _page: IPage;

    /**
     * Creates an instance of Page.
     *
     * @param {string} publicationId Publication id
     * @param {string} pageId Page id
     */
    constructor(publicationId: string, pageId: string) {
        super();
        this._publicationId = publicationId;
        this._pageId = pageId;
    }

    /**
     * Get the page info
     *
     * @returns {IPage}
     */
    public getPage(): IPage {
        return this._page;
    }

    /* Overloads */
    protected _executeLoad(reload: boolean): void {
        const url = Api.getPageUrl(this._publicationId, this._pageId);
        Net.getRequest(url,
            this.getDelegate(this._onLoad), this.getDelegate(this._onLoadFailed));
    }

    protected _processLoadResult(result: string, webRequest: IWebRequest): void {
        const page = (JSON.parse(result) as ServerModels.IPage);
        let pageTitle = "";
        let pageBody = "";
        const regions = page.Regions;
        if (Array.isArray(regions) && regions.length > 0) {
            const entities = regions[0].Entities;
            if (Array.isArray(entities) && entities.length > 0) {
                pageTitle = entities[0].topicTitle;
                const topicBody = entities[0].topicBody;
                if (topicBody && Array.isArray(topicBody.Fragments) && topicBody.Fragments.length > 0) {
                    pageBody = topicBody.Fragments[0].Html;
                }
            }
        }
        this._page = {
            id: page.Id,
            title: pageTitle,
            content: pageBody
        } as IPage;

        super._processLoadResult(result, webRequest);
    }
}
