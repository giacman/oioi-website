'use strict';

const _ = require('lodash');
const fs = require('fs');
const chokidar = require('chokidar');
const upath = require('upath');
const renderAssets = require('./render-assets');
const renderPug = require('./render-pug');
const renderScripts = require('./render-scripts');
const renderSCSS = require('./render-scss');

const srcPath = upath.resolve(upath.dirname(__filename), '../src');
const locales = ['en', 'it'];

function loadLocaleData() {
    var data = {};
    locales.forEach(function(locale) {
        data[locale] = JSON.parse(fs.readFileSync(
            upath.resolve(srcPath, 'locales', locale + '.json'), 'utf8'
        ));
    });
    return data;
}

var localeData = loadLocaleData();

function renderPugAllLocales(filePath) {
    locales.forEach(function(locale) {
        renderPug(filePath, locale, localeData[locale]);
    });
}

const watcher = chokidar.watch('src', {
    persistent: true,
});

let READY = false;

process.title = 'pug-watch';
process.stdout.write('Loading');
let allPugFiles = {};

watcher.on('add', filePath => _processFile(upath.normalize(filePath), 'add'));
watcher.on('change', filePath => _processFile(upath.normalize(filePath), 'change'));
watcher.on('ready', () => {
    READY = true;
    console.log(' READY TO ROLL!');
});

_handleSCSS();

function _processFile(filePath, watchEvent) {
    
    if (!READY) {
        if (filePath.match(/\.pug$/)) {
            if (!filePath.match(/includes/) && !filePath.match(/mixins/) && !filePath.match(/\/pug\/layouts\//)) {
                allPugFiles[filePath] = true;
            }    
        }    
        process.stdout.write('.');
        return;
    }

    console.log(`### INFO: File event: ${watchEvent}: ${filePath}`);

    if (filePath.match(/\.json$/) && filePath.match(/locales/)) {
        localeData = loadLocaleData();
        return _renderAllPug();
    }

    if (filePath.match(/\.pug$/)) {
        return _handlePug(filePath, watchEvent);
    }

    if (filePath.match(/\.scss$/)) {
        if (watchEvent === 'change') {
            return _handleSCSS(filePath, watchEvent);
        }
        return;
    }

    if (filePath.match(/src\/js\//)) {
        return renderScripts();
    }

    if (filePath.match(/src\/assets\//)) {
        return renderAssets();
    }

}

function _handlePug(filePath, watchEvent) {
    if (watchEvent === 'change') {
        if (filePath.match(/includes/) || filePath.match(/mixins/) || filePath.match(/\/pug\/layouts\//)) {
            return _renderAllPug();
        }
        return renderPugAllLocales(filePath);
    }
    if (!filePath.match(/includes/) && !filePath.match(/mixins/) && !filePath.match(/\/pug\/layouts\//)) {
        return renderPugAllLocales(filePath);
    }
}

function _renderAllPug() {
    console.log('### INFO: Rendering All');
    _.each(allPugFiles, (value, filePath) => {
        renderPugAllLocales(filePath);
    });
}

function _handleSCSS() {
    renderSCSS();
}
