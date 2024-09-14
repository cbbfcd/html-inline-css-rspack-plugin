import { type Compiler } from '@rspack/core';
import { BasePlugin } from './base-plugin';
export declare class HTMLInlineRspackPlugin extends BasePlugin {
    private cssStyleMap;
    private prepareCSSStyle;
    private process;
    apply(compiler: Compiler): void;
}
