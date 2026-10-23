const Link = require('../models/Link');
const Click = require('../models/Click');
const { nanoid } = require('nanoid');
const { isValidUrl,getBrowser } = require('../utils/helpers');

async function getAllLinks(req, res) {
  const links = await Link.find().sort({ createdAt: -1 });
  res.json(links);
}
async function createLink(req, res) {
  const { originalUrl, expiresInDays } = req.body;
  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ error: 'Please provide a valid http/https URL' });
  }
  let expiresAt = null;
  if (expiresInDays !== undefined) {
    const days = Number(expiresInDays);
    if (!Number.isFinite(days) || days <= 0) {
      return res.status(400).json({ error: 'expiresInDays must be a positive number' });
    }
    expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const link = await Link.create({ originalUrl, shortCode: nanoid(7), expiresAt });
      return res.status(201).json(link);
    } catch (err) {
      if (err.code !== 11000) {
        return res.status(500).json({ error: 'Server error' });
      }
    }
  }
  res.status(500).json({ error: 'Could not generate a unique code' });
}
async function getStats(req, res) {
  const link = await Link.findOne({ shortCode: req.params.shortCode });
  if (!link) {
    return res.status(404).json({ error: 'Short link not found' });
  }
  const recentClicks = await Click.find({ linkId: link._id }).sort({ timestamp: -1 }).limit(10);
  const browsers = await Click.aggregate([
    { $match: { linkId: link._id } },
    { $group: { _id: '$browser', count: { $sum: 1 } } },
  ]);
  res.json({ link, recentClicks, browsers });
}
async function deleteLink(req, res) {
  const link = await Link.findByIdAndDelete(req.params.id);
  if (!link) {
    return res.status(404).json({ error: 'Short link not found' });
  }
  await Click.deleteMany({ linkId: link._id });
  res.json({ message: 'Link deleted' });
}
async function redirectToOriginal(req, res) {
  const link = await Link.findOne({ shortCode: req.params.shortCode });
  if (!link) {
    return res.status(404).json({ error: 'Short link not found' });
  }
  if (link.expiresAt && link.expiresAt < new Date()) {
    return res.status(410).json({ error: 'This link has expired' });
  }
  await Click.create({
    linkId: link._id,
    userAgent: req.get('user-agent') || 'unknown',
    browser: getBrowser(req.get('user-agent')),
    referrer: req.get('referer') || 'direct',
  });
  await Link.updateOne({ _id: link._id }, { $inc: { clickCount: 1 } });
  res.redirect(link.originalUrl);
}
async function getLinkByCode(req, res) {
  const link = await Link.findOne({ shortCode: req.params.shortCode });
  if (!link) {
    return res.status(404).json({ error: 'Short link not found' });
  }
  res.json(link);
}
module.exports = { getAllLinks, createLink, getStats, deleteLink, redirectToOriginal, getLinkByCode };