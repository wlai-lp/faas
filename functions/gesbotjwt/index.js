async function lambda(input, callback) {
  // import FaaS Toolbelt
  const { Toolbelt } = require('lp-faas-toolbelt');
  // obtain SecretClient from Toolbelt
  const secretClient = Toolbelt.SecretClient();
  var secret = await secretClient.readSecret('gesbot_private_key');
  console.info(secret.value);
  callback(null, { message: 'Successfully updated secret' });

  // // this is how you can access your stored secret
  // secretClient.readSecret('gesbot_private_key')
  // .then(mySecret => {
  //   // Fetching the secret value
  //   const value = mySecret.value
  //   console.info(value)
  //   // you can also update your secret e.g. if you received a new OAuth2 token
  //   //mySecret.value = 'nEw.oaUtH2-tOKeN!!11!';
  //   //return secretClient.updateSecret(mySecret)
  // })
  // .then(_ => {
  //   callback(null, { message: 'Successfully updated secret' });
  // })
  // .catch(err => {
  //   console.error(`Failed during secret operation with ${err.message}`)
  //   callback(err, null);
  // });
}