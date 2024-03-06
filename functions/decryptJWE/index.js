async function lambda(input, callback) {
  try {
    const { Toolbelt, SDETypes } = require("lp-faas-toolbelt");
    const secretClient = Toolbelt.SecretClient();
    const crypto = require("crypto");

    console.info("input = " + JSON.stringify(input));

    // TODO: update and use private key 1
    let secretValue = await secretClient.readSecret("private_key");
    const privateKey = Buffer.from(secretValue.value, "utf-8").toString();

    // TODO: get sde from payload, we will use jwe in payload
    const encryptedDataString = input.payload.jwe;
    console.info("payload sde encrypted = " + encryptedDataString);

    // TODO: do the actual decryption
    // dummy data for testing
    const sdes = [
      {
        type: SDETypes.PERSONAL_INFO,
        personal: {
          contacts: [
            {
              email: "john.doe@example.com",
            },
          ],
        },
      },
    ];

    var result = {};
    result.sdes = sdes;

    console.info(result);
    callback(null, result);
  } catch (error) {
    // Handle error based on your integration by providing a legit fallback operation.
    console.error(`received following error message: ${error.message}`);
    callback(null, `Error decrypting payload`);
  }
}
