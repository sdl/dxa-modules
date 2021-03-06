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
import * as ReactDOMServer from "react-dom/server";
import { renderToString } from "Server";
import { App } from "@sdl/dd/container/App/App";
import { localization } from "services/common/LocalizationService";
import { IServices } from "interfaces/Services";
import { PageService } from "services/server/PageService";
import { PublicationService } from "services/server/PublicationService";
import { TaxonomyService } from "services/server/TaxonomyService";
import { SearchService } from "services/server/SearchService";
import { TestBase } from "@sdl/models";
import { configureStore } from "store/Store";
import { Provider } from "react-redux";
import { Store } from "redux";
import { IState } from "store/interfaces/State";

class Server extends TestBase {
    private store: Store<IState>;
    public runTests(): void {
        describe(`Server side rendering tests.`, (): void => {
            beforeAll(() => {
                this.store = configureStore({
                    language: "en"
                });
            });

            it("renders", (): void => {
                const app = renderToString("home");
                const element = document.createElement("div");
                element.innerHTML = app;
                expect(element.children.length).toBe(1);
                const firstChild = element.children[0];
                expect(firstChild.classList).toContain("sdl-dita-delivery-app");
                expect(firstChild.childNodes.length).toBe(5);
            });

            it("renders correct static markup", (): void => {
                const services: IServices = {
                    pageService: new PageService(),
                    publicationService: new PublicationService(),
                    localizationService: localization,
                    taxonomyService: new TaxonomyService(),
                    searchService: new SearchService()
                };

                const localize = services.localizationService.formatMessage;

                const app = ReactDOMServer.renderToStaticMarkup(
                    <Provider store={this.store}>
                        <App services={services} />
                    </Provider>
                );
                const expected = ReactDOMServer.renderToStaticMarkup(
                    <div className="ltr sdl-dita-delivery-app">
                        <div />
                        <div className="sdl-dita-delivery-nav-mask" />
                        <div className="sdl-dita-delivery-topbar">
                            <header>
                                <div className="sdl-dita-delivery-topbar-logo" title="SDL">
                                    <a href="/home" />
                                </div>
                                <div className="spacer" />
                                <div className="sdl-dita-delivery-topbar-expand-nav">
                                    <span />
                                </div>
                                <div className="sdl-dita-delivery-topbar-expand-search">
                                    <span />
                                </div>
                                <div className="sdl-dita-delivery-topbar-language">
                                    <span />
                                </div>
                                <div className="sdl-dita-delivery-dropdown">
                                    <button className="dropdown-toggle" type="button" data-toggle="dropdown">
                                        English
                                        <span className="caret" />
                                    </button>
                                    <div className="dropdown-menu">
                                        <div className="dropdown-arrow" />
                                        <ul className="dropdown-items">
                                            <li>
                                                <a style={{ direction: "ltr" }}>Deutsch</a>
                                            </li>
                                            <li className="active">
                                                <a style={{ direction: "ltr" }}>
                                                    English<span className="checked" />
                                                </a>
                                            </li>
                                            <li>
                                                <a style={{ direction: "ltr" }}>Nederlands</a>
                                            </li>
                                            <li>
                                                <a style={{ direction: "ltr" }}>中文</a>
                                            </li>
                                            <li>
                                                <a style={{ direction: "ltr" }}>日本語</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <select defaultValue="en">
                                        <option value="de">Deutsch</option>
                                        <option value="en">English</option>
                                        <option value="nl">Nederlands</option>
                                        <option value="zh">中文</option>
                                        <option value="ja">日本語</option>
                                    </select>
                                </div>
                                <div className="sdl-dita-delivery-topbar-user">
                                    <span />
                                </div>
                            </header>
                        </div>
                        <div className="sdl-dita-delivery-searchbar">
                            <div className="input-area">
                                <input type="text" placeholder="" />
                                <div className="search-button" />
                            </div>
                        </div>
                        <div className="sdl-dita-delivery-publication-content-wrapper">
                            <div />
                            <div />
                            <div />
                            <div />
                            <section className="sdl-dita-delivery-publication-content">
                                <div className="sdl-dita-delivery-navigation-menu">
                                    <nav className="sdl-dita-delivery-toc">
                                        <div className="sdl-conditions-dialog-presentation">
                                            <div className="sdl-conditions-fetcher" />
                                            <button className="sdl-button-text sdl-personalize-content" disabled>
                                                <span>{localize("components.conditions.dialog.title")}</span>
                                            </button>
                                            <div className="sdl-dialog-container">
                                                <div className="sdl-dialog-wrapper" />
                                            </div>
                                        </div>
                                        <span>
                                            <div />
                                        </span>
                                    </nav>
                                </div>
                                <span className="sdl-dita-delivery-splitter" />
                                <div className="sdl-dita-delivery-page">
                                    <div className="sdl-dita-delivery-page-content">
                                        <div className="sdl-dita-delivery-breadcrumbs">
                                            <ul className="breadcrumbs">
                                                <li>
                                                    <a className="home" title="Home" href="/home">
                                                        {localize("components.breadcrumbs.home")}
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div />
                                        <article className="ltr page-content">
                                            {localize("components.page.nothing.selected")}
                                        </article>
                                        <div className="sdl-dita-delivery-comments-section">
                                            <div>
                                                <div className="sdl-dita-delivery-postcomment">
                                                    <form id="form">
                                                        <div>
                                                            <input
                                                                type="text"
                                                                className="sdl-input-text"
                                                                id="name"
                                                                placeholder={localize(
                                                                    "component.post.comment.placeholder.name"
                                                                )}
                                                            />
                                                            <span>{localize("component.post.comment.no.name")}</span>
                                                        </div>
                                                        <div>
                                                            <input
                                                                type="text"
                                                                className="sdl-input-text"
                                                                id="email"
                                                                placeholder={localize(
                                                                    "component.post.comment.placeholder.email"
                                                                )}
                                                            />
                                                            <span>{localize("component.post.comment.no.email")}</span>
                                                        </div>
                                                        <div>
                                                            <textarea
                                                                className="sdl-textarea"
                                                                id="comment"
                                                                placeholder={localize(
                                                                    "component.post.comment.placeholder.content"
                                                                )}
                                                            />
                                                            <span>{localize("component.post.comment.no.content")}</span>
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            disabled
                                                            className="sdl-button graphene sdl-button-purpose-confirm"
                                                            form="form"
                                                            value="Submit">
                                                            {localize("component.post.comment.submit")}
                                                        </button>
                                                        <button
                                                            type="reset"
                                                            className="sdl-button graphene"
                                                            value="Cancel">
                                                            {localize("components.conditions.dialog.cancel")}
                                                        </button>
                                                    </form>
                                                </div>
                                                <div className="sdl-dita-delivery-comments-list">
                                                    <div className="sdl-comments-fetcher" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                );
                expect(app).toBe(expected);
            });
        });
    }
}

new Server().runTests();
