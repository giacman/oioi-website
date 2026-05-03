'use strict';

function buildAboutSections(localeData) {
    return [
        {
            title: localeData.about.la_porta.title,
            paragraphs: localeData.about.la_porta.paragraphs,
            image: null
        },
        {
            title: localeData.about.il_metodo.title,
            paragraphs: localeData.about.il_metodo.paragraphs,
            image: {
                url: 'assets/img/about/metodo_hero.png',
                alt: 'OIOI - Il Metodo'
            }
        },
        {
            title: localeData.about.estetica.title,
            paragraphs: localeData.about.estetica.paragraphs,
            image: null
        },
        {
            title: localeData.about.attitudine.title,
            paragraphs: localeData.about.attitudine.paragraphs,
            image: {
                url: 'assets/img/about/attitudine_hero.png',
                alt: 'OIOI - Attitudine'
            }
        },
        {
            title: localeData.about.per_chi.title,
            paragraphs: localeData.about.per_chi.paragraphs,
            image: null
        },
        {
            title: localeData.about.chi_la_fa.title,
            paragraphs: localeData.about.chi_la_fa.paragraphs,
            image: null
        }
    ];
}

function buildGallery(items) {
    return items.map(function(item) {
        return {
            url: item.url,
            alt: item.alt,
            channels: item.channels || ['web'],
            socialCaption: item.socialCaption || '',
            emailCaption: item.emailCaption || '',
            campaignTag: item.campaignTag || '',
            usageRights: item.usageRights || '',
            focalPoint: item.focalPoint || null
        };
    });
}

