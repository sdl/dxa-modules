import { Promise } from "es6-promise";
import { ITaxonomy } from "interfaces/Taxonomy";
import { IPage } from "interfaces/Page";
import { IAppContext } from "components/container/App";
import { Toc } from "components/presentation/Toc";
import { Page } from "components/presentation/Page";
import { SearchBar } from "components/presentation/SearchBar";
import { Breadcrumbs } from "components/presentation/Breadcrumbs";
import { TcmId } from "utils/TcmId";
import { Url } from "utils/Url";

import "components/container/styles/PublicationContent";

/**
 * PublicationContent component props params
 *
 * @export
 * @interface IPublicationContentPropsParams
 */
export interface IPublicationContentPropsParams {
    /**
     * Id of the current publication
     *
     * @type {string}
     */
    publicationId: string;

    /**
     * The page id or the title of the current publication
     *
     * @type {string}
     */
    pageIdOrPublicationTitle?: string;

    /**
     * Title of the current publication
     *
     * @type {string}
     */
    publicationTitle?: string;

    /**
     * Title of the current page
     *
     * @type {string}
     */
    pageTitle?: string;
}

/**
 * PublicationContent component props
 *
 * @export
 * @interface IPublicationContentProps
 */
export interface IPublicationContentProps {
    /**
     * Publication content props parameters
     *
     * @type {IPublicationContentPropsParams}
     */
    params: IPublicationContentPropsParams;
}

/**
 * PublicationContent component state
 *
 * @export
 * @interface IPublicationContentState
 */
export interface IPublicationContentState {
    /**
     * Toc is loading
     *
     * @type {boolean}
     */
    isTocLoading?: boolean;

    /**
     * Toc is fixed to the top of the screen
     *
     * @type {boolean}
     */
    tocIsFixed?: boolean;

    /**
     * Current selected item in the TOC
     *
     * @type {ITaxonomy | null}
     */
    selectedTocItem?: ITaxonomy | null;
    /**
     * Page is loading
     *
     * @type {boolean}
     */
    isPageLoading?: boolean;
    /**
     * Current active item path in the TOC
     *
     * @type {string[]}
     */
    activeTocItemPath?: string[];
    /**
     * Title of the current publication
     *
     * @type {string}
     */
    publicationTitle?: string;
}

interface ISelectedPage {
    /**
     * Content of the current selected page
     *
     * @type {string | null}
     */
    content?: string | null;
    /**
     * An error prevented the page from rendering
     *
     * @type {string | null}
     */
    error?: string | null;
}

interface IToc {
    /**
     * An error prevented the toc from rendering
     *
     * @type {string}
     */
    error?: string;
    /**
     * Root items
     *
     * @type {ITaxonomy[]}
     */
    rootItems?: ITaxonomy[];
}

/**
 * Publication + content component
 */
