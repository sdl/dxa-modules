import { ILocalizationService } from "services/interfaces/LocalizationService";

export class LocalizationService implements ILocalizationService {
    public formatMessage(path: string, variables?: string[]): string {
        const message = `mock-${path}`;
        if (Array.isArray(variables)) {
            return message + variables.join("-");
        }
        return message;
    }

    /**
     *
     * @param {string} lang
     * @returns {("rtl" | "ltr")}
     *
     * @memberOf LocalizationService
     */
    public getDirection(lang: string): "rtl" | "ltr" {
        return ["ar", "he", "ur", "fa", "iw"].some((val: string) => val === lang) ? "rtl" : "ltr";
    }
}

export let localization = new LocalizationService();
