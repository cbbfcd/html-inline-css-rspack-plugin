"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePlugin = void 0;
const types_1 = require("../types");
const utils_1 = require("../utils");
class BasePlugin {
    get replaceConfig() {
        return this.config.replace || types_1.DEFAULT_REPLACE_CONFIG;
    }
    get styleTagFactory() {
        return (this.config.styleTagFactory ||
            (({ style }) => `<style type="text/css">${style}</style>`));
    }
    constructor(config = {}) {
        this.config = config;
        this.cssStyleCache = {};
    }
    prepare({ assets }) {
        Object.keys(assets).forEach((fileName) => {
            if ((0, utils_1.isCSS)(fileName) && this.isCurrentFileNeedsToBeInlined(fileName)) {
                const source = assets[fileName].source();
                this.cssStyleCache[fileName] = typeof source === 'string' ? source : source.toString();
                if (!this.config.leaveCSSFile) {
                    delete assets[fileName];
                }
            }
        });
    }
    getCSSStyle({ cssLink, publicPath, }) {
        const fileName = cssLink
            .replace(new RegExp(`^${(0, utils_1.escapeRegExp)(publicPath)}`), '')
            .replace(/\?.+$/g, '');
        if (this.isCurrentFileNeedsToBeInlined(fileName)) {
            const style = this.cssStyleCache[fileName];
            if (style === undefined) {
                console.error(`无法获取 ${cssLink} 的 CSS 样式。这可能是 html-inline-css-webpack-plugin 的一个 bug。`);
            }
            return style;
        }
        else {
            return undefined;
        }
    }
    isCurrentFileNeedsToBeInlined(fileName) {
        if (typeof this.config.filter === 'function') {
            return this.config.filter(fileName);
        }
        else {
            return true;
        }
    }
    addStyle({ html, htmlFileName, style, }) {
        const replaceValues = [
            this.styleTagFactory({ style }),
            this.replaceConfig.target,
        ];
        if (this.replaceConfig.position === 'after') {
            replaceValues.reverse();
        }
        if (html.indexOf(this.replaceConfig.target) === -1) {
            throw new Error(`无法将 CSS 样式注入到 "${htmlFileName}"，因为找不到替换目标 "${this.replaceConfig.target}"`);
        }
        return html.replace(this.replaceConfig.target, replaceValues.join(''));
    }
    cleanUp(html) {
        return this.replaceConfig.removeTarget
            ? html.replace(this.replaceConfig.target, '')
            : html;
    }
}
exports.BasePlugin = BasePlugin;
//# sourceMappingURL=base-plugin.js.map