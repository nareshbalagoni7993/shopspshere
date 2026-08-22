export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }
  res.status(201).json({
    success: true,
    url: `/uploads/${req.file.filename}`
  });
};
