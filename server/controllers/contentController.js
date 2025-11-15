import {
  getAllContents,
  getPublishedContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  incrementViews
} from '../models/contentModel.js';

// Get all contents (admin only - includes drafts)
export const getAllContentsController = async (req, res) => {
  try {
    const contents = await getAllContents();
    res.json({ success: true, data: contents });
  } catch (error) {
    console.error('Get all contents error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil konten' });
  }
};

// Get published contents only (for all users)
export const getPublishedContentsController = async (req, res) => {
  try {
    const contents = await getPublishedContents();
    // Sort by date (newest first)
    contents.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    res.json({ success: true, data: contents });
  } catch (error) {
    console.error('Get published contents error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil konten' });
  }
};

// Get content by ID
export const getContentByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await getContentById(id);
    
    if (!content) {
      return res.status(404).json({ error: 'Konten tidak ditemukan' });
    }
    
    // Increment views if published
    if (content.status === 'published') {
      await incrementViews(id);
      content.views = (content.views || 0) + 1;
    }
    
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Get content by ID error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil konten' });
  }
};

// Create new content (admin only)
export const createContentController = async (req, res) => {
  try {
    const contentData = req.body;
    
    // Validate required fields
    if (!contentData.title || !contentData.type) {
      return res.status(400).json({ error: 'Judul dan tipe konten wajib diisi' });
    }
    
    const newContent = await createContent(contentData);
    res.status(201).json({ success: true, data: newContent });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat konten' });
  }
};

// Update content (admin only)
export const updateContentController = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedContent = await updateContent(id, updates);
    
    if (!updatedContent) {
      return res.status(404).json({ error: 'Konten tidak ditemukan' });
    }
    
    res.json({ success: true, data: updatedContent });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui konten' });
  }
};

// Delete content (admin only)
export const deleteContentController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteContent(id);
    res.json({ success: true, message: 'Konten berhasil dihapus' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus konten' });
  }
};

