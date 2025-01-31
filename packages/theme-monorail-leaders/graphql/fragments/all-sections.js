const gql = require('graphql-tag');

module.exports = gql`

fragment LeadersAllSections on WebsiteSection {
  id
  name
  children(input: { sort: { field: name, order: asc }, pagination: { limit: 0 } }) {
    edges {
      node {
        id
        name
        children(input: { sort: { field: name, order: asc }, pagination: { limit: 0 } }) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
}
`;
