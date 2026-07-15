import chalk from "chalk"
import { writeFile } from "node:fs/promises"
import { parseArgs } from "node:util"
import { marked } from "marked"
import { markedTerminal } from "marked-terminal"

marked.use(
    markedTerminal({
        paragraph: chalk.green,
        codespan: chalk.greenBright.inverse,
        reflowText: true,
    })
)

const { values } = parseArgs({
    options: {
        output: {
            type: "string",
            short: "o",
        },
    },
})

const outputPath = values.output

let text = ""
process.stdin.setEncoding("utf8")
process.stdin.on("data", (chunk) => {
    text += chunk
})
process.stdin.on("end", async () => {
    // remove trailing spaces from each line to prevent doubled spaces in reflowed text
    let lines = text.split("\n")
    text = lines.map((line) => line.replace(/\s+$/, "")).join("\n")

    let parsedText = marked.parse(text)
    parsedText = parsedText.replace(/\n+$/, "") // strip trailing newlines
    if (outputPath) {
        await writeFile(outputPath, parsedText + "\n", "utf8")
    } else {
        console.log(parsedText)
    }
})
