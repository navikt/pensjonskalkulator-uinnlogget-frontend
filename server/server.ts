import express from 'express'
import next from 'next'

import { stengForReguleringMiddleware } from '@navikt/steng-for-regulering/express'

const isDev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 8080
const app = next({ dev: isDev })
const handle = app.getRequestHandler()
const server = express()

app
  .prepare()
  .then(() => {
    server.use(stengForReguleringMiddleware({ env: isDev ? 'dev' : 'prod' }))
    server.all(/(.*)/, (req, res) => {
      return handle(req, res)
    })

    server.listen(PORT, () => {
      console.log(`Server ready on port ${PORT}`)
    })
  })
  .catch((exception) => {
    console.error(exception.stack)
    process.exit(1)
  })
