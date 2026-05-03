'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');
const renderPug = require('./render-pug');
const { buildDefaultCmsContent } = require('./cms-default-content');
const { fetchDatoCmsContent, isDatoCmsEnabled } = require('./datocms-client');

const srcPath = upath.resolve(upath.dirname(__filename), '../src');
const distPath = upath.resolve(upath.dirname(__filename), '../dist');
const locales = ['en', 'it'];

function isPugPage(filePath) {
    return (
        filePath.match(/\.pug$/)
        && !filePath.match(/include/)
        && !filePath.match(/mixin/)
        && !filePath.match(/\/pug\/layouts\//)
    );
}

function isPlainObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
}

function mergeDeep(target, source) {
    if (!isPlainObject(source)) {
        return target;
    }

    Object.keys(source).forEach(function(key) {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (Array.isArray(sourceValue)) {
            target[key] = sourceValue;
            return;
        }

        if (isPlainObject(sourceValue)) {
            const nextTarget = isPlainObject(targetValue) ? targetValue : {};
            target[key] = mergeDeep(nextTarget, sourceValue);
            return;
        }

        if (sourceValue !== null && sourceValue !== undefined && sourceValue !== '') {
            target[key] = sourceValue;
        }
    });
    return target;
}

function indexCategoriesBySlug(categoryPages) {
    return categoryPages.reduce(function(acc, item) {
        if (item && item.slug) {
            acc[item.slug] = item;
        }
        return acc;
    }, {});
}

function buildSocialEmailFeed(cmsData, locale) {
    const assets = [];
    cmsData.categoryPages.forEach(function(category) {
        const categoryAssets = category.gallery || [];
        categoryAssets.forEach(function(asset, index) {
            const assetChannels = asset.channels || ['web'];
            assets.push({
                locale: locale,
                categorySlug: category.slug,
                categoryTitle: category.displayTitle,
                position: index + 1,
                imageUrl: asset.url,
                alt: asset.alt || '',
                channels: assetChannels.join('|'),
                socialCaption: asset.socialCaption || '',
                emailCaption: asset.emailCaption || '',
                campaignTag: asset.campaignTag || '',
                usageRights: asset.usageRights || '',
                landingUrl: category.shopUrl || ''
            });
        });
    });

    return {
        generatedAt: new Date().toISOString(),
        locale: locale,
        assets: assets
    };
}

function toCsv(rows) {
    if (!rows || rows.length === 0) {
        return '';
    }

    const columns = Object.keys(rows[0]);
    const header = columns.join(',');
    const body = rows.map(function(row) {
        return columns.map(function(column) {
            const value = row[column] === null || row[column] === undefined ? '' : String(row[column]);
            return '"' + value.replace(/"/g, '""') + '"';
        }).join(',');
    });

    return [header].concat(body).join('\n');
}

function writeMarketingFeeds(locale, feedPayload) {
    const feedDir = upath.resolve(distPath, 'feeds');
    if (!sh.test('-e', feedDir)) {
        sh.mkdir('-p', feedDir);
    }

    fs.writeFileSync(
        upath.resolve(feedDir, 'marketing-assets-' + locale + '.json'),
        JSON.stringify(feedPayload, null, 2)
    );
    fs.writeFileSync(
        upath.resolve(feedDir, 'marketing-assets-' + locale + '.csv'),
        toCsv(feedPayload.assets)
    );
}

async function buildLocale(locale) {
    const localeData = JSON.parse(fs.readFileSync(
        upath.resolve(srcPath, 'locales', locale + '.json'), 'utf8'
    ));

    const defaultCmsData = buildDefaultCmsContent(localeData);
    let cmsData = JSON.parse(JSON.stringify(defaultCmsData));

    if (isDatoCmsEnabled()) {
        try {
            const remoteCmsData = await fetchDatoCmsContent(locale);
            if (remoteCmsData) {
                cmsData.aboutPage = mergeDeep(cmsData.aboutPage, remoteCmsData.aboutPage || {});

                const remoteBySlug = indexCategoriesBySlug(remoteCmsData.categoryPages || []);
                cmsData.categoryPages = cmsData.categoryPages.map(function(item) {
                    const remoteItem = remoteBySlug[item.slug] || {};
                    const merged = mergeDeep(JSON.parse(JSON.stringify(item)), remoteItem);
                    if (remoteItem.ogImage && remoteItem.ogImage.url) {
                        merged.ogImage = remoteItem.ogImage.url;
                    }
                    return merged;
                });
            }
        } catch (error) {
            console.warn('### WARN: DatoCMS fetch failed (' + locale + '). Using local defaults. ' + error.message);
        }
    } else {
        console.log('### INFO: DATOCMS_API_TOKEN not set. Using local content defaults for ' + locale + '.');
    }

    cmsData.categoryPagesBySlug = indexCategoriesBySlug(cmsData.categoryPages || []);

    sh.find(srcPath).forEach(function(filePath) {
        if (isPugPage(filePath)) {
            renderPug(filePath, locale, localeData, cmsData);
        }
    });

    writeMarketingFeeds(locale, buildSocialEmailFeed(cmsData, locale));
}

Promise.all(locales.map(function(locale) {
    return buildLocale(locale);
})).catch(function(error) {
    console.error(error);
    process.exit(1);
});
