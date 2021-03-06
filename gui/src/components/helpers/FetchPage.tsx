/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import * as React from "react";
import * as PropTypes from "prop-types";
import { MD5 } from "object-hash";
import { connect } from "react-redux";
import { fetchPage } from "store/actions/Api";
import { getCurrentLocation, getLastConditions } from "store/reducers/Reducer";
import { IAppContext } from "@sdl/dd/container/App/App";
import { IPageService } from "services/interfaces/PageService";
import { IState, ICurrentLocationState } from "store/interfaces/State";
import { IConditionMap } from "store/interfaces/Conditions";

export interface IFetchPage {
    /**
     * Fetch Page function following type to load the page
     *     @param   {IPageService}
     *     @param   {string}
     *     @param   {string}
     *     @returns {void}
     *
     * @memberOf IFetchPage
     */
    fetch: (pageService: IPageService, publicationId: string, pageId: string, conditions: IConditionMap) => void;
    /**
     * Current location from Global State
     *
     * @type {ICurrentLocationState}
     * @memberOf IFetchPage
     */
    currentPub: ICurrentLocationState;
    conditions: IConditionMap;
};

/**
 * Fetch page component
 */
class Fetch extends React.Component<IFetchPage, {}> {
    /**
     * Context types
     */
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: PropTypes.object.isRequired
    };

    /**
     * Global context
     */
    public context: IAppContext;

    /**
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public componentDidMount(): void {
        this.fetchCurrentPage();
    }

    /**
     * Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
     */
    public shouldComponentUpdate(nextProps: IFetchPage): boolean {
        const prevPub = this.props.currentPub;
        const nextPub = nextProps.currentPub;
        return prevPub.pageId !== nextPub.pageId
            || prevPub.publicationId !== nextPub.publicationId
            || MD5(this.props.conditions) !== MD5(nextProps.conditions);
    }

    /**
     * Invoked immediately after updating.
     */
    public componentDidUpdate(): void {
        this.fetchCurrentPage();
    }

    /**
     * Get parameters and execute fetch function
     */
    public fetchCurrentPage(): void {
        const { publicationId, pageId } = this.props.currentPub;
        const { pageService } = this.context.services;
        if (pageId !== "") {
            this.props.fetch(pageService, publicationId, pageId, this.props.conditions);
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (<div />);
    }
}

const mapStateToProps = (state: IState): {} => {
    const currentPub = getCurrentLocation(state);

    return {
        currentPub,
        conditions: getLastConditions(state, currentPub.publicationId)
    };
};

const mapDispatchToProps = {
    fetch: fetchPage
};

/**
 * Connector of Fetch Page component for Redux
 *
 * @export
 */
export const FetchPage = connect(mapStateToProps, mapDispatchToProps)(Fetch);