export class PublicationContent extends React.Component<IPublicationContentProps, IPublicationContentState> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
    };

    public context: IAppContext;
    private _page: ISelectedPage = {};
    private _toc: IToc = {};
    private _isUnmounted: boolean = false;
    private _headerSize: number = 0;

    /**
     * Creates an instance of App.
     *
     */
    constructor() {
        super();
        this.state = {
            isTocLoading: true,
            tocIsFixed: false,
            selectedTocItem: null,
            isPageLoading: true
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { services } = this.context;
        const { publicationId, pageIdOrPublicationTitle } = this.props.params;
        const pageId = TcmId.isValidPageId(pageIdOrPublicationTitle) ? pageIdOrPublicationTitle : null;
        const getRootItems = (path?: string[]): void => {
            // Get the data for the Toc
            services.taxonomyService.getSitemapRoot(publicationId).then(
                items => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        this._toc.rootItems = items;
                        this.setState({
                            activeTocItemPath: path,
                            isTocLoading: false,
                            isPageLoading: Array.isArray(items) && items.length > 0
                        });
                    }
                },
                error => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        this._toc.error = error;
                        this.setState({
                            isTocLoading: false,
                            isPageLoading: false
                        });
                    }
                });
        };

        if (pageId) {
            // Set the current active path for the tree
            this._getActiveSitemapPath(pageId, getRootItems);
        } else {
            getRootItems();
        }
    }

    /**
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     *
     * @param {IPublicationContentProps} nextProps
     */
    public componentWillReceiveProps(nextProps: IPublicationContentProps): void {
        const { pageIdOrPublicationTitle } = this.props.params;
        const pageId = TcmId.isValidPageId(pageIdOrPublicationTitle) ? pageIdOrPublicationTitle : null;
        const nextpageIdOrPublicationTitle = nextProps.params.pageIdOrPublicationTitle;
        const nextPageId = TcmId.isValidPageId(nextpageIdOrPublicationTitle) ? nextpageIdOrPublicationTitle : null;

        if (nextPageId) {
            if (!pageId || nextPageId !== pageId) {
                // Set the current active path for the tree
                this._getActiveSitemapPath(nextPageId, (path) => {
                    this.setState({
                        activeTocItemPath: path
                    });
                });
            }
        }
    }

    /**
     * Invoked immediately before rendering when new props or state are being received.
     * This method is not called for the initial render.
     *
     * @param {IPublicationContentProps} nextProps Next props
     * @param {IPublicationContentState} nextState Next state
     */
    public componentWillUpdate(nextProps: IPublicationContentProps, nextState: IPublicationContentState): void {
        const { services } = this.context;
        const { publicationId } = this.props.params;
        const pageService = services.pageService;
        const { selectedTocItem, isPageLoading } = this.state;
        const currentId = selectedTocItem ? selectedTocItem.id : null;
        const nextId = nextState.selectedTocItem ? nextState.selectedTocItem.id : null;
        if (nextState.selectedTocItem && !nextState.selectedTocItem.url) {
            this._page.content = `<h1 class="title topictitle1">${nextState.selectedTocItem.title}</h1>`;
            return;
        }
        if (nextId && (isPageLoading || currentId !== nextId)) {
            // After upgrading to DXA 1.7 use TcmId.getItemIdFromTaxonomyId
            const pageId = TcmId.parseId(nextId);
            pageService.getPageInfo(publicationId, pageId ? pageId.itemId : nextId).then(
                this._onPageContentRetrieved.bind(this),
                this._onPageContentRetrievFailed.bind(this));
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { isPageLoading, activeTocItemPath, selectedTocItem, publicationTitle, tocIsFixed } = this.state;
        const { services, router } = this.context;
        const { publicationId } = this.props.params;
        const { taxonomyService, localizationService } = services;
        const { content, error} = this._page;
        const { rootItems } = this._toc;
        const tocError = this._toc.error;

        return (
            <section className={"sdl-dita-delivery-publication-content"}>
                <SearchBar
                    placeholderLabel={localizationService.formatMessage("components.searchbar.placeholder", [publicationTitle || ""])}
                    onSearch={query => console.log(query)} />
                <div className={"sdl-dita-delivery-toc-and-page" + (tocIsFixed ? " sdl-dita-delivery-fixed-toc" : "")}>
                    <Toc
                        activeItemPath={activeTocItemPath}
                        rootItems={rootItems}
                        loadChildItems={(parentId: string): Promise<ITaxonomy[]> => {
                            // TODO: this conversion will not be needed when upgrading to DXA 1.7
                            // https://jira.sdl.com/browse/TSI-2131
                            const taxonomyItemId = TcmId.getTaxonomyItemId("1", parentId);
                            return taxonomyService.getSitemapItems(publicationId, taxonomyItemId || parentId);
                        } }
                        onSelectionChanged={this._onTocSelectionChanged.bind(this)}
                        error={tocError} />
                    <Page
                        showActivityIndicator={isPageLoading || false}
                        content={content}
                        error={error}
                        onNavigate={(url: string): void => {
                            /* istanbul ignore else */
                            if (router) {
                                router.push(url);
                            }
                        } } >
                        <Breadcrumbs
                            publicationId={publicationId}
                            publicationTitle={publicationTitle || ""}
                            loadItemsPath={taxonomyService.getSitemapPath.bind(taxonomyService)}
                            selectedItem={selectedTocItem}
                            localizationService={localizationService}
                            />
                    </Page>
                </div>
            </section>
        );
    }

    /**
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public componentDidMount(): void {
        if (ReactDOM) {
            const domNode = ReactDOM.findDOMNode(this);
            const topBar = domNode.querySelector(".sdl-dita-delivery-searchbar");

            this._headerSize = topBar ? topBar.clientHeight : 0;
        }

        window.addEventListener("scroll", this._fixTocPanel.bind(this));
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;

        window.removeEventListener("scroll", this._fixTocPanel.bind(this));
    }

    private _onTocSelectionChanged(sitemapItem: ITaxonomy, path: string[]): void {
        const page = this._page;
        const {router, services } = this.context;
        const {publicationId, pageIdOrPublicationTitle } = this.props.params;
        const publicationService = services.publicationService;
        const pageId = TcmId.isValidPageId(pageIdOrPublicationTitle) ? pageIdOrPublicationTitle : null;

        page.error = null;

        publicationService.getPublicationTitle(publicationId).then(
            title => {
                this.setState({
                    activeTocItemPath: path,
                    publicationTitle: title,
                    selectedTocItem: sitemapItem,
                    isPageLoading: sitemapItem.url ? true : false
                });

                /* istanbul ignore else */
                if (router) {
                    const navPath = sitemapItem.url || Url.getPublicationUrl(publicationId, title);
                    // After upgrading to DXA 1.7 use TcmId.getItemIdFromTaxonomyId
                    const siteMapPageId = TcmId.parseId(sitemapItem.id);
                    if (siteMapPageId && siteMapPageId.itemId === pageId) {
                        router.replace(navPath);
                    }
                    else {
                        router.push(navPath);
                    }
                }
            },
            error => {
                page.error = error;

                this.setState({
                    activeTocItemPath: path,
                    selectedTocItem: sitemapItem,
                    isPageLoading: sitemapItem.url ? true : false
                });
            });
    }

    private _onPageContentRetrieved(pageInfo: IPage): void {
        const page = this._page;
        page.content = pageInfo.content;
        this.setState({
            isPageLoading: false
        });
    }

    private _onPageContentRetrievFailed(error: string): void {
        const page = this._page;
        page.error = error;
        page.content = null;
        this.setState({
            isPageLoading: false
        });
    }

    private _getActiveSitemapPath(pageId: string, done: (path: string[]) => void): void {
        const { services } = this.context;
        const { publicationId } = this.props.params;
        services.taxonomyService.getSitemapPath(publicationId, pageId).then(
            path => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    done(path.map(item => item.id || "") || []);
                }
            },
            error => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    this._toc.error = error;
                    this.setState({
                        isTocLoading: false,
                        isPageLoading: false
                    });
                }
            });
    }

    private _fixTocPanel(): void {
        /* istanbul ignore else */
        if (!this._isUnmounted) {
            this.setState({
                tocIsFixed: (window.document.body.scrollTop >= this._headerSize)
            });
        }
    }
}
