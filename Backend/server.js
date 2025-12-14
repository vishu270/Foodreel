// start server
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// prefer src/.env if present, otherwise fallback to project root .env
const envInSrc = path.resolve(__dirname, 'src', '.env');
const envRoot = path.resolve(__dirname, '.env');
if (fs.existsSync(envInSrc)) {
    dotenv.config({ path: envInSrc });
    console.log(`[dotenv] loaded ${envInSrc}`);
} else if (fs.existsSync(envRoot)) {
    dotenv.config({ path: envRoot });
    console.log(`[dotenv] loaded ${envRoot}`);
} else {
    // load default (will look for .env in cwd)
    dotenv.config();
    console.log('[dotenv] loaded default .env (if present)');
}

const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
