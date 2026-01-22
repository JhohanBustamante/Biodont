require('dotenv').config();
const app = require('./app');

const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Server funcionando V1, a través del puerto ${PORT}`);
})