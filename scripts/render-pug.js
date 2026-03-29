'use strict';
const fs = require('fs');
const upath = require('upath');
const pug = require('pug');
const sh = require('shelljs');
const prettier = require('prettier');

module.exports = function renderPug(filePath, locale, localeData) {
    const srcPath = upath.resolve(upath.dirname(__filename), '../src');
    const isDefault = (locale === 'en');
    const destPath = filePath
        .replace(/src\/pug\//, isDefault ? 'dist/' : `dist/${locale}/`)
        .replace(/\.pug$/, '.html');

    const basePath = isDefault ? '' : '../';
    const currentPage = upath.basename(filePath).replace(/\.pug$/, '.html');

    console.log(`### INFO: Rendering ${filePath} [${locale}] to ${destPath}`);
    const html = pug.renderFile(filePath, {
        doctype: 'html',
        filename: filePath,
        basedir: srcPath,
        locale: locale,
        basePath: basePath,
        currentPage: currentPage,
        i18n: localeData,
        t: function(key) {
            return key.split('.').reduce(function(o, k) { return o && o[k]; }, localeData) || key;
        }
    });

    const destPathDirname = upath.dirname(destPath);
    if (!sh.test('-e', destPathDirname)) {
        sh.mkdir('-p', destPathDirname);
    }

    const prettified = prettier.format(html, {
        printWidth: 1000,
        tabWidth: 4,
        singleQuote: true,
        proseWrap: 'preserve',
        endOfLine: 'lf',
        parser: 'html',
        htmlWhitespaceSensitivity: 'ignore'
    });

    fs.writeFileSync(destPath, prettified);
};
