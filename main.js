const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    res.send({name: 'zt'})
});

app.listen(3000, () => {
    console.log('启动成功')
});