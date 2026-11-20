require('dotenv').config();

const app = require('./src/interface/app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`HABITARA API running on port ${PORT}`);
});
