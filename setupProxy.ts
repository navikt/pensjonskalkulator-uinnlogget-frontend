import { createProxyMiddleware } from 'http-proxy-middleware';
import { NextApiRequest, NextApiResponse } from 'next';

const setupProxy = (req: NextApiRequest, res: NextApiResponse) => {
  const proxy = createProxyMiddleware({
    target: 'https://pensjonskalkulator-backend.intern.dev.nav.no',
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/alderspensjon/anonym-simulering': '/api/v1/alderspensjon/anonym-simulering',
    },
  });

  return proxy(req, res, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Proxy error');
    }
  });
};

export default setupProxy;