import { createInterface } from "readline/promises"

async function askQuestion(question) {

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    })

    let answer = await rl.question(question)
    rl.close()
    return answer
}

export { askQuestion }