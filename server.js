const express = require('express')
const app = express()
const port = 3000

const testRouter = express.Router();
const testInstanceRouter = express.Router();

testRouter.get('/:testId', (req, res, next) => {
    
})

app.use('/test', testRouter);
app.use('test-instance', testInstanceRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})