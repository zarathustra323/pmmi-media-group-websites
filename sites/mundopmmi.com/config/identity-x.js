const configureIdentityX = require('@pmmi-media-group/package-shared/config/identity-x');

module.exports = configureIdentityX({
  appId: process.env.IDENTITYX_APP_ID || '5e28a4c858e67b86c955ae4d',
});
