import { createInterface } from "readline/promises"

async function askQuestion(question) {

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    })

    let name = await rl.question(question)
    rl.close()
    return name
}

export { askQuestion }