const handleImageUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: true, message: 'No image file uploaded.' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.send({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
};

module.exports = { handleImageUpload };
