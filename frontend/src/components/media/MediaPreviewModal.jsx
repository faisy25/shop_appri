import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import { Close, Image as ImageIcon, VideoLibrary, InsertDriveFile } from '@mui/icons-material';

const MediaPreviewModal = ({ open, onClose, media }) => {
  if (!media) return null;

  const isImage = media.media_type === 'image';
  const isVideo = media.media_type === 'video';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
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
          {isImage && <ImageIcon sx={{ mr: 1, color: 'primary.main' }} />}
          {isVideo && <VideoLibrary sx={{ mr: 1, color: 'secondary.main' }} />}
          {!isImage && !isVideo && <InsertDriveFile sx={{ mr: 1 }} />}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Media Preview
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: 'background.default' }}>
        <Box
          sx={{
            minHeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          {isImage && (
            <Box
              component="img"
              src={media.media_url}
              sx={{
                maxWidth: '100%',
                maxHeight: '70vh',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          )}

          {isVideo && (
            <Box
              component="video"
              src={media.media_url}
              controls
              autoPlay
              sx={{
                maxWidth: '100%',
                maxHeight: '70vh',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          )}

          {!isImage && !isVideo && (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <InsertDriveFile sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                File Preview Not Available
              </Typography>
              <Button
                variant="contained"
                href={media.media_url}
                target="_blank"
                rel="noreferrer"
                sx={{ mt: 2 }}
              >
                Download File
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewModal;
