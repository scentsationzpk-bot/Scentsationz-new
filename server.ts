import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for email capture
  app.post('/api/capture-email', async (req, res) => {
    const { email, source } = req.body;

    console.log(`Email captured: ${email} from ${source}`);

    try {
      // Configure your SMTP transporter here
      // For now, we'll use a mock approach or log it clearly
      // To send real emails, the user needs to provide SMTP credentials
      
      // Example configuration (commented out):
      /*
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: '"Scentsationz Store" <noreply@scentsationz.com>',
        to: 'scentsationz.pk@gmail.com',
        subject: 'New Email Captured!',
        text: `New email captured: ${email}\nSource: ${source}`,
        html: `<p>New email captured: <strong>${email}</strong></p><p>Source: ${source}</p>`
      });
      */

      console.log(`Notification would be sent to scentsationz.pk@gmail.com for ${email}`);
      
      res.status(200).json({ success: true, message: 'Email captured and notification processed' });
    } catch (error) {
      console.error('Failed to send email notification:', error);
      res.status(500).json({ success: false, error: 'Failed to process notification' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
