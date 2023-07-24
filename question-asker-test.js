import { askQuestion } from "./question-asker.js"

let answer = await askQuestion("What is your name? ")

console.log(`Hello ${answer}!`)