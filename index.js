const express = require('express');
const app = express();
const port = 3000;

// Add facilities route
app.use(require('./routes/facilities'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
