'use strict';

const https = require('https');

const DATOCMS_API_URL = process.env.DATOCMS_API_URL || 'https://graphql.datocms.com/';
const DATOCMS_ENV = process.env.DATOCMS_ENV || 'main';
const DATOCMS_TOKEN = process.env.DATOCMS_API_TOKEN;

const QUERY = `
query CmsBuildContent($locale: SiteLocale) {
  aboutPage(locale: $locale, fallbackLocales: [en]) {
    heading
    seoTitle
    seoDescription
    introParagraphs
    introClosing
    contactIntro
    contactCalligraphy
    heroImage {
      url
      alt
      title
      focalPoint {
        x
        y
      }
    }
    sections {
      title
      paragraphs
      image {
        url
        alt
        title
        focalPoint {
          x
          y
        }
      }
    }
  }
  allCategoryPages(locale: $locale, fallbackLocales: [en], first: 50) {
    slug
    displayTitle
    pageUrl
    subtitle
    seoTitle
    seoDescription
    ogImage {
      url
    }
    homepageCardEnabled
    homepageCardOrder
    homepageCardTitle
    homepageCardAlt
    homepageCardImage {
      url
    }
    homepageCardUrl
    shopUrl
    shopCollectionHandle
    descriptionOpening
    descriptionParagraphs
    descriptionClosing
    variants
    extraNotes
    gallery {
      url
      alt
      socialCaption
      emailCaption
      campaignTag
      usageRights
      channels
      focalPoint {
        x
        y
      }
    }
  }
}
`;

function isDatoCmsEnabled() {
    return Boolean(DATOCMS_TOKEN);
}

function executeGraphqlRequest(payload) {
    return new Promise(function(resolve, reject) {
        const request = https.request(DATOCMS_API_URL, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + DATOCMS_TOKEN,
                'Content-Type': 'application/json',
                'X-Environment': DATOCMS_ENV
            }
        }, function(response) {
            const chunks = [];
            response.on('data', function(chunk) {
                chunks.push(chunk);
            });
            response.on('end', function() {
                const body = Buffer.concat(chunks).toString('utf8');
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    reject(new Error('DatoCMS request failed with status ' + response.statusCode + ': ' + body));
                    return;
                }
                try {
                    resolve(JSON.parse(body));
                } catch (error) {
                    reject(new Error('DatoCMS response is not valid JSON: ' + error.message));
                }
            });
        });

        request.on('error', function(error) {
            reject(error);
        });

        request.write(JSON.stringify(payload));
        request.end();
    });
}

async function fetchDatoCmsContent(locale) {
    if (!isDatoCmsEnabled()) {
        return null;
    }

    const payload = {
        query: QUERY,
        variables: {
            locale: locale
        }
    };

    const response = await executeGraphqlRequest(payload);
    if (response.errors && response.errors.length > 0) {
        const message = response.errors.map(function(error) {
            return error.message;
        }).join('; ');
        throw new Error('DatoCMS GraphQL errors: ' + message);
    }

    if (!response.data) {
        return null;
    }

    return {
        aboutPage: response.data.aboutPage || null,
        categoryPages: response.data.allCategoryPages || []
    };
}

module.exports = {
    DATOCMS_ENV: DATOCMS_ENV,
    DATOCMS_API_URL: DATOCMS_API_URL,
    isDatoCmsEnabled: isDatoCmsEnabled,
    fetchDatoCmsContent: fetchDatoCmsContent
};
