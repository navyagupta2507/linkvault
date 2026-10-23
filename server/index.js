require('dotenv').config();
const express=require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const linkRoutes = require('./routes/linkRoutes');
const redirectRoutes = require('./routes/redirectRoutes');

const app=express();
const PORT  =process.env.PORT||5000;

app.use(cors());
app.use(express.json());

app.get ('/api/health', async (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/links', linkRoutes); 
app.use('/', redirectRoutes);

app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  res.status(500).json({ error: 'Something went wrong' });
});

 mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err.message));
  
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});