import { DatabaseManager } from "./services/database";

DatabaseManager.getInstance().initialize().then(() => {
    console.log('Successfully connected!')
}).catch(err => {
    console.log(`Something went wrong ${err.message}`)
})


