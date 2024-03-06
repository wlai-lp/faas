async function lambda(input, callback) {
  const { Toolbelt, LpServices } = require("lp-faas-toolbelt");
  const httpClient = Toolbelt.HTTPClient();
  const lpClient = Toolbelt.LpClient();
  const secretClient = Toolbelt.SecretClient();
  //const skillsArray = process.env.AGENT_SKILL_IDS.split(',');

  const caseEndpoint = process.env.CASE_ENDPOINT;
  const transferEndpoint = process.env.TRANSFER_ENDPOINT;

  let secretCache = {};
  const cars = ["Saab", "Volvo", "BMW"];

  let secretValue = await secretClient.readSecret("secret_key");

  console.info("debug message " + secretValue.value);
  callback(null, `Hello World` + secretValue.value);
}
