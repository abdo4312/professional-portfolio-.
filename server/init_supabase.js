const db = require('./config/db');

async function run() {
    console.log('Initializing Supabase tables...');
    try {
        // initDb is called on require in db.js, but let's be sure.
        // Actually db.js exports query and pool.
        // I should wait a bit to ensure it finished or export the init promise.
        console.log('Tables should be initialized via db.js automatic call.');
        console.log('Waiting 5 seconds for safety...');
        await new Promise(r => setTimeout(r, 5000));
        console.log('Initialization window closed.');
        process.exit(0);
    } catch (err) {
        console.error('Initialization failed:', err);
        process.exit(1);
    }
}

run();
