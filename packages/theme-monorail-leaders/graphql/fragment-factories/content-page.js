const gql = require('graphql-tag');

module.exports = leadersAlias => gql`
fragment LeadersContentPageFragment on Content {
  id
  name
  labels
  teaser(input: { useFallback: false, maxLength: null })
  body
  status
  published
  siteContext {
    path
    canonicalUrl
  }
  company {
    id
    name
    siteContext {
      path
      canonicalUrl
    }
    enableRmi
  }
  taxonomy(input: { type: Category }) {
    edges {
      node {
        id
        name
        hierarchy {
          id
          name
        }
      }
    }
  }
  primarySection {
    id
    name
    alias
    canonicalPath
    hierarchy {
      id
      name
      alias
      canonicalPath
    }
  }
  primaryImage {
    id
    src(input: { useCropRectangle: true, options: { auto: "format,compress", q: 70 } })
    cropRectangle {
      width
      height
    }
    alt
    caption
    credit
    isLogo
    cropDimensions {
      aspectRatio
    }
    primaryImageDisplay
  }
  images(input:{ pagination: { limit: 100 }, sort: { order: values } }) {
    edges {
      node {
        id
        src(input: { options: { auto: "format,compress", q: 70 } })
        alt
        displayName
        caption
        credit
        isLogo
      }
    }
  }
  companies: relatedContent(input: { includeContentTypes: [Company] }) {
    edges {
      node {
        id
      }
    }
  }
  gating {
    surveyType
    surveyId
  }
  userRegistration {
    isCurrentlyRequired
    accessLevels
  }
  ... on ContentVideo {
    embedCode
    transcript
  }
  ... on ContentNews {
    source
    byline
  }
  ... on ContentEvent {
    endDate
    startDate
  }
  ... on SidebarEnabledInterface {
    sidebars: sidebarStubs {
      name
      body
      label
    }
  }
  ... on ContentPodcast {
    transcript
  }
  ... on ContentWebinar {
    linkUrl
    startDate
    transcript
    sponsors {
      edges {
        node {
          id
          name
          siteContext {
            path
          }
        }
      }
    }
  }
  ... on Addressable {
    address1
    address2
    cityStateZip
    country
  }
  ... on Contactable {
    phone
    tollfree
    fax
    website
    title
    mobile
    publicEmail
  }
  ... on ContentCompany {
    email
    isLeader: hasWebsiteSchedule(input: { sectionAlias: "${leadersAlias}" })
  }
  ... on SocialLinkable {
    socialLinks {
      provider
      url
      label
    }
  }
  ... on Media {
    fileSrc
  }
  ... on Authorable {
    authors {
      edges {
        node {
          id
          name
          title
          type
          siteContext {
            path
          }
        }
      }
    }
    contributors {
      edges {
        node {
          id
          name
          title
          type
          siteContext {
            path
          }
        }
      }
    }
    photographers {
      edges {
        node {
          id
          name
          title
          type
          siteContext {
            path
          }
        }
      }
    }
  }
}
`;
