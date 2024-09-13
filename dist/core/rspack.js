"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLInlineRspackPlugin = void 0;
const core_1 = require("@rspack/core");
const types_1 = require("../types");
const base_plugin_1 = require("./base-plugin");
class HTMLInlineRspackPlugin extends base_plugin_1.BasePlugin {
    constructor() {
        super(...arguments);
        this.cssStyleMap = new Map();
    }
    prepareCSSStyle(data) {
        this.cssStyleMap.clear();
        const [...cssAssets] = data.assets.css;
        cssAssets.forEach((cssLink) => {
            if (this.isCurrentFileNeedsToBeInlined(cssLink)) {
                const style = this.getCSSStyle({
                    cssLink,
                    publicPath: data.assets.publicPath,
                });
                if (style) {
                    if (this.cssStyleMap.has(data.plugin)) {
                        this.cssStyleMap.get(data.plugin).push(style);
                    }
                    else {
                        this.cssStyleMap.set(data.plugin, [style]);
                    }
                    const cssLinkIndex = data.assets.css.indexOf(cssLink);
                    if (cssLinkIndex !== -1) {
                        data.assets.css.splice(cssLinkIndex, 1);
                    }
                }
            }
        });
    }
    process(data) {
        if (this.isCurrentFileNeedsToBeInlined(data.outputName)) {
            const cssStyles = this.cssStyleMap.get(data.plugin) || [];
            cssStyles.forEach((style) => {
                data.html = this.addStyle({
                    style,
                    html: data.html,
                    htmlFileName: data.outputName,
                });
            });
            data.html = this.cleanUp(data.html);
        }
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(`${types_1.TAP_KEY_PREFIX}_compilation`, (compilation) => {
            const hooks = core_1.HtmlRspackPlugin.getCompilationHooks(compilation);
            hooks.beforeAssetTagGeneration.tap(`${types_1.TAP_KEY_PREFIX}_beforeAssetTagGeneration`, (data) => {
                this.prepare(compilation);
                this.prepareCSSStyle(data);
                return data;
            });
            hooks.beforeEmit.tap(`${types_1.TAP_KEY_PREFIX}_beforeEmit`, (data) => {
                this.process(data);
                return data;
            });
        });
    }
}
exports.HTMLInlineRspackPlugin = HTMLInlineRspackPlugin;
//# sourceMappingURL=rspack.js.map