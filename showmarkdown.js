import chalk from "chalk"
import { marked } from "marked"
import { markedTerminal } from "marked-terminal"

marked.use(
    markedTerminal({
        paragraph: chalk.green,
        codespan: chalk.greenBright.inverse,
        reflowText: true,
    })
)

let text = ""
process.stdin.setEncoding("utf8")
process.stdin.on("data", (chunk) => {
    text += chunk
})
process.stdin.on("end", () => {
    // remove trailing spaces from each line to prevent doubled spaces in reflowed text
    let lines = text.split("\n")
    text = lines.map((line) => line.replace(/\s+$/, "")).join("\n")

    let parsedText = marked.parse(text)
    parsedText = parsedText.replace(/\n+$/, "") // strip trailing newlines
    console.log(parsedText)
})
