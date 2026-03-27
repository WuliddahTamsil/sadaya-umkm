import {
  getCommentsByContentId,
  createComment,
  deleteComment
} from '../models/commentModel.js';

export const getCommentsController = async (req, res) => {
  try {
    const { contentId } = req.params;
    const comments = await getCommentsByContentId(contentId);
    res.json({ success: true, data: comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil komentar' });
  }
};

export const createCommentController = async (req, res) => {
  try {
    const { contentId, userId, userName, userEmail, userRole, text } = req.body;
    
    console.log('Create comment request:', { contentId, userId, userName, userRole, textLength: text?.length });
    
    if (!contentId || !userId || !text) {
      console.error('Missing required fields:', { contentId: !!contentId, userId: !!userId, text: !!text });
      return res.status(400).json({ error: 'Content ID, User ID, dan text wajib diisi' });
    }
    
    if (!text.trim()) {
      return res.status(400).json({ error: 'Text komentar tidak boleh kosong' });
    }
    
    const comment = await createComment({
      contentId,
      userId,
      userName: userName || 'Anonymous',
      userEmail: userEmail || '',
      userRole: userRole || 'user',
      text: text.trim()
    });
    
    console.log('Comment created successfully:', comment.id);
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error('Create comment error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Terjadi kesalahan saat membuat komentar',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteCommentController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteComment(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Komentar tidak ditemukan' });
    }
    
    res.json({ success: true, message: 'Komentar berhasil dihapus' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus komentar' });
  }
};

