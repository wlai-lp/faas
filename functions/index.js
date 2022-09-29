const { Toolbelt, ConversationContentTypes } = require("lp-faas-toolbelt");
const conversationUtil = Toolbelt.ConversationUtil();
// Define parameters
const conversationId = "YOUR_CONVERSATION_ID";
// Optional Filters
const contentToRetrieve = [
  ConversationContentTypes.SDES,
  ConversationContentTypes.UNAUTH_SDES,
];
try {
  console.log("hello world");
  //   // Get conversation
  //   const conversation = await conversationUtil.getConversationById(conversationId, contentToRetrieve);
  //   // Determine Keywords
  //   const keywords = ['Keyword', 'awesome'];
  //   // Scan conversation for keywords, result is an array of objects in form { message, sentTimestamp, sentBy }
  //   const scannerResult = conversationUtil.scanConversationForKeywords(
  //     conversation,
  //     keywords
  //   );
} catch (error) {
  // Handle error based on your integration by providing a legit fallback operation.
  console.error(`received following error message: ${error.message}`);
}
