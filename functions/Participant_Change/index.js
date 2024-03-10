async function lambda(input, callback) {
  // Set conversation data.
  console.info("test logging");
  const { Toolbelt, ConversationContentTypes } = require("lp-faas-toolbelt");
  const conversationUtil = Toolbelt.ConversationUtil();
  const sdeUtil = Toolbelt.SDEUtil();
  let conversation = input.payload;

  //let paylod = JSON.parse(conversation);
  // Some processing ...
  // Result can be either an object or array.
  // Hint: Make sure to only return each type once.
  let convoId = conversation.general.convId;
  const conversationId = convoId;

  const contentToRetrieve = [
    ConversationContentTypes.SDES,
    ConversationContentTypes.UNAUTH_SDES
  ];
  try {
    // Get conversation
    const conversation = await conversationUtil.getConversationById(conversationId, contentToRetrieve);
    convoId = "after conversation 3";
    console.info(JSON.stringify(conversation));
    const sdes = sdeUtil.getSDEsFromConv(conversation);
    console.info(JSON.stringify(sdes));
    // const name = conversation.conversationHistoryRecords[0].sdes.events[0].personalInfo.personalInfo.name;
    // const name = conversation.conversationHistoryRecords[0].sdes.events[0];
    const result = conversation.conversationHistoryRecords[0].sdes.events.filter(event => event.sdeType == 'PERSONAL_INFO');

    console.info("your name is " + result[0].personalInfo.personalInfo.name);
  } catch(error) {
    // Handle error based on your integration by providing a legit fallback operation.
    console.error(`received following error message: ${error.message}`);
  }

  let result = [
    {
      type: "systemMessage", // Returns a system message into the conversation.
      text:
        "your message participant change event triggered convo id " + convoId,
    },
    // },
    // {
    //     type: "transfer", // Transfers the conversation.
    //     skillId: "123456", // Transfer to different skill.
    //     agentId: "123456" // Propose an agent.
    // },
    // {
    //     type: "closeConversation" // Closes the conversation.
    // }
  ];
  callback(null, result);
}
