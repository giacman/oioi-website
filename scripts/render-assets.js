'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');

module.exports = function renderAssets() {
    const sourcePath = upath.resolve(upath.dirname(__filename), '../src/assets');
    const destPath = upath.resolve(upath.dirname(__filename), '../dist/.');
    
    sh.cp('-R', sourcePath, destPath)

    // Copy SEO files (sitemap.xml, robots.txt) to root
    const srcRoot = upath.resolve(upath.dirname(__filename), '../src');
    sh.cp(upath.join(srcRoot, 'sitemap.xml'), destPath);
    sh.cp(upath.join(srcRoot, 'robots.txt'), destPath);
};