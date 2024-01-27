
# Shadow Liker

#### A Discord Bot for getting notification for the YouTube video uploads

## 🚀 Run Locally

Clone the project

```bash
  git clone https://github.com/V9vek/Shadow-Liker
```

Go to the project directory

```bash
  cd Shadow-Liker
```

Install dependencies

```bash
  npm i
```

#### Before running, add the `config.json` file

To run in ```Production``` mode

```bash
  npm run start
```
To run in ```Development``` mode

```bash
  npm run devStart
```

## 🧾 Config File

To run this project, you will need to add the following values  to your `dev/config.json` file

Create `dev` folder in your project root directory and create `config.json` file in this format


```
Production Mode
```

| Key | Value     |
| :-------- | :------- |
| `token` | `YOUR_DISCORD_TOKEN` |
| `discordClientId` | `YOUR_DISCORD_CLIENT_ID` |


```
Development Mode
```

| Key | Value     |
| :-------- | :------- |
| `devToken` | `YOUR_DISCORD_TOKEN` |
| `devDiscordClientId` | `YOUR_DISCORD_CLIENT_ID` |
| `devGuildId` | `YOUR_DISCORD_SERVER_ID` |
| `developerUserIds` | [`DISCORD_USER_ID_1, DISCORD_USER_ID_2`] |


## 🧠 How to get ``config.json`` tokens

### Step 1: Create a Discord Application

Go to the [Discord Developer Portal](https://discord.com/developers/applications).
```
Click on the `New Application` button.

Enter a name for your application (this will be your bot's name).

Go to the `Bot` tab on the left sidebar.

Click on `Add Bot` to convert your application to a bot. Confirm the action.
```

### Step 2: Obtain Token and URL
```
In the `Bot` tab, click `Reset Token` button, click on `Copy` to copy your bot token. This will be your `token`

Save this token securely; you'll need it to authenticate your bot with the Discord API.

Note your `discordClientId` from the "General Information" tab
```

### Step 3: Invite Your Bot to a Server
```
In the `OAuth2` tab, scroll down to the `URL Generator` section.

Check the `bot` scope and `applications.commands`.

Select required bot permissions (For now, select `Adminstrator` permission. Later on you can change permissions).

Copy the generated URL.

Paste the URL in your web browser to invite the bot to a server.
```

### Step 4: Set Up Your Project
```
Clone or download this repository.

Open a terminal and navigate to the project folder.

Run `npm i` to install dependencies.

Create a `data/config.json` file in the project root directory and add your bot tokens
```

## 💊 Documentation


- [Discord.js Documentation](https://discord.js.org/#/docs/main/stable/general/welcome)
- [Discord Developer Portal Documentation](https://discord.com/developers/docs/intro)


