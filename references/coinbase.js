const { Toolbelt, LpServices } = require("lp-faas-toolbelt");
const httpClient = Toolbelt.HTTPClient();
const lpClient = Toolbelt.LpClient();
const secretClient = Toolbelt.SecretClient();
const skillsArray = process.env.AGENT_SKILL_IDS.split(",");

const caseEndpoint = process.env.CASE_ENDPOINT;
const transferEndpoint = process.env.TRANSFER_ENDPOINT;
const brandId = process.env.BRAND_ID;
const contextWarehouseName = process.env.CONTEXT_WAREHOUSE_NAME;

// String with undefined envars like "CASE_ENDPOINT, ..." or empty string if all envars defined
const undefinedEnvars = [
  caseEndpoint,
  transferEndpoint,
  brandId,
  contextWarehouseName,
]
  .map((envar) => typeof envar === "undefined")
  .join(", ");

let secretCache = {};

// We cache the secrets to avoid unneeded calls to secret store and be more resilience in case of request errors
async function lazyLoadSecret(name) {
  if (secretCache[name] !== undefined) {
    return secretCache[name];
  }

  const { value } = await secretClient.readSecret(name);

  secretCache[name] = value;
  return value;
}

function getNewParticipantIds(participantChange) {
  return participantChange.newParticipants.forEach((par) => {
    if (par.role.toUpperCase() === "ASSIGNED_AGENT") {
      newParticipantIds.push(par.id);
    }
  });
}

function getAssignedAgents(newParticipantIds, usersData) {
  return newParticipantIds.map((id) =>
    usersData.find((user) => user.pid === id)
  );
}

async function getUsersData() {
  const usersData = await lpClient(
    LpServices.ACCOUNT_CONFIG_READ_WRITE,
    `/api/account/${brandId}/configuration/le-users/users?v=4`,
    {
      method: "GET",
      json: true,
    }
  );

  if (!Array.isArray(usersData) || usersData.length == 0) {
    throw new Error("Failed to get users data.");
  }

  return usersData;
}

async function getContextWarehouseCase(contextWareHouseURL, mavenApiKey) {
  try {
    const contextWarehouseResponse = await httpClient(contextWareHouseURL, {
      method: "GET",
      headers: {
        "maven-api-key": mavenApiKey,
      },
      simple: true,
      resolveWithFullResponse: true,
    });
    return JSON.parse(contextWarehouseResponse.body);
  } catch (e) {
    console.error("Failed to fetch case data from warehouse");
    throw new Error(e);
  }
}

async function createCaseSalesForce(salesForceCaseURL, authHeader, data) {
  try {
    await httpClient(salesForceCaseURL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      resolveWithFullResponse: true,
      body: {
        SuppliedEmail: data["email"],
        Subject: data["lastIntent"],
        Chat_ID__c: data["conversationId"],
        origin: "Live_Message",
        Description: JSON.stringify({
          "Conversation ID": data["conversationId"],
          "User ID": data["userId"],
          Intent: data["lastIntent"],
        }),
        Customer_Intent__c: data["lastIntent"],
      },
      json: true,
    });
    return true;
  } catch (e) {
    console.error("Failed to create salesforce case");
    // Add optional retry logic;
    throw new Error(e);
  }
}

async function updateContextWarehouseCase(contextWareHouseURL, mavenApiKey) {
  try {
    await httpClient(contextWareHouseURL, {
      method: "PATCH",
      headers: {
        "maven-api-key": mavenApiKey,
      },
      simple: true,
      resolveWithFullResponse: true,
      body: {
        caseCreated: true,
      },
      json: true,
    });
  } catch (e) {
    console.error("Failed to create salesforce case");
    // Add optional retry logic;
    throw new Error(e);
  }
}

async function callTransferEndpoint({ transferEndpointURL, authHeader, body }) {
  return await httpClient(transferEndpointURL, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/json",
    },
    simple: true,
    resolveWithFullResponse: true,
    body: {
      event: "participant_change",
      ...body,
    },
    json: true,
  });
}

async function createCase({
  contextWareHouseURL,
  mavenApiKey,
  salesForceCaseURL,
  salesforceAuthHeader,
}) {
  const contextWarehouseData = await getContextWarehouseCase(
    contextWareHouseURL,
    mavenApiKey
  );

  await createCaseSalesForce(
    salesForceCaseURL,
    salesforceAuthHeader,
    contextWarehouseData
  );
  await updateContextWarehouseCase(contextWareHouseURL, mavenApiKey);
}

/**
 * Logic that runs when an LP chat is escalated to a human agent. This passes a payload
 * including the chat transcript and the agent to Salesforce where an SFDC case is created.
 */
async function lambda(input, callback) {
  try {
    const startTime = Date.now() / 1000;

    if (!!undefinedEnvars) {
      throw new Error(`Unset env vars: ${undefinedEnvars}`);
    }

    const conversation = input.payload;
    const skill = conversation.routing.newSkillId;

    if (!skillsArray.includes(skill)) {
      console.info(`The skill: ${skill} is not included in the list`);
      return callback(null, null);
    }

    // If there is an error here it will be caught in the global try/catch and function will stops ending in error
    const { value: salesForceAuthHeader } = await lazyLoadSecret("authHeader");
    const { value: mavenApiKey } = await lazyLoadSecret("mavenApiKey");

    const conversationID = conversation.general.convId;
    const contextWareHouseURL = `https://z1.context.liveperson.net/v1/account/${brandId}/${contextWarehouseName}/${conversationID}/properties`;

    try {
      if (
        !contextWarehouseData["caseCreated"] &&
        contextWarehouseData["email"]
      ) {
        await createCase({
          contextWareHouseURL,
          mavenApiKey,
          salesForceCaseURL: caseEndpoint,
          salesforceAuthHeader: salesForceAuthHeader,
        });
      }
    } catch (e) {
      console.error("Creating a salesforce case failed", e);
    }

    const usersData = await getUsersData();
    const participantChange = conversation.participantChange;
    const newParticipantIds = getNewParticipantIds(participantChange);
    const assignedAgents = getAssignedAgents(newParticipantIds, usersData);

    if (assignedAgents.length >= 5) {
      console.info("More than 4 agents have been assigned to this case.");
    }

    callTransferEndpoint({
      transferEndpointURL: transferEndpoint,
      authHeader: salesForceAuthHeader,
      body: {
        event: "participant_change",
        conversationID,
        participantChange,
        users: assignedAgents,
        skill,
      },
    });

    const endTime = Date.now() / 1000;
    const timeOfExec = endTime - startTime;

    if (timeOfExec > 25) {
      console.info(
        "conversationParticipantsChange execution finished in " +
          timeOfExec.toString() +
          " seconds."
      );
    }

    callback(null, null);
  } catch (error) {
    console.error("Something wrong happened", error.message);
    // If you pass the error in the callback in the first param the function will end with error and the bot which invokes te function will retry the invocation
    // If you don't want to retry the invocation just changer the callback by callback(null, `Something wrong happened` );  it will end as successful if the first argument is null
    callback(error, "Something wrong happened");
  }
}
