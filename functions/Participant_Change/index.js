function lambda(input, callback) {
    // Set conversation data.
    let conversation = input.payload;
    // Some processing ...
    // Result can be either an object or array.
    // Hint: Make sure to only return each type once.
    let result = [
        {
            type: "systemMessage", // Returns a system message into the conversation.
            text: "your message participant change event triggered"
        }
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