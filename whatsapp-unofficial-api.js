const puppeteer = require("puppeteer");
const JSSoup = require("jssoup").default;
const qrcode = require("qrcode-terminal");
const colors = require("colors");

class whatsappUnofficialApi {
  async services(save, headdless) {
    const args = [
      '--disable-dev-shm-usage',
        '--enable-sync', '--enable-background-networking', '--no-sandbox', '--disable-setuid-sandbox',
        '--disable-gpu', '--renderer', '--no-service-autorun', '--no-experiments',
        '--no-default-browser-check', '--disable-webgl', '--disable-threaded-animation',
        '--disable-threaded-scrolling', '--disable-in-process-stack-traces', '--disable-histogram-customizer',
        '--disable-gl-extensions', '--disable-extensions', '--disable-composited-antialiasing',
        '--disable-canvas-aa', '--disable-3d-apis', '--disable-accelerated-2d-canvas',
        '--disable-accelerated-jpeg-decoding', '--disable-accelerated-mjpeg-decode', '--disable-app-list-dismiss-on-blur',
        '--disable-accelerated-video-decode', '--mute-audio',
        '--log-level=3',
        '--disable-infobars',
        '--disable-web-security',
        '--disable-site-isolation-trials',
        '--ignore-gpu-blacklist',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
        '--disable-default-apps',
        '--enable-features=NetworkService',
        '--no-first-run',
        '--no-zygote',
        '--unlimited-storage'
    ];
    if (save === true) {
      global.browser = await puppeteer.launch({
        headless: headdless,
        userDataDir: "session",
        args: args,
        ignoreHTTPSErrors: true,
        defaultViewport: null,
      });
    } else if (save === false) {
      global.browser = await puppeteer.launch({
        headless: headdless,
        args: args,
        ignoreHTTPSErrors: true,
        defaultViewport: null,
      });
    }
    global.page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
    );
    global.selectors = [
      "/html/body/div/div[1]/div/div[2]/div[1]/div/div[3]/label/input",
      "/html/body/div/div[1]/div/div[2]/div[1]/div/div[2]/div/canvas",
      "/html/body/div/div[1]/div[1]/div[3]/div/header/div[1]/div/img",
      "/html/body/div/div[1]/div[1]/div[3]/div/header/div[1]/div/img",
      "#side > div.uwk68 > div > label > div > div._13NKt.copyable-text.selectable-text",
      "/html/body/div[1]/div[1]/div[1]/div[3]/div/div[1]/div/label/div/div[2]",
      "/html/body/div[1]/div[1]/div[1]/div[4]/div[1]/footer/div[1]/div/div/div[2]/div[1]/div/div[2]",
      "#main > footer > div._2BU3P.tm2tP.copyable-area > div._1SEwr > div > div.p3_M1 > div > div._13NKt.copyable-text.selectable-text",
      "/html/body/div/div[1]/div[1]/div[4]/div[1]/footer/div[1]/div[2]/div/div[2]/button",
      "/html/body/div/div[1]/div[1]/div[3]/div/header/div[2]/div/span/div[3]/div",
      "/html/body/div/div[1]/div[1]/div[3]/div/header/div[2]/div/span/div[3]/span/div[1]/ul/li[6]/div[1]",
      "/html/body/div/div[1]/div[1]/div[3]/div/header/div[2]/div/span/div[3]/span/div[1]/ul/li[1]/div[1]",
      "#main > footer > div._2BU3P.tm2tP.copyable-area > div > div > div._2lMWa > div.p3_M1 > div > div._13NKt.copyable-text.selectable-text",
    ];
  }

  async login(keep, page = global.page) {
    await page.goto("https://web.whatsapp.com/");
    await page.waitForXPath(selectors[0], 60 * 1000);
    await page.waitForXPath(selectors[1], 60 * 1000);
    if (keep === false) {
      const elements = await page.$x(selectors[0]);
      await elements[0].click();
    }
    await this.PromiseTimeout(500);
    console.log("Qr Code Loaded!".magenta);
    global.qr = new JSSoup(
      await page.evaluate(() => document.querySelector("*").outerHTML)
    ).findAll("div", { class: "_2UwZ_" })[0]["attrs"]["data-ref"];
    for (const letter of "Qr Code Now Creating") {
      await this.PromiseTimeout(25);
      process.stdout.write(letter.yellow);
    }
    console.log("\nPlease Open Whatsapp And Scan This Qr Code".cyan);
    await qrcode.generate(qr, { small: true });
    await this.QrDetection();
  }

  async QrDetection(page = global.page, qr = global.qr) {
    await (async () => {
      while (await true) {
        this.PromiseTimeout(500);
        try {
          var newqr = new JSSoup(
            await page.evaluate(() => document.querySelector("*").outerHTML)
          ).findAll("div", { class: "_2UwZ_" })[0]["attrs"]["data-ref"];
        } catch (error) {
          let err = error.toString();
          if (err.indexOf("Cannot read property 'attrs' of undefined") !== -1) {
            console.log("Succes Logined".yellow);
            break;
          } else return console.log(error);
        }
        if (qr !== newqr) {
          try {
            await qrcode.generate(newqr, { small: true });
          } catch (error) {
            let err = error.toString();
            if (err.indexOf("length") !== -1) {
            } else {
              console.log("Succes Logined".yellow);
              break;
            }
          }
          qr = newqr;
        } else {
          try {
            await page.waitForXPath(selectors[2], { timeout: 100 });
            console.log("Succes Logined".yellow);
            break;
          } catch (error) {
            this.PromiseTimeout(100);
          }
        }
      }
    })();
  }

  async savedlogin(page = global.page) {
    await page.goto("https://web.whatsapp.com/");
    for (const letter of "Logining To Whatsapp Using Saved User Dir") {
      await this.PromiseTimeout(25);
      process.stdout.write(letter.magenta);
    }
    await page.waitForXPath(selectors[3], 60 * 1000);
    console.log("\nSucces Logined".green);
  }

  async send_text(user, message, range, page = global.page) {
    await page.waitForXPath(selectors[5], 60 * 1000);
    const element_0 = await page.$x(selectors[5]);
    await element_0[0].click();
    for (const letter of user) {
      await page.keyboard.press(letter);
    }
    await page.keyboard.press("Enter");
    await page.waitForXPath(selectors[6], 60 * 1000);
    const element_1 = await page.$x(selectors[6]);
    await element_1[0].click();
    for (const letter of "Messages Now Sending...") {
      await this.PromiseTimeout(25);
      process.stdout.write(letter.yellow);
    }
    for (let i = 0; i < range; i++) {
      await page.evaluate(
        (s, m) => {
          let dom = document.querySelector(s);
          dom.innerHTML = m.slice(1);
        },
        selectors[12],
        message
      );
      await page.keyboard.type(message.substring(0, 1));
      await page.keyboard.press("Enter");
      //const element_2 = await page.$x(selectors[8])
      //await element_2[0].click()
    }
    console.log("\nMessages Sent Succes to ".green + user.green);
  }

  PromiseTimeout(delayms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, delayms);
    });
  }

  async Exit(delay, waexit, browser = global.browser, page = global.page) {
    if (waexit === true) {
      await page.waitForXPath(selectors[9], 60 * 1000);
      const element_0 = await page.$x(selectors[9]);
      await element_0[0].click();
      await this.PromiseTimeout(1000);
      await page.waitForXPath(selectors[10], 60 * 1000);
      const element_1 = await page.$x(selectors[10]);
      await element_1[0].click();
      await this.PromiseTimeout(1000);
    }
    await this.PromiseTimeout(delay);
    await page.close();
    await browser.close();
    console.log("Exited".magenta);
  }
  // this function is the beta
  async getfriendslist(range, page = global.page) {
    global.friends = [];
    for (let i = 0; i < range; i++) {
      try {
        let [element] = await page.$x(
          "/html/body/div/div[1]/div[1]/div[3]/div/div[2]/div[1]/div/div/div[" +
            i +
            "]/div/div/div[2]/div[1]/div[1]/span/span"
        );
        let name = await page.evaluate(
          (element) => element.textContent,
          element
        );
        global.friends.push(name);
      } catch (err) {
        // Dont make anything ...
      }
    }
    console.log(global.friends);
  }
}

exports.whatsappUnofficialApi = whatsappUnofficialApi;
