const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Log every request
app.use((req, res, next) => {
  res.on('finish', () => {
    const agent = (req.headers['user-agent'] || '').replace(/,/g, '');
    const time = new Date().toISOString();
    const method = req.method;
    const resource = req.url;
    const version = 'HTTP/' + req.httpVersion;
    const status = res.statusCode;

    const logLine = `${agent},${time},${method},${resource},${version},${status}\n`;

    console.log(logLine.trim());

    fs.appendFile(path.join(__dirname, '..', 'log.csv'), logLine, (err) => {
      if (err) console.error('Error writing to log:', err);
    });
  });

  next();
});

// GET /logs
app.get('/logs', (req, res) => {
  fs.readFile(path.join(__dirname, '..', 'log.csv'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Could not read log file' });
    }

    const lines = data.replace(/\r\n/g, '\n').trim().split('\n').filter(line => line.length > 0);
    const headers = lines[0].split(',');

    const logs = lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        Agent: values[0] || '',
        Time: values[1] || '',
        Method: values[2] || '',
        Resource: values[3] || '',
        Version: values[4] || '',
        Status: values[5] || ''
      };
    });

    res.json(logs);
  });
});

// Everything else returns "ok"
app.all('*', (req, res) => {
  res.status(200).send('ok');
});

module.exports = app;