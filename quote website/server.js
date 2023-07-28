const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


mongoose.connect('mongodb://localhost/quotesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database.');
});


const quoteSchema = new mongoose.Schema({
  text: String,
  author: String,
});

const Quote = mongoose.model('Quote', quoteSchema);

app.get('/api/quotes', (req, res) => {
  Quote.find({}, (err, quotes) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(quotes);
    }
  });
});

app.post('/api/quotes', (req, res) => {
  const newQuote = new Quote(req.body);
  newQuote.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save the quote' });
    } else {
      res.status(201).json({ message: 'Quote added successfully' });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
