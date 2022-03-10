global.__basePath   = process.cwd() + '/';
const app           = require(__basePath + 'app/app.js');
const config        = require(__basePath + 'app/config/index.js');
const PORT          = process.env.PORT;

app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`)
})