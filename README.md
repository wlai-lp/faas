# https://github.com/LivePersonInc/faas-cli

# TO create new faas function use `lpf init`

# snippets are in .vscode/faas-snippets.code-snippets

# check lpf is working

## use `lpf get functions`

## you should get login prompts and then it should diplay list of functions

or

## > lpf login -a 90412079 -u wlai@liveperson.com -p P@ssword3!

# local developmernt

## install lpf

## lpf init // init project

## cd to functions folder

## lpf pull 'faas function name' to pull it from the account

## the project folder convention is functions\[function folder]\index.js and config.json

## to invoke a funciton do functions\function name, it going to get index.js and config.json

# use settings.json to include parameters

## TODO example

# TO Debug in VSCcode (can't get it working)

Preparation for Debugging
It's necessary to run the lpf init command to initialize the project structure and to install all required packages for the local faas-toolbelt.

To get started with the local development and debugging some preparation is needed:

Local secrets and whitelisting can be stored in the settings.json
Local environment variables and input can be stored in the config.json in the functions folder
The Debugger will use a mocked faas-toolbelt
To have access to the LivePerson services it's necessary to be logged in or set an environment variable called BRAND_ID with your accountId
Example with BRAND_ID and debug command: BRAND_ID=123456789 lpf debug TestFunction
Debugging with VSC
Set a breakpoint in your desired function.
Run the debugger (two options available)
lpf debug <function name>
Open command palette -> Tasks: Run Task -> Debug Function
Run Attach FaaS Debugger from the launch.json.
The debugger will start and pause at the auto-generated code.
Use IntelliJ debugger to navigate through your code.

# Tips

- you can set config.json and invoke the deployed version in the cloud with local config.json
- use `console.info("debug message");` it will be part of the result payload

```
{
    "result": "Hello Worldundefined",
    "logs": [
        {
            "level": "Info",
            "message": "debug message",
            "extras": [],
            "timestamp": 1664568751806
        }
    ]
}
```
