import { 
   createRequire 
}                       from 'module'
   const require        = createRequire(import.meta.url)


// // Vicky
// const name = prompt(`what's your first name?`)
// if ([`Vicky`, `vicky`].includes(name)) {
//    console.log("relatedwww")
//    return
// }

// Dima
const dictionary = require(`./dictionary/index.json`)
const randomPosition = Math.floor(dictionary.length * Math.random())
console.log(
   dictionary[randomPosition]
)