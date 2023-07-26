const puppeteer = require("puppeteer");
const player = require("play-sound")((opts = {}));
const sound = require("sound-play");
const path = require("path");
const sound1 = path.join(__dirname, "./assets/sounds/sound1.mp3");
const bellSound = path.join(__dirname, "./assets/sounds/bell.mp3");
const clickSound = path.join(__dirname, "./assets/sounds/click.mp3");
const interfaceSound = path.join(__dirname, "./assets/sounds/interface.mp3");
const decideSound = path.join(__dirname, "./assets/sounds/decide.mp3");

const subjects = [
    { subjectName: "ARTIFICIAL", section: "A" },
    { subjectName: "SOFTWARE ENGINEERING", section: "E" },
    { subjectName: "COMPILER DESIGN", section: "A" },
    { subjectName: "ELECTRONIC DEVICES LAB", section: "A" },
    { subjectName: "SIGNAL & LINEAR SYSTEM", section: "B" },
];

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
const login = async (page) => {
    try {
        await page.type("#username", "21-45143-2");
        await page.type("#password", "69634880");
        const loginButton = await page.$x(
            `//button[contains(text(), "Log In")]`
        );

        await loginButton[0].click();

        await page.waitForNavigation({
            timeout: 120000,
            waitUntil: ["domcontentloaded"],
        });

        await sound.play(decideSound);
        return await 0;
    } catch (error) {
        console.log(error);
    }
};
const TryUntilNextButton = async (page) => {
    try {
        let loaded = false;
        while (!loaded) {
            let nextButtonExist = await page.evaluate(() =>
                [...document.querySelectorAll("a.btn")].find((a) =>
                    a.innerText.includes("Next")
                )
            );
            let nextButton = await page.evaluateHandle(() =>
                [...document.querySelectorAll("a.btn")].find((a) =>
                    a.innerText.includes("Next")
                )
            );
            let cancelButtonExist = await page.evaluate(() =>
                [...document.querySelectorAll("a.btn")].find((a) =>
                    a.innerText.includes("Cancel")
                )
            );
            let cancelButton = await page.evaluateHandle(() =>
                [...document.querySelectorAll("a.btn")].find((a) =>
                    a.innerText.includes("Cancel")
                )
            );

            console.log(nextButton);
            console.log(cancelButton);
            if (nextButtonExist) {
                await nextButton.click();
                loaded = true;
                return true;
            }
            if (!nextButtonExist && cancelButtonExist) {
                await cancelButton.click();
            }
            await page.waitForNavigation({
                timeout: 120000,
                waitUntil: ["domcontentloaded"],
            });
            await timeout(10000);
            if (!loaded) {
                let gotoRegistrationButton = await page.evaluateHandle(() =>
                    [...document.querySelectorAll("a.btn")].find((a) =>
                        a.innerText.includes("Go to Registration")
                    )
                );
                if (gotoRegistrationButton) {
                    await gotoRegistrationButton.click();
                }
                await page.waitForNavigation({
                    timeout: 120000,
                    waitUntil: ["domcontentloaded"],
                });
            }
        }
        await sound.play(sound1);
        return await loaded;
    } catch (error) {
        console.log(error);
    }
};

const selectCourses = async (page) => {
    await page.evaluate(() => {
        subjects.forEach(async (subject, index) => {
            try {
                let labelNode = document.querySelectorAll(`label`);
                let itemIndex = [...a].findIndex((a) =>
                    a.innerText.includes(subject.subjectName)
                );

                let tableContainer =
                    labelNode[itemIndex].nextElementSibling.nextElementSibling;
                let d = [...tableContainer.childNodes[1].childNodes];
                let e = [...d].findIndex((d) =>
                    [...d.childNodes].find(
                        (e) =>
                            e.innerText && e.innerText.includes(subject.section)
                    )
                );
                let f = d[e].querySelector("input");
                try {
                    setTimeout(() => {
                        f.click();
                        sound.play(clickSound);
                    }, 3000 * index);
                } catch (error) {}
                f.checked = true;
            } catch (error) {}
        });

        return true;
    });
    await sound.play(bellSound);
};

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 780 });
    try {
        await page.goto("https://portal.aiub.edu/", {
            waitUntil: "networkidle0",
        });

        // await login(page);
        // await TryUntilNextButton(page);
        // await selectCourses(page);
        // console.log("OK");

        await page.screenshot({
            path: "screenshot.jpg",
        });
    } catch (error) {
        console.log(error);
    }
})();
