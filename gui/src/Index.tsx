/// <reference path="../typings/index.d.ts" />
/// <reference path="components/App.tsx" />

module Sdl.KcWebApp {
    import App = Components.App;

    const mainElement = document.getElementById("main-view-target");
    const localization: Components.ILocalization = {
        formatMessage: SDL.Globalize.formatMessage
    };

    ReactDOM.render(<App localization={localization} />, mainElement);

    DataStore.getSitemapRoot((error, children) => {
        if (error) {
            // TODO error handling
            return;
        }
        ReactDOM.render(<App toc={{
            rootItems: children,
            loadChildItems: DataStore.getSitemapItems
        }} localization={localization}/>, mainElement);
    });
}
