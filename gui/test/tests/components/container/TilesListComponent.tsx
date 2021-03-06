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
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { ITile } from "@sdl/dd/presentation/Tile";
import { TilesList, ITilesListProps } from "@sdl/dd/container/TilesList/TilesList";
import { TestBase } from "@sdl/models";
import { LocalizationService } from "test/mocks/services/LocalizationService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { Button } from "@sdl/controls-react-wrappers";

import { RENDER_DELAY } from "test/Constants";

const services = {
    localizationService: new LocalizationService()
};

class TilesListComponent extends TestBase {

    public runTests(): void {

        describe(`TilesList component tests.`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("renders tiles list", (): void => {
                const tilesItems: ITile[] = [{
                    id: "1",
                    title: "Tile 1"
                }, {
                    id: "2",
                    title: "Tile 2"
                }];

                const tilesList = this._renderComponent({
                    tiles: tilesItems,
                    viewAllLabel: "View all"
                }, target);

                const tiles = TestUtils.scryRenderedDOMComponentsWithClass(tilesList, "sdl-dita-delivery-tile");
                expect(tiles.length).toBe(2);

                tiles.forEach((tile, index) => {
                    expect((tile.querySelector("h3") as HTMLElement).textContent).toBe(tilesItems[index].title);
                });
            });

            it("renders only first 8 items, and expands when view all is clicked", (done: () => void): void => {
                const tilesCount = 50;
                const tilesItems: ITile[] = Array(tilesCount).fill(null).map((n, i) => {
                    return {
                        id: `id-${i}`,
                        title: `Tile ${i}`,
                        description: `Tile ${i} Description`
                    } as ITile;
                });

                const tilesList = this._renderComponent({
                    tiles: tilesItems,
                    viewAllLabel: "View all"
                }, target);

                expect(TestUtils.scryRenderedDOMComponentsWithClass(tilesList, "sdl-dita-delivery-tile").length).toBe(8);

                // tslint:disable-next-line:no-any
                const viewAllButtonComp = TestUtils.findRenderedComponentWithType(tilesList, Button as any);
                expect(viewAllButtonComp).not.toBeNull();
                const viewAllButtonNode = ReactDOM.findDOMNode(viewAllButtonComp).querySelector("button") as HTMLButtonElement;
                expect(viewAllButtonNode.textContent).toBe("View all");
                viewAllButtonNode.click();

                setTimeout((): void => {
                    expect(TestUtils.scryRenderedDOMComponentsWithClass(tilesList, "sdl-dita-delivery-tile").length).toBe(tilesCount);
                    // tslint:disable-next-line:no-any
                    expect(TestUtils.scryRenderedComponentsWithType(tilesList, Button as any).length).toBe(0);

                    done();
                }, RENDER_DELAY);
            });
        });
    }

    private _renderComponent(props: ITilesListProps, target: HTMLElement): TilesList {
        const comp = ReactDOM.render(
            (
                <ComponentWithContext {...services}>
                    <TilesList {...props} />
                </ComponentWithContext>
            ), target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, TilesList) as TilesList;
    }
}

new TilesListComponent().runTests();
