import { fork } from 'child_process'
import chalk from 'chalk'
import path from 'path'
import {
    fileURLToPath
} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function start() {
    let p = fork(path.join(__dirname, "function/@sockets/main.js"));

    p.on("message", message => {
        if (message === "reset") {
            console.log(`${chalk.bgYellow("[SYSTEM]")} -> Restarting bot...`)
            p.kill();
            start();
        }
    });

    p.on("exit", code => {
        console.log(`${chalk.bgRed("[SYSTEM]")} -> Bot exited with code: ${chalk.red(code)}`)
        if (code == 0 || code == 1) start()
    });
}

start();
