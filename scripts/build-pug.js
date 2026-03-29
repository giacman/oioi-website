'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');
const renderPug = require('./render-pug');

const srcPath = upath.resolve(upath.dirname(__filename), '../src');
const locales = ['en', 'it'];

function isPugPage(filePath) {
    return (
        filePath.match(/\.pug$/)
        && !filePath.match(/include/)
        && !filePath.match(/mixin/)
        && !filePath.match(/\/pug\/layouts\//)
    );
}

locales.forEach(function(locale) {
    const data = JSON.parse(fs.readFileSync(
        upath.resolve(srcPath, 'locales', locale + '.json'), 'utf8'
    ));
    sh.find(srcPath).forEach(function(filePath) {
        if (isPugPage(filePath)) {
            renderPug(filePath, locale, data);
        }
    });
});
