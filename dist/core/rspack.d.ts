import { type HtmlRspackPluginOptions, type Compiler } from '@rspack/core';
import { BasePlugin } from './base-plugin';
export type ExtraPluginHookData = {
    plugin: {
        options: HtmlRspackPluginOptions;
    };
};
export interface JsBeforeEmitData {
    html: string;
    outputName: string;
}
export interface JsHtmlPluginAssets {
    publicPath: string;
    js: Array<string>;
    css: Array<string>;
    favicon?: string;
}
export interface JsBeforeAssetTagGenerationData {
    assets: JsHtmlPluginAssets;
    outputName: string;
}
export declare class HTMLInlineRspackPlugin extends BasePlugin {
    private cssStyleMap;
    private prepareCSSStyle;
    private process;
    apply(compiler: Compiler): void;
}
