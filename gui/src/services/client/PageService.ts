import { IPostComment } from "interfaces/Comments";
import { IComment } from "interfaces/ServerModels";
import { IPageService } from "services/interfaces/PageService";
import { IPage } from "interfaces/Page";
import { Page } from "models/Page";
import { Promise } from "es6-promise";
import { IConditionMap } from "store/interfaces/Conditions";
import { MD5 } from "object-hash";
import { Comments } from "models/Comments";
import { Comment } from "models/Comment";

/**
 * Page service, interacts with the models to fetch the required data.
 *
 * @export
 * @class PageService
 * @implements {ITaxonomyService}
 */
export class PageService implements IPageService {
    /**
     * Table of Comments models
     *
     * @protected
     * @static
     * @type {{ [pageId: string]: Comments }}
     */
    protected static CommentsModels: { [pageId: string]: Comments | undefined };

    /**
     * Page models
     *
     * @private
     * @static
     * @type { [key: string]: Page }
     */
    private PageModels: { [key: string]: Page } = {};

    /**
     * Get page information
     *
     * @param {string} publicationId Publication Id
     * @param {string} pageId The page Id
     * @returns {Promise<IPage>} Promise to return the content
     *
     * @memberOf DataStoreClient
     */
    public getPageInfo(publicationId: string, pageId: string, conditions?: IConditionMap): Promise<IPage> {
        const page = this.getPageModel(publicationId, pageId, conditions);
        return new Promise((resolve: (info?: IPage) => void, reject: (error: string | null) => void) => {
            if (page.isLoaded()) {
                resolve(page.getPage());
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    resolve(page.getPage());
                };
                const onLoadFailed = (event: Event & { data: { error: string } }) => {
                    removeEventListeners();
                    reject(event.data.error);
                };
                removeEventListeners = (): void => {
                    page.removeEventListener("load", onLoad);
                    page.removeEventListener("loadfailed", onLoadFailed);
                };

                page.addEventListener("load", onLoad);
                page.addEventListener("loadfailed", onLoadFailed);
                page.load();
            }
        });
    }

    /**
     *
     * @param {string} publicationId
     * @param {string} pageId
     * @param {boolean} descending
     * @param {number} top
     * @param {number} skip
     * @param {number[]} status
     * @returns {Promise<IComment[]>}
     *
     * @memberof PageService
     */
    public getComments(publicationId: string, pageId: string, descending: boolean, top: number, skip: number, status: number[]): Promise<IComment[]> {
        const comments = this.getCommentsModel(publicationId, pageId, descending, top, skip, status);

        return new Promise((resolve: (items?: IComment[]) => void, reject: (error: {} | null) => void) => {
            if (comments.isLoaded()) {
                resolve(comments.getComments());
            } else {
                let removeEventListeners: () => void;
                const onLoad = () => {
                    removeEventListeners();
                    resolve(comments.getComments());
                };
                const onLoadFailed = (event: Event & { data: { error: string } }) => {
                    removeEventListeners();
                    reject({ message: event.data.error });
                };
                removeEventListeners = (): void => {
                    comments.removeEventListener("load", onLoad);
                    comments.removeEventListener("loadfailed", onLoadFailed);
                };

                comments.addEventListener("load", onLoad);
                comments.addEventListener("loadfailed", onLoadFailed);
                comments.load();
            }
        });
    }

    /**
     *
     * @param {string} publicationId
     * @param {string} pageId
     * @param {IComment} commentData
     * @returns {Promise<IComment>}
     *
     * @memberof PageService
     */
    public saveComment(commentData: IPostComment): Promise<IComment> {
        const comment = new Comment(commentData);
        return new Promise((resolve: (data?: IComment) => void, reject: (error: {} | null) => void) => {
            let removeEventListeners: () => void;
            const onLoad = () => {
                removeEventListeners();
                resolve(comment.getComment());
            };
            const onLoadFailed = (event: Event & { data: { error: string } }) => {
                removeEventListeners();
                reject({ message: event.data.error });
            };
            removeEventListeners = (): void => {
                comment.removeEventListener("load", onLoad);
                comment.removeEventListener("loadfailed", onLoadFailed);
                comment.removeEventListener("validatefailed", onLoadFailed);

                // There is no further componen processing, so we don`t need to keep this component in mermory.
                comment.dispose();
            };

            comment.addEventListener("load", onLoad);
            comment.addEventListener("loadfailed", onLoadFailed);
            comment.addEventListener("validatefailed", onLoadFailed);
            comment.save();
        });
    }

    private _getKey(...args: string[]): string {
        return args.join("/");
    }

    private getPageModel(publicationId: string, pageId: string, conditions?: IConditionMap): Page {
        const key = this._getKey(publicationId, pageId, MD5(conditions || "no-conditions"));
        if (!this.PageModels[key]) {
            this.PageModels[key] = new Page(publicationId, pageId, conditions);
        }
        return this.PageModels[key];
    }

    private getCommentsModel(publicationId: string, pageId: string, descending: boolean, top: number, skip: number, status: number[]): Comments {
        this.ensureCommentsModel(pageId);

        if (!PageService.CommentsModels[pageId]) {
            PageService.CommentsModels[pageId] = new Comments(publicationId, pageId, descending, top, skip, status);
        }

        return PageService.CommentsModels[pageId] as Comments;
    }

    private ensureCommentsModel(pageId: string): void {
        if (!PageService.CommentsModels) {
            PageService.CommentsModels = {};
        }

        if (!PageService.CommentsModels[pageId]) {
            PageService.CommentsModels[pageId] = undefined;
        }
    }

}
