# Simple Whatsapp Message Api (BETA)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This API is working with using the Web Driver [Puppeteer](https://github.com/puppeteer/puppeteer). You can send message and get your contact list on Whatsapp using this api. Note; That this project is in Beta, More API functions will be added in the future.  

## Install Requirements
Before use the api you need to install the requirements:
```bash
npm install puppeteer jssoup qrcode-terminal colors
```

## Example Usage
```javascript
const { whatsappUnofficialApi } = require("./whatsapp-unofficial-api");

(async () => {
    const client = new whatsappUnofficialApi()
    await client.services(false,true)
    await client.login(false)
    await client.send_text(user='username or phone',message='test message',range=1)
    //Examples; Username:Ebeveyn A, Phone:+905555555555
    await client.Exit(0,true)
}) ();
```
Result:

<img alt="screenshot" src="![screenshot_0](https://user-images.githubusercontent.com/91368666/134770568-702edb66-233a-479f-a595-1c80f19635a5.PNG)">
