import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  CloudUpload,
  Image as ImageIcon,
  VideoLibrary,
  InsertDriveFile,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import MediaPreviewModal from './MediaPreviewModal';
import { deleteMedia } from '../../redux/media/mediaThunk';
import { toast } from 'react-toastify';

const ExistingMediaModal = ({ open, onClose, media = [], onMediaDeleted }) => {
  const dispatch = useDispatch();
  const [previewMedia, setPreviewMedia] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this media?')) {
      return;
    }

    console.log('Starting delete for media ID:', mediaId); // Debug log
    setDeletingId(mediaId);

    try {
      const result = await dispatch(deleteMedia(mediaId)).unwrap();
      console.log('Delete successful:', result); // Debug log

      toast.success('Media deleted successfully!');

      // Notify parent component about deletion
      if (onMediaDeleted) {
        onMediaDeleted(mediaId);
      }
    } catch (error) {
      console.error('Error deleting media:', error); // Debug log
      toast.error(typeof error === 'string' ? error : 'Failed to delete media');
    } finally {
      setDeletingId(null);
    }
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image':
        return <ImageIcon />;
      case 'video':
        return <VideoLibrary />;
      default:
        return <InsertDriveFile />;
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CloudUpload sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Existing Media ({media.length})
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {media.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <InsertDriveFile sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography color="text.secondary">No existing media found.</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {media.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.media_id}>
                  <Paper
                    elevation={2}
                    sx={{
                      position: 'relative',
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: 'transform 0.2s',
                      opacity: deletingId === item.media_id ? 0.5 : 1,
                      pointerEvents: deletingId === item.media_id ? 'none' : 'auto',
                      '&:hover': {
                        transform: deletingId === item.media_id ? 'none' : 'scale(1.02)',
                        boxShadow: deletingId === item.media_id ? 2 : 4,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: 180,
                        backgroundColor: 'background.default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {item.media_type === 'image' && (
                        <Box
                          component="img"
                          src={item.media_url}
                          alt="Media"
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      )}

                      {item.media_type === 'video' && (
                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                          <Box
                            component="video"
                            src={item.media_url}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <VideoLibrary
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              fontSize: 48,
                              color: 'rgba(255,255,255,0.8)',
                            }}
                          />
                        </Box>
                      )}

                      {item.media_type === 'file' && (
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <InsertDriveFile sx={{ fontSize: 60, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ display: 'block', mt: 1 }} noWrap>
                            {item.media_url.split('/').pop().substring(0, 20)}...
                          </Typography>
                        </Box>
                      )}

                      {/* Loading Spinner Overlay */}
                      {deletingId === item.media_id && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 10,
                          }}
                        >
                          <Box sx={{ textAlign: 'center' }}>
                            <CircularProgress size={40} sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', mt: 1, fontSize: '0.875rem' }}>
                              Deleting...
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          display: 'flex',
                          gap: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => setPreviewMedia(item)}
                          disabled={deletingId === item.media_id}
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            '&:hover': { backgroundColor: 'white' },
                            '&:disabled': {
                              backgroundColor: 'rgba(255,255,255,0.5)',
                              cursor: 'not-allowed',
                            },
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(item.media_id)}
                          disabled={deletingId === item.media_id}
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: 'white',
                              color: 'error.dark',
                            },
                            '&:disabled': {
                              backgroundColor: 'rgba(255,255,255,0.5)',
                              cursor: 'not-allowed',
                            },
                          }}
                        >
                          {deletingId === item.media_id ? (
                            <CircularProgress size={16} color="error" />
                          ) : (
                            <Delete fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ p: 1.5 }}>
                      <Chip
                        icon={getMediaIcon(item.media_type)}
                        label={item.media_type}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                      {item.is_primary === 1 && (
                        <Chip label="Primary" size="small" color="primary" sx={{ ml: 0.5 }} />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
          <Button onClick={onClose} variant="contained" disabled={!!deletingId}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <MediaPreviewModal
        open={!!previewMedia}
        onClose={() => setPreviewMedia(null)}
        media={previewMedia}
      />
    </>
  );
};

export default ExistingMediaModal;
