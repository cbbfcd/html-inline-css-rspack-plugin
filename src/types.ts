import { type HtmlRspackPluginOptions } from "@rspack/core";

export interface ReplaceConfig {
  position?: 'before' | 'after';
  removeTarget?: boolean;
  target: string;
}

export type StyleTagFactory = (params: { style: string }) => string;

export const TAP_KEY_PREFIX = 'html-inline-css-rspack-plugin';

export const DEFAULT_REPLACE_CONFIG: ReplaceConfig = {
  target: '</head>',
};

export interface Config {
  filter?(fileName: string): boolean;
  leaveCSSFile?: boolean;
  replace?: ReplaceConfig;
  styleTagFactory?: StyleTagFactory;
}

export interface FileCache {
  [fileName: string]: string; // 文件内容
}

export type ExtraPluginHookData = {
  plugin: {
    options: HtmlRspackPluginOptions
  }
}

export interface JsBeforeEmitData {
  html: string
  outputName: string
}

export interface JsHtmlPluginAssets {
  publicPath: string
  js: Array<string>
  css: Array<string>
  favicon?: string
}

export interface JsBeforeAssetTagGenerationData {
  assets: JsHtmlPluginAssets
  outputName: string
}

export type CSSStyle = string
