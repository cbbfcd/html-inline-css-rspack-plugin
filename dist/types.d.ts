export interface ReplaceConfig {
    position?: 'before' | 'after';
    removeTarget?: boolean;
    target: string;
}
export type StyleTagFactory = (params: {
    style: string;
}) => string;
export declare const TAP_KEY_PREFIX = "html-inline-css-rspack-plugin";
export declare const DEFAULT_REPLACE_CONFIG: ReplaceConfig;
export interface Config {
    filter?(fileName: string): boolean;
    leaveCSSFile?: boolean;
    replace?: ReplaceConfig;
    styleTagFactory?: StyleTagFactory;
}
export interface FileCache {
    [fileName: string]: string;
}
