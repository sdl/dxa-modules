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
import { Tile, ITile } from "@sdl/dd/presentation/Tile";
import { Button } from "@sdl/controls-react-wrappers";
import { ButtonPurpose } from "@sdl/controls";

import "./TilesList.less";

import "components/controls/styles/Button";

const SHOWN_ITEMS_COUNT = 8;

/**
 * Tiles List component props
 *
 * @export
 * @interface ITilesListProps
 */
export interface ITilesListProps {
    /**
     * Tiles list
     *
     * @type {ITile[]}
     */
    tiles: ITile[];
    /**
     * Label to show on view all button
     *
     * @type {string}
     * @memberOf ITilesListProps
     */
    viewAllLabel: string;
    /**
     * An error prevented the list from loading
     *
     * @type {string}
     */
    error?: string;
}

/**
 * Tiles List component state
 *
 * @export
 * @interface ITilesListState
 */
export interface ITilesListState {
    /**
     * If all tiles should be shown
     *
     * @type {boolean}
     */
    showAllItems?: boolean;
}

/**
 * Tiles list component
 */
export class TilesList extends React.Component<ITilesListProps, ITilesListState> {

    private _isUnmounted: boolean = false;

    /**
     * Creates an instance of Tiles list component.
     *
     */
    constructor() {
        super();
        this.state = {
            showAllItems: false
        };
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { showAllItems } = this.state;
        const { tiles, viewAllLabel } = this.props;

        const tilesToDisplay = showAllItems ? tiles : tiles.slice(0, SHOWN_ITEMS_COUNT);

        return (
            <section className={"sdl-dita-delivery-tiles-list"}>
                <nav>
                    {tilesToDisplay.map((tile: ITile, i: number) => {
                        return <Tile key={i} tile={tile} />;
                    })}
                </nav>
                {(!showAllItems && (tiles.length > tilesToDisplay.length)) && <Button
                    skin="graphene"
                    purpose={ButtonPurpose.CONFIRM}
                    events={{"click": () => {
                        /* istanbul ignore if */
                        if (!this._isUnmounted) {
                            this.setState({
                                showAllItems: true
                            });
                        }
                    } }}>{viewAllLabel}</Button>}
            </section>);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;
    }
}
