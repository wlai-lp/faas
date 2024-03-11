const { Toolbelt, SDETypes } = require('lp-faas-toolbelt');
const sdeUtil = Toolbelt.SDEUtil();
// Define parameters
const visitorId = 'YOUR_VISITOR_ID';
const sessionId = 'YOUR_SESSION_ID';
const sdes = [
  {
      type: SDETypes.PERSONAL_INFO,
      personal: {
          contacts: [
              {
                  email: 'john.doe@example.com'
              }
          ]
      }
  }
];
try {
  const response = await sdeUtil.addSDEs(sdes, visitorId, sessionId);
  // Handle response
  console.info(response);
  // You can also extract SDEs from a conversation you fetched before (using Toolbelts ConversationUtil())
  const sdes = sdeUtil.getSDEsFromConv(YOUR_CONVERSATION);
  // Handle SDEs
  console.info(sdes);
} catch(error) {
  // Handle error based on your integration by providing a legit fallback operation.
  console.error(`received following error message: ${error.message}`);
}

const { Toolbelt, ConversationContentTypes } = require('lp-faas-toolbelt');
const conversationUtil = Toolbelt.ConversationUtil();
// Define parameters
const conversationId = 'YOUR_CONVERSATION_ID';
// Optional Filters
const contentToRetrieve = [
  ConversationContentTypes.SDES,
  ConversationContentTypes.UNAUTH_SDES
];
try {
  // Get conversation
  const conversation = await conversationUtil.getConversationById(conversationId, contentToRetrieve);
  // Determine Keywords
  const keywords = ['Keyword', 'awesome'];
  // Scan conversation for keywords, result is an array of objects in form { message, sentTimestamp, sentBy }
  const scannerResult = conversationUtil.scanConversationForKeywords(
    conversation,
    keywords
  );
} catch(error) {
  // Handle error based on your integration by providing a legit fallback operation.
  console.error(`received following error message: ${error.message}`);
}