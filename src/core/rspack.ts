import { HtmlRspackPlugin, type HtmlRspackPluginOptions, type Compiler } from '@rspack/core'

import { TAP_KEY_PREFIX } from '../types'
import { BasePlugin } from './base-plugin'

export type ExtraPluginHookData = {
  plugin: {
      options: HtmlRspackPluginOptions;
  };
};

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

type CSSStyle = string

export class HTMLInlineRspackPlugin extends BasePlugin {
  // Using object reference to distinguish styles for multiple files
  private cssStyleMap: Map<ExtraPluginHookData['plugin'], CSSStyle[]> = new Map()

  private prepareCSSStyle(data: JsBeforeAssetTagGenerationData & ExtraPluginHookData) {
    // `prepareCSSStyle` may be called more than once in webpack watch mode.
    // https://github.com/Runjuu/html-inline-css-webpack-plugin/issues/30
    // https://github.com/Runjuu/html-inline-css-webpack-plugin/issues/13
    this.cssStyleMap.clear()

    const [...cssAssets] = data.assets.css
    cssAssets.forEach((cssLink) => {
      if (this.isCurrentFileNeedsToBeInlined(cssLink)) {
        const style = this.getCSSStyle({
          cssLink,
          publicPath: data.assets.publicPath,
        })

        if (style) {
          if (this.cssStyleMap.has(data.plugin)) {
            this.cssStyleMap.get(data.plugin)!.push(style)
          } else {
            this.cssStyleMap.set(data.plugin, [style])
          }
          const cssLinkIndex = data.assets.css.indexOf(cssLink)
          // prevent generate <link /> tag
          if (cssLinkIndex !== -1) {
            data.assets.css.splice(cssLinkIndex, 1)
          }
        }
      }
    })
  }

  private process(data: JsBeforeEmitData & ExtraPluginHookData) {
    // check if current html needs to be inlined
    if (this.isCurrentFileNeedsToBeInlined(data.outputName)) {
      const cssStyles = this.cssStyleMap.get(data.plugin) || []

      cssStyles.forEach((style) => {
        data.html = this.addStyle({
          style,
          html: data.html,
          htmlFileName: data.outputName,
        })
      })

      data.html = this.cleanUp(data.html)
    }
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(
      `${TAP_KEY_PREFIX}_compilation`,
      (compilation) => {
        const hooks = HtmlRspackPlugin.getCompilationHooks(
          compilation,
        )

        hooks.beforeAssetTagGeneration.tap(
          `${TAP_KEY_PREFIX}_beforeAssetTagGeneration`,
          (data) => {
            this.prepare(compilation)
            this.prepareCSSStyle(data)
            return data
          },
        )

        hooks.beforeEmit.tap(`${TAP_KEY_PREFIX}_beforeEmit`,(data) => {
          this.process(data);
          return data;
        })
      },
    )
  }
}
