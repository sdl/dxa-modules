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

import * as deepAssign from "deep-assign";
import { applyMiddleware, compose, createStore, Store } from "redux";
import thunk from "redux-thunk";
import { IWindow } from "interfaces/Window";
import { IState } from "store/interfaces/State";
import { mainReducer } from "store/reducers/Reducer";
import { handleAction, combine } from "store/reducers/CombineReducers";
import { createAction } from "redux-actions";

// TODO: Remove this library
import persistState, { actionTypes } from "redux-localstorage";
import * as adapter from "redux-localstorage/lib/adapters/localStorage";

import { localStorageFilter } from "store/filters/localStorageFilter";
import { merge } from "lodash";

const LOCALSTORAGE_KEY: string = "sdl-dita-delivery-app";

const globalWindow = window as IWindow;
const composeEnhancers = globalWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const storage = compose(localStorageFilter(["language", "conditions.lastConditions"]))(adapter(window.localStorage));

const enhancer = composeEnhancers(applyMiddleware(thunk), persistState(storage, LOCALSTORAGE_KEY));

const persistMainReducer = compose(
    (() =>
        /* tslint:disable-next-line:no-any */
        (next: any) => (state: any, action: any): {} =>
            action.type === actionTypes.INIT && action.payload
                ? next(merge({}, state, action.payload), action)
                : next(state, action))()
)(mainReducer);

// This is an empty initial state object, that helps to create store if don't want to fill all options
const EMPTY_STATE: IState = {
    language: "",
    conditions: {
        showDialog: false,
        allConditions: {
            byPubId: {},
            loading: [],
            errors: {}
        },
        lastConditions: {},
        editingConditions: {}
    },
    comments: {
        byId: {},
        loading: [],
        saving: [],
        errors: {},
        postErrors: {}
    },
    currentLocation: {
        publicationId: "",
        pageId: "",
        taxonomyId: "",
        anchor: ""
    },
    publications: {
        byId: {},
        isLoading: false,
        lastError: ""
    },
    pages: {
        byId: {},
        loading: [],
        errors: {}
    },
    releaseVersions: {
        byProductFamily: {}
    },
    splitterPosition: 300,
    productFamilies: []
};

//need this to reset state for tests
const resetState = createAction("KARMA_RESET", (state: IState) => state);
const resetStateReducer = handleAction("KARMA_RESET", (state: IState, newState: IState): IState => newState, {});

let store: Store<IState> | undefined;
const configureStore = (initialState: {} = {}): Store<IState> => {
    const state = deepAssign({}, EMPTY_STATE, initialState);
    if (store === undefined) {
        store = createStore(combine(resetStateReducer, persistMainReducer), state, enhancer);
    } else {
        store.dispatch(resetState(state));
    }
    return store;
};

const getStore = () => {
    //hack method onyl for TOC and conditions, (while we haven't moved it redux state)
    //never use it otherwise
    return store as Store<IState>;
};

export { configureStore, getStore };
