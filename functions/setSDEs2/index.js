function lambda(input, callback) {
    console.info("setSDES2");

    console.info("input is " + JSON.stringify(input));

    try{
        const { Toolbelt, SDETypes } = require('lp-faas-toolbelt');
        const sdeUtil = Toolbelt.SDEUtil();

        // Define parameters
        const visitorId = input.payload.visitorId;
        const sessionId = input.payload.sessionId;
        const sdes = input.payload.lp_sdes;
        
        console.info(`visitor id is ${visitorId}`);
        console.info(`session id is ${sessionId}`);
        console.info(`session id is ${sdes}`);
        //console.info(response);

        const response = sdeUtil.addSDEs(sdes, visitorId, sessionId);
        // Handle response
        console.info(response);
        
    } catch(error) {
    // Handle error based on your integration by providing a legit fallback operation.
        console.error(`received following error message: ${error.message}`);
    }
    callback(null, `Hello World`);
}
