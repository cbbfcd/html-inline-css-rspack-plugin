"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCSS = void 0;
exports.is = is;
exports.escapeRegExp = escapeRegExp;
function is(filenameExtension) {
    const reg = new RegExp(`\\.(${filenameExtension})$`);
    return (fileName) => reg.test(fileName);
}
exports.isCSS = is('css');
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=utils.js.map