function buildDefaultCmsContent(localeData) {
    return {
        aboutPage: {
            heading: localeData.about.heading,
            seoTitle: localeData.about.title,
            seoDescription: localeData.about.meta_description,
            introParagraphs: localeData.about.intro,
            introClosing: localeData.about.intro_closing,
            heroImage: {
                url: 'assets/img/about/about_hero.png',
                alt: 'OIOI Jewellery'
            },
            sections: buildAboutSections(localeData),
            contactIntro: localeData.about.contact_intro,
            contactCalligraphy: localeData.about.contact_calligraphy
        },
        categoryPages: [
            {
                slug: 'matricaria',
                displayTitle: 'MATRICARIA',
                pageUrl: 'matricaria.html',
                subtitle: localeData.matricaria.subtitle,
                seoTitle: localeData.matricaria.title,
                seoDescription: localeData.matricaria.meta_description,
                ogImage: 'assets/img/portfolio/matricaria.png',
                homepageCardEnabled: true,
                homepageCardOrder: 10,
                homepageCardTitle: 'MATRICARIA',
                homepageCardAlt: 'MATRICARIA Collection',
                homepageCardImage: 'assets/img/portfolio/matricaria.png',
                homepageCardUrl: 'matricaria.html',
                shopUrl: 'https://shop.oioijewellery.it/collections/matricaria',
                shopCollectionHandle: 'matricaria',
                descriptionParagraphs: localeData.matricaria.description,
                variants: localeData.matricaria.variants,
                extraNotes: [localeData.matricaria.gold_note, localeData.matricaria.production_time],
                gallery: buildGallery([
                    { url: 'assets/img/portfolio/matricaria/01-hand-rings.png', alt: 'MATRICARIA - Anelli indossati', channels: ['web', 'social', 'email'] },
                    { url: 'assets/img/portfolio/matricaria/02-rings-stems.png', alt: 'MATRICARIA - Anelli su steli', channels: ['web', 'social'] },
                    { url: 'assets/img/portfolio/matricaria/03-rings-lined.png', alt: 'MATRICARIA - Anelli in fila', channels: ['web', 'social'] },
                    { url: 'assets/img/portfolio/matricaria/04-lifestyle.png', alt: 'MATRICARIA - Lifestyle', channels: ['web', 'social', 'email'] },
                    { url: 'assets/img/portfolio/matricaria/05-designs.png', alt: 'MATRICARIA - Schizzi di design', channels: ['web', 'social'] },
                    { url: 'assets/img/portfolio/matricaria/06-rings-quadri.png', alt: 'MATRICARIA - Collezione anelli', channels: ['web'] }
                ])
            },
            {
                slug: 'things',
                displayTitle: 'T.H.I.N.G.S.',
                pageUrl: 'things.html',
                subtitle: localeData.things.subtitle,
                seoTitle: localeData.things.title,
                seoDescription: localeData.things.meta_description,
                ogImage: 'assets/img/portfolio/things/fullsize/pesce_viola.png',
                homepageCardEnabled: true,
                homepageCardOrder: 20,
                homepageCardTitle: 'T.H.I.N.G.S.',
                homepageCardAlt: 'T.H.I.N.G.S. Collection',
                homepageCardImage: 'assets/img/portfolio/things/thumbnails/pesce_viola.png',
                homepageCardUrl: 'things.html',
                shopUrl: 'https://shop.oioijewellery.it/collections/t-h-i-n-g-s',
                shopCollectionHandle: 't-h-i-n-g-s',
                descriptionOpening: localeData.things.description_opening,
                descriptionParagraphs: localeData.things.description,
                descriptionClosing: [localeData.things.description_closing_1, localeData.things.description_closing_2],
                gallery: buildGallery([
                    { url: 'assets/img/portfolio/things/fullsize/pesce_blu_mano_2.png', alt: 'T.H.I.N.G.S. - Pesce blu', channels: ['web', 'social', 'email'] },
                    { url: 'assets/img/portfolio/things/fullsize/pesce_viola_mano.png', alt: 'T.H.I.N.G.S. - Pesce viola', channels: ['web', 'social'] },
                    { url: 'assets/img/portfolio/things/fullsize/medaglia_retro.png', alt: 'T.H.I.N.G.S. - Medaglia retro', channels: ['web'] },
                    { url: 'assets/img/portfolio/things/fullsize/pesce_viola.png', alt: 'T.H.I.N.G.S. - Pesce viola dettaglio', channels: ['web', 'social'] },
                    { url: 'assets/img/portfolio/things/fullsize/pesce.jpg', alt: 'T.H.I.N.G.S. - Pesce blu corteccia', channels: ['web', 'social', 'email'] }
                ])
            },
            {
                slug: 'they-them',
                displayTitle: 'THEY THEM',
                pageUrl: 'they-them.html',
                subtitle: localeData.they_them.subtitle,
                seoTitle: localeData.they_them.title,
                seoDescription: localeData.they_them.meta_description,
                ogImage: 'assets/img/portfolio/theythem.png',
                homepageCardEnabled: true,
                homepageCardOrder: 30,
                homepageCardTitle: 'THEY THEM',
                homepageCardAlt: 'THEY THEM Collection',
                homepageCardImage: 'assets/img/portfolio/theythem.png',
                homepageCardUrl: 'they-them.html',
                shopUrl: 'https://shop.oioijewellery.it/collections/they-them',
                shopCollectionHandle: 'they-them',
                descriptionOpening: localeData.they_them.description_opening,
                descriptionParagraphs: localeData.they_them.description,
                descriptionClosing: [
                    localeData.they_them.description_closing_1,
                    localeData.they_them.description_closing_2,
                    localeData.they_them.description_closing_3
                ],
                gallery: buildGallery([
                    { url: 'assets/img/portfolio/they-them/01-collection.png', alt: 'THEY THEM - Collezione', channels: ['web', 'social', 'email'] },
                    { url: 'assets/img/portfolio/they-them/02-rings-all.png', alt: 'THEY THEM - Anelli', channels: ['web', 'social'] },
                    { url: 'assets/img/portfolio/they-them/03-rings-double.png', alt: 'THEY THEM - Anelli doppi', channels: ['web'] },
                    { url: 'assets/img/portfolio/they-them/04-rings-stack.png', alt: 'THEY THEM - Anelli impilati', channels: ['web', 'social'] },
                    { url: 'assets/img/portfolio/they-them/05-earrings.png', alt: 'THEY THEM - Orecchini', channels: ['web', 'social', 'email'] }
                ])
            },
            {
                slug: 'opera',
                displayTitle: 'OPERA',
                pageUrl: 'opera.html',
                subtitle: localeData.opera.subtitle,
                seoTitle: localeData.opera.title,
                seoDescription: localeData.opera.meta_description,
                ogImage: 'assets/img/portfolio/opera/fullsize/ring1.jpg',
                homepageCardEnabled: true,
                homepageCardOrder: 40,
                homepageCardTitle: 'OPERA',
                homepageCardAlt: 'Opera Collection',
                homepageCardImage: 'assets/img/portfolio/opera/thumbnails/ring2.jpg',
                homepageCardUrl: 'opera.html',
                shopUrl: '',
                shopCollectionHandle: '',
                descriptionParagraphs: localeData.opera.description,
                descriptionClosing: [localeData.opera.description_closing],
                gallery: buildGallery([
                    { url: 'assets/img/portfolio/opera/fullsize/ring1.jpg', alt: 'Opera Collection Image 1', channels: ['web', 'social', 'email'] },
                    { url: 'assets/img/portfolio/opera/fullsize/dfg_blu.jpg', alt: 'Opera Collection Image 2', channels: ['web', 'social'] },
                    { url: 'assets/img/portfolio/opera/fullsize/dfg_red.jpg', alt: 'Opera Collection Image 3', channels: ['web', 'social'] },
                    { url: 'assets/img/portfolio/opera/fullsize/dfg_green.jpg', alt: 'Opera Collection Image 4', channels: ['web'] },
                    { url: 'assets/img/portfolio/opera/fullsize/ring2.jpg', alt: 'Opera Collection Image 5', channels: ['web', 'email'] },
                    { url: 'assets/img/portfolio/opera/fullsize/anello_michele.png', alt: 'Opera Collection - Anello Michele', channels: ['web', 'social'] }
                ])
            }
        ]
    };
}

module.exports = {
    buildDefaultCmsContent: buildDefaultCmsContent
};
