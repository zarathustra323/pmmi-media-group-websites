const gql = require('graphql-tag');

module.exports = gql`

fragment LeadersContentForSectionFragment on Content {
  id
  name
  siteContext {
    path
  }
  ... on SocialLinkable {
    socialLinks {
      provider
    }
  }
  primaryImage{
    id
    src(input: {
      options: {
        auto: "format",
        fillColor: "fff",
        fit: "fill",
        bg: "fff",
        pad: 20,
        h: 200,
        w: 200,
        borderRadius: "200,200,200,200",
        border: "10,fff",
      },
    })
  }
  ... on ContentCompany {
    productUrls: externalLinks(input: { keys: ["company-products"] }) {
      url
    }
    productSummary
    publicContacts(input: { pagination: { limit: 1 } }) {
      edges {
        node {
          id
          name
          title
          primaryImage {
            id
            src(input: {
              options: {
                auto: "format",
                h: 100,
                w: 100,
                mask: "ellipse",
                fit: "facearea",
                facepad: 3
              }
            })
          }
        }
      }
    }
    teaser(input: { useFallback: false, maxLength: null })
    website
    promotions: relatedContent(input: {
      withSite: false,
      queryTypes: [company],
      includeContentTypes: [Promotion],
      pagination: { limit: 4 },
    }) {
      edges {
        node {
          id
          name
          primaryImage{
            id
            src(input: {
              options: {
                auto: "format",
                fit: "crop",
                h: 180,
                w: 240,
              }
            })
            alt
            isLogo
          }
          ... on ContentPromotion {
            linkUrl
            linkText
          }
        }
      }
    }
    youtube {
      username
      channelId
      url
    }
    videos: youtubeVideos(input: { pagination: { limit: 3 } }) {
      edges {
        node {
          id
          url
          title
          thumbnail(input: { size: medium })
        }
      }
    }
  }
}

`;
