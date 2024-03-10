async function lambda(input, callback) {
  /**
   * arguments: String array of command arguments.
   * conversationId: The ID of the conversation in which the command was called.
   */

  const { arguments: args, conversationId } = input.payload;

  const { Toolbelt } = require("lp-faas-toolbelt");
  // Obtain an HTTPClient Instance from the Toolbelt
  // For API Docs look @ https://www.npmjs.com/package/request-promise
  const httpClient = Toolbelt.HTTPClient();
  const URL = "https://6367ec75edc85dbc84debec0.mockapi.io/api/v1/sde";
  try {
    const { statusCode, body } = await httpClient(URL, {
      method: "GET", // HTTP VERB
      headers: {}, // Your Headers
      simple: false, // IF true => Status Code != 2xx & 3xx will throw
      resolveWithFullResponse: true, // IF true => Includes Status Code, Headers etc.
    });
    switch (statusCode) {
      case 200:
        console.info(body);
        break;
      default:
        console.error(`Received unexpected status code ${statusCode}`);
        break;
    }
  } catch (error) {
    if (error.message === "Error [ERR_SOCKET_CLOSED]: Socket is closed") {
      // Not whitelisted
      console.warn(`Need to whitelist`);
    }
    // Handle error based on your integration by providing a legit fallback operation.
    console.error(`received following error message: ${error.message}`);
  }

  // login to LP as service

  let data = JSON.stringify({
    "username": "super_bot",
    "appKey": "346c2756ad7f4c4d9f1835959aa69ae7",
    "secret": "4fc876f0689a35f5",
    "accessToken": "5c2b50f8bdb240e4a18bd1cf1ab66c8d",
    "accessTokenSecret": "1aefb648b8ad8e70"
  });

  const loginURL = "https://va.agentvep.liveperson.net/api/account/90412079/login?v=1.3";
  try {
    const { statusCode, body } = await httpClient(loginURL, {
      method: "POST", // HTTP VERB
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json'        
      },
      body: data,
      simple: false, // IF true => Status Code != 2xx & 3xx will throw
      resolveWithFullResponse: true, // IF true => Includes Status Code, Headers etc.
    });
    switch (statusCode) {
      case 200:
        // console.info(body);
        const bearer = JSON.parse(body).bearer;
        console.info("bearer token " + bearer);
        break;
      default:
        console.error(`Received unexpected status code ${statusCode}`);
        break;
    }
  } catch (error) {
    if (error.message === "Error [ERR_SOCKET_CLOSED]: Socket is closed") {
      // Not whitelisted
      console.warn(`Need to whitelist`);
    }
    // Handle error based on your integration by providing a legit fallback operation.
    console.error(`received following error message: ${error.message}`);
  }

  if (args.length === 0)
    callback(new Error("Please provide at least one argument."));

  console.info("input info " + JSON.stringify(input));

  // Return type has to be string, everything else will not be shown in the LiveEngage.
  callback(null, args.join(" ").trim());
}
