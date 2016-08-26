/// <reference path="../typings/index.d.ts" />
/// <reference path="components/App.tsx" />

import App = Sdl.KcWebApp.Components.App;

const appProps: Sdl.KcWebApp.Components.IAppProps = {
    localization: {
        formatMessage: (path, variables) => {
            return path;
        }
    }
};

/**
 * Render the application to a string.
 *
 * @param {string} path Current path in the application. Used for deep linking.
 * @returns {string}
 */
// tslint:disable-next-line:no-unused-variable
function renderToString(path: string): string {
    return ReactDOMServer.renderToString(<App {...appProps}/>);
};
