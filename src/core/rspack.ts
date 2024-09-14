import { HtmlRspackPlugin, type Compiler } from '@rspack/core'

import { BasePlugin } from './base-plugin'
import { CSSStyle, ExtraPluginHookData, JsBeforeAssetTagGenerationData, JsBeforeEmitData, TAP_KEY_PREFIX } from '../types'

export class HTMLInlineRspackPlugin extends BasePlugin {
  private cssStyleMap: Map<HTMLInlineRspackPlugin, CSSStyle[]> = new Map()

  private prepareCSSStyle(data: JsBeforeAssetTagGenerationData & ExtraPluginHookData) {
    this.cssStyleMap.clear()

    const [...cssAssets] = data.assets.css
    cssAssets.forEach((cssLink) => {
      if (this.isCurrentFileNeedsToBeInlined(cssLink)) {
        const style = this.getCSSStyle({
          cssLink,
          publicPath: data.assets.publicPath,
        })

        if (style) {
          if (this.cssStyleMap.has(this)) {
            this.cssStyleMap.get(this)!.push(style)
          } else {
            this.cssStyleMap.set(this, [style])
          }
          const cssLinkIndex = data.assets.css.indexOf(cssLink)
          if (cssLinkIndex !== -1) {
            data.assets.css.splice(cssLinkIndex, 1)
          }
        }
      }
    })
  }

  private process(data: JsBeforeEmitData & ExtraPluginHookData) {
    if (this.isCurrentFileNeedsToBeInlined(data.outputName)) {
      const cssStyles = this.cssStyleMap.get(this) || []

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
        const hooks = HtmlRspackPlugin.getCompilationHooks(compilation)

        hooks.beforeAssetTagGeneration.tap(
          `${TAP_KEY_PREFIX}_beforeAssetTagGeneration`,
          (data) => {
            this.prepare(compilation)
            this.prepareCSSStyle(data)
            return data
          }
        )

        hooks.beforeEmit.tap(
          `${TAP_KEY_PREFIX}_beforeEmit`,
          (data) => {
            this.process(data)
            return data
          }
        )
      }
    )
  }
}
