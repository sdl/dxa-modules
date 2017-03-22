import "ts-helpers";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { App } from "components/container/App";
import { IServices } from "interfaces/Services";
import { PageService } from "services/server/PageService";
import { PublicationService } from "services/server/PublicationService";
import { TaxonomyService } from "services/server/TaxonomyService";
import { localization } from "services/common/LocalizationService";
import { hashHistory } from "react-router";

import { Provider } from "react-redux";
import { IState } from "store/interfaces/State";
import { configureStore } from "store/Store";
import { Store } from "redux";

/**
 * Render the application to a string.
 *
 * @param {string} path Current path in the application. Used for deep linking.
 * @returns {string}
 */
export function renderToString(path: string): string {
    /**
     * Set instances for services
     */
    const services: IServices = {
        pageService: new PageService(),
        publicationService: new PublicationService(),
        localizationService: localization,
        taxonomyService: new TaxonomyService()
    };

    const store: Store<IState> = configureStore({});

    localization.setStore(store);

    return ReactDOMServer.renderToString(
        <Provider store={store}>
            <App services={services} history={hashHistory} />
        </Provider>);
};
