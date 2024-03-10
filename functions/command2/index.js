function lambda(input, callback) {
    /**
     * arguments: String array of command arguments.
     * conversationId: The ID of the conversation in which the command was called.
     */
    const { arguments: args, conversationId } = input.payload;

    if (args.length === 0) callback(new Error("Please provide at least one argument."));

    console.info("input info " + JSON.stringify(input));

    // Return type has to be string, everything else will not be shown in the LiveEngage.
    callback(null, args.join(" ").trim());
}