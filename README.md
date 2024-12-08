# Tweet Code

Share code snippets directly to Twitter/X from VS Code.

## Features

-   Share selected code with a right-click
-   Preview and edit tweets before posting
-   Dark mode support
-   Character count validation
-   Secure credential management

## Prerequisites

You need an X (formerly Twitter) developer account and OAuth 1.0 credentials to use this extension [(docs)](https://developer.x.com/en/docs/authentication/oauth-1-0a)

1. Create a developer account
2. Create an app
3. Generate consumer keys and access tokens

## Setup

1. ~~Install the extension from the VS Code marketplace~~ (almost there!)
2. Right-click on any code selection and choose "Tweet Selection"
3. Click "Disconnected" to create a `.twitter-credentials` file
4. Add your X API credentials to the file:

```json
{
	"consumerKey": "your-consumer-key",
	"consumerSecret": "your-consumer-secret",
	"accessToken": "your-access-token",
	"accessSecret": "your-access-secret"
}
```

Alternative: Clone this repository and run the following commands:

1. `cd tweet-code`
2. `bun install`
3. `chmod +x scripts/publish-local.sh `
4. `./scripts/publish-local.sh`

## Usage

1. Select code in your editor
2. Right-click and choose "Tweet Selection"
3. Edit your tweet if needed
4. Click "Post Tweet"

Alternative: Use the command palette (`Cmd/Ctrl + Shift + P`) and search for "Tweet Code: Share"

## Security Note

Your X credentials are stored locally in your workspace. Never commit the `.twitter-credentials` file to version control.

## Contributing

Pull requests are welcome! I made this extension for personal consumption, so issues will be considered without SLA.

## License

MIT
