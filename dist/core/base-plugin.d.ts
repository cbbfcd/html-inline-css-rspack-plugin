import type { Compilation } from '@rspack/core';
import { Config, StyleTagFactory, FileCache } from '../types';
export declare class BasePlugin {
    protected readonly config: Config;
    protected cssStyleCache: FileCache;
    protected get replaceConfig(): import("../types").ReplaceConfig;
    protected get styleTagFactory(): StyleTagFactory;
    constructor(config?: Config);
    protected prepare(compilation: Compilation): void;
    protected getCSSStyle({ cssLink, publicPath, }: {
        cssLink: string;
        publicPath: string;
    }): string | undefined;
    protected isCurrentFileNeedsToBeInlined(fileName: string): boolean;
    protected addStyle({ html, htmlFileName, style, }: {
        html: string;
        htmlFileName: string;
        style: string;
    }): string;
    protected cleanUp(html: string): string;
}
