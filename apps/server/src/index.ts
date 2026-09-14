import 'dotenv/config';
import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 8787);
createApp().listen(port, () => {
  console.log(`@lg/server in ascolto su http://localhost:${port}`);
});
