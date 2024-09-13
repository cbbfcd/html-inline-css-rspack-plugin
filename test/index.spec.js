const test = require('ava');
const fs = require('fs');
const { rspack } = require('@rspack/core');
const { JSDOM } = require('jsdom');

const { HTMLInlineRspackPlugin } = require('../dist');

function buildRspackConfig(entry = './test/src/index.js') {
  return {
    entry,
    output: {
      filename: 'bundle.js',
      path: __dirname + '/test/dist'
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [rspack.CssExtractRspackPlugin.loader, 'css-loader'],
          type: 'javascript/auto',
        }
      ]
    },
    plugins: [
      new rspack.HtmlRspackPlugin({
        template: './test/src/index.html'
      }),
      new HTMLInlineRspackPlugin()
    ]
  }
}

async function build(entry) {
  return new Promise((resolve, reject) => {
    rspack(buildRspackConfig(entry), (err, stats) => {
      if (err || stats.hasErrors()) {
        reject((err || {}).message || new Error(stats.toString()));
      } else {
        resolve();
      }
    });
  })
}

test.before(async t => {
  await build();
});

test('CSS should be inlined into HTML', t => {
  const htmlContent = fs.readFileSync(__dirname + '/test/dist/index.html', 'utf-8');
  const dom = new JSDOM(htmlContent);
  const styleTags = dom.window.document.querySelectorAll('style');

  t.true(styleTags.length > 0, 'There should be at least one <style> tag inlined in the HTML');
  t.regex(styleTags[0].textContent, /body\s*{/, 'The inlined style should contain CSS rules');
});
