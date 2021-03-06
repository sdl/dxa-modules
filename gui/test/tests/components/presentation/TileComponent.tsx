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
import { Promise } from "es6-promise";
import { Tile, ITileProps, ITile } from "@sdl/dd/presentation/Tile";
import { TestBase } from "@sdl/models";
import { LocalizationService } from "test/mocks/services/LocalizationService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { ActivityIndicator } from "@sdl/controls-react-wrappers";

import { RENDER_DELAY } from "test/Constants";

const services = {
    localizationService: new LocalizationService()
};

class TileComponent extends TestBase {

    public runTests(): void {

        describe(`Tile component tests.`, (): void => {
            const target = super.createTargetElement();

            const tileContentPlaceholder = "Penguins (order Sphenisciformes, family Spheniscidae) are a group of aquatic, "
                + "flightless birds living almost exclusively in the southern hemisphere, especially in "
                + "Antarctica. Highly adapted for life in the water, penguins have countershaded dark and "
                + "white plumage, and their wings have evolved into flippers. Most penguins feed on krill, "
                + "fish, squid, and other forms of sealife caught while swimming underwater. They spend about "
                + "half of their lives on land and half in the oceans.";

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("can render tile title and load tile string content", (done: () => void): void => {
                const tile = {
                    title: "Penguins (order Sphenisciformes, family Spheniscidae)",
                    loadableContent: () => {
                        return Promise.resolve(tileContentPlaceholder);
                    }
                } as ITile;

                const tileComponent = this._renderComponent({
                    tile: tile
                }, target);

                const appNode = ReactDOM.findDOMNode(tileComponent) as HTMLElement;

                const tileTitleNode = appNode.querySelector(".sdl-dita-delivery-tile h3") as HTMLElement;
                expect(tileTitleNode.textContent).toBe("Penguins (order Sphenisciformes, family...");

                // tslint:disable-next-line:no-any
                expect(TestUtils.scryRenderedComponentsWithType(tileComponent, ActivityIndicator as any).length).toBe(1, "Could not find activity indicators.");

                setTimeout((): void => {
                    // tslint:disable-next-line:no-any
                    expect(TestUtils.scryRenderedComponentsWithType(tileComponent, ActivityIndicator as any).length).toBe(0, "Activity indicator should not be rendered.");

                    const descriptionNode = appNode.querySelector(".sdl-dita-delivery-tile .tile-content") as HTMLElement;
                    expect(descriptionNode.textContent).toBe("Penguins (order Sphenisciformes, family Spheniscidae) are a group of aquatic, flightless birds living almost "
                        + "exclusively in the southern hemisphere, especially in Antarctica. Highly adapted for life...");

                    done();
                }, RENDER_DELAY);
            });

            it("shows error if title content can`t be loaded and can retry load content", (done: () => void): void => {
                const errorMessage = "Tile can`t be loaded";
                let callCount = 0;
                const tile = {
                    title: "",
                    loadableContent: () => {
                        if (++callCount == 2) {
                            done();
                        }
                        return Promise.reject(errorMessage);
                    }
                } as ITile;

                this._renderComponent({
                    tile: tile
                }, target);

                const appNode = ReactDOM.findDOMNode(target);

                setTimeout((): void => {
                    const descriptionNode = appNode.querySelector(".sdl-dita-delivery-tile .tile-content .error-message") as HTMLElement;
                    expect(descriptionNode.textContent).toBe(errorMessage);

                    const retryButtonNode = appNode.querySelector(".sdl-dita-delivery-tile button") as HTMLElement;
                    expect(retryButtonNode).not.toBeNull();
                    retryButtonNode.click();
                }, RENDER_DELAY);

            });

            it("navigates when `view more` button is clicked", (done: () => void): void => {
                const tile = {
                    id: "tile id",
                    title: "tile title",
                    navigateTo: () => {
                        done();
                    }
                } as ITile;

                this._renderComponent({
                    tile: tile
                }, target);
                const appNode = ReactDOM.findDOMNode(target);

                const viewMoreButtonNode = appNode.querySelector(".sdl-dita-delivery-tile button") as HTMLElement;
                expect(viewMoreButtonNode).not.toBeNull();
                viewMoreButtonNode.click();
            });

        });
    }

    private _renderComponent(props: ITileProps, target: HTMLElement): Tile {
        const comp = ReactDOM.render(
            (
                <ComponentWithContext {...services}>
                    <Tile {...props} />
                </ComponentWithContext>
            ), target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, Tile) as Tile;
    }
}

new TileComponent().runTests();
