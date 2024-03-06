const { Toolbelt } = require("lp-faas-toolbelt");
const httpClient = Toolbelt.HTTPClient();
const secretClient = Toolbelt.SecretClient();

async function lambda(input, callback) {
  try {
    // Set conversation data.
    const conversation = input.payload;
    const convId = conversation.general.convId;
    const event = conversation.general.cbotEventType;
    const newSkillId = conversation.routing.newSkillId.toString();
    const oldSkillId = conversation.routing.oldSkillId;

    //console.info(JSON.stringify(conversation));

    let result = [];

    console.info(convId, `Event: ${event}, New Skill: ${newSkillId}, Old skill: ${oldSkillId} `);

    const fromAgentSkills = process.env.FROM_AGENT_SKILLS.split(","); // from any agents skills
    /*
   metamask_funds_management stage: 3642097638 Prod: 3542107330
   metamask_general stage: 3642098138 Prod: 3542108130
   metamask_portfolio_dapp stage: 4063823038 Prod: 4097213238
   metamask_security Stage:3642098438 Prod: 3542107930
   metamask_transactions_swaps stage: 3642098538 Prod: 3542107530
   metamask_wallet_management stage: 3642097338 Prod: 3542107230
   metamask_web3_dapps stage: 3642098738 Prod: 3542107630
   metamask_bot_fallback stage: 4165718538 Prod:
   */
    //const securitySkill = process.env.SECURITY_SKILL;
    const portfolioSkill = process.env.PORTFOLIO_SKILLS;
    const toAgentSkills = [portfolioSkill];
    //metamask_security Stage:3642098438 Prod: 3542107930
    //metamask_portfolio_dapp stage: 4063823038 Prod: 4097213238

    if (toAgentSkills.includes(newSkillId) && fromAgentSkills.includes(oldSkillId)) {
      const mavenApiKey = await loadSecret("MAVEN_API_KEY");
      const agentStatuses = await getAgentStatus(mavenApiKey);
      console.info(convId, agentStatuses);
      console.info(convId, `security skill status:  ${agentStatuses[newSkillId]}`);
      if (agentStatuses && agentStatuses[newSkillId] && agentStatuses[newSkillId] == "OFFLINE") {
        console.info(convId, "Transfer to ticketing bot");
        const ticketingType = newSkillId == portfolioSkill ? "Portfolio" : "security";
        await updateTicketingType(mavenApiKey, ticketingType, convId);
        result = [
          {
            type: "systemMessage", // Returns a system message into the conversation.
            text: " ",
          },
          {
            type: "transfer", // Transfers the conversation.
            skillId: process.env.TICKETING_BOT_SKILL, // Transfer to different skill.
          },
        ];
      }
    }
    callback(null, result);
  } catch (error) {
    console.error("Error", error.message.slice(0, 200));
    callback(error, "Something wrong happened");
  }
}

async function loadSecret(name) {
  const { value } = await secretClient.readSecret(name);
  return value;
}

// https://developers.liveperson.com/conversation-orchestrator-conversation-context-service-methods-v1.html
async function getAgentStatus(mavenApiKey) {
  const CCSUrl = `https://${process.env.MAVEN_URI}/v1/account/${process.env.BRAND_ID}/${process.env.CONTEXT_WAREHOUSE_NAME}/properties/${process.env.CONTEXT_PROPERTY_NAME}`;
  return await httpClient(CCSUrl, {
    method: "GET",
    headers: {
      "maven-api-key": mavenApiKey,
    },
    json: true,
  });
}

// https://developers.liveperson.com/conversation-orchestrator-conversation-context-service-methods-v1.html
async function updateTicketingType(mavenApiKey, ticketingType, convId) {
  const CCSUrl = `https://${process.env.MAVEN_URI}/v1/account/${process.env.BRAND_ID}/${process.env.CONTEXT_WAREHOUSE_NAME}/${convId}/properties/${process.env.SESSION_PROPERTY}`;
  await httpClient(CCSUrl, {
    method: "PUT",
    headers: {
      "maven-api-key": mavenApiKey,
    },
    simple: true,
    body: ticketingType,
    json: true,
  });
}