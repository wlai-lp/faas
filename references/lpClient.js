const { Toolbelt, ConversationContentTypes, LpServices } = require("lp-faas-toolbelt");
const lpClient = Toolbelt.LpClient();
const httpClient = Toolbelt.httpClient();
const accountId = process.env.BRAND_ID;

async function lambda(input, callback) {
    try {
        const { conversationId } = input.payload;
        const record = await getMessageHistory(conversationId);
        if(record && record.sdes && record.sdes.events) {
            console.info(JSON.stringify(record.sdes.events));
            const customerInfo = record.sdes.events.find((sde) => sde.sdeType === 'CUSTOMER_INFO');
            if(customerInfo) {
                const encryptedCCN = customerInfo.customerInfo.customerInfo.accountName;
                const decryptedCCN = decryptStringFromEndpoint(encryptedCCN);
                console.info("DECRYPTED_CCN: " + decryptedCCN);
                callback(null, decryptedCCN);
            } else {
                callback(null, "No SDEs found");
            }
        } else {
            callback(null, "No record found");
        }
    } catch(e) {
        callback(e, null);
    }

}

async function getMessageHistory(convId) {
  try {
    const messagingHistory = await lpClient(LpServices.MSG_HIST, `/messaging_history/api/account/${accountId}/conversations/conversation/search?v=2`, {
      method: "POST",
      json: true,
      body: {
        conversationId: convId,
        contentToRetrieve: [ConversationContentTypes.SDES],
        cappingConfiguration: "CustomerInfoEvent:1:desc,PersonalInfoEvent:1:desc,CustomerInfoEventEnriched:1:desc,PersonalInfoEventEnriched:1:desc,ConversationSummaryEvent:1:desc,CartStatusEvent:1:desc,ServiceActivityEvent:1:desc,MarketingCampaignInfoEvent:1:desc,PurchaseEvent:1:desc,ViewedProductEvent:1:desc,VisitorErrorEvent:1:desc,LeadEvent:1:desc,SearchContentEvent:1:desc"
      },
    });

    if (!messagingHistory || !messagingHistory.conversationHistoryRecords || !messagingHistory.conversationHistoryRecords[0]) {
      console.info(convId, "Conversation not exist");
      return null;
    }
    return messagingHistory.conversationHistoryRecords[0];
  } catch (err) {
    throw err;
  }
}

const decryptStringFromEndpoint = function(toDecrypt) {
    const request = {
      url: process.env.DECRYPTION_URL,
      method: "POST"
    };

    const data = {
      toDecrypt
    }

    let response = await httpClient(request.url, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "..."
      },
      body: JSON.stringify(data),
      simple: false,
      resolveWithFullResponse: true
    });

    switch (response.statusCode) {
      case 200, 201:
        return JSON.parse(response.body);
      default:
        throw `Recieved unexpected status code ${
          response.statusCode
        } during request`;
    }
};
