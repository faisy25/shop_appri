import redoc from 'redoc-express';
import { swaggerSpecs } from './swagger.js';

export const redocRouter = (app) => {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Serve OpenAPI JSON specification
  app.get('/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache'); // Don't cache in development
    res.send(swaggerSpecs);
  });

  // Serve ReDoc documentation UI
  app.get(
    '/docs',
    redoc({
      title: 'Shop API Documentation',
      specUrl: '/docs/swagger.json',
      redocOptions: {
        theme: {
          colors: {
            primary: {
              main: '#3b82f6', // Blue
            },
          },
          typography: {
            fontSize: '15px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          sidebar: {
            backgroundColor: '#fafafa',
            textColor: '#333',
          },
        },
        hideDownloadButton: false,
        disableSearch: false,
        expandResponses: '200,201',
        jsonSampleExpandLevel: 2,
        sortPropsAlphabetically: true,
      },
    }),
  );

  // console.log('📚 Documentation available at:');
  // console.log('   📖 ReDoc UI: http://localhost:8000/docs');
  // console.log('   📄 OpenAPI JSON: http://localhost:8000/docs/swagger.json');
  // console.log('   💚 Health Check: http://localhost:8000/api/health');
};
