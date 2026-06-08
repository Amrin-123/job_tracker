console.log("🔥 server.js is executing...");

require("dotenv").config();

const app = require("./app");
require("./config/db"); // 👈 THIS LINE IS IMPORTANT

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});