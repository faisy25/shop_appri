import { Box, Typography, Button, IconButton, Chip, Alert, Paper } from '@mui/material';
import {
  CloudUpload,
  Image as ImageIcon,
  VideoLibrary,
  InsertDriveFile,
  Delete,
} from '@mui/icons-material';
import { useState } from 'react';
import ExistingMediaModal from './ExistingMediaModal';
const MediaUploader = ({
  files,
  setFiles,
  existingMedia = [],
  onMediaDeleted, // ← Make sure this is passed through
  allowedTypes = ['image', 'video', 'file'],
  limits = { image: 5, video: 2, file: 5 },
}) => {
  const [openExisting, setOpenExisting] = useState(false);
  const [error, setError] = useState('');

  const handleAddFiles = (newFiles, type) => {
    setError('');

    const currentCount = files ? files.filter((f) => f.type === type).length : 0;
    const limit = limits[type] || 5;

    if (currentCount + newFiles.length > limit) {
      setError(`Maximum ${limit} ${type}(s) allowed`);
      return;
    }

    const filesWithType = newFiles.map((file) => ({
      file,
      type,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      preview: type === 'image' ? URL.createObjectURL(file) : null,
    }));

    setFiles((prev) => [...(prev || []), ...filesWithType]);
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getFileCount = (type) => {
    return files ? files.filter((f) => f.type === type).length : 0;
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          border: '2px dashed',
          borderColor: 'primary.main',
          borderRadius: 2,
          backgroundColor: 'rgba(163, 196, 243, 0.05)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CloudUpload sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Upload Media
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
          {allowedTypes.includes('image') && (
            <Button
              variant="outlined"
              component="label"
              size="small"
              startIcon={<ImageIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                borderColor: 'primary.main',
                color: 'primary.main',
              }}
            >
              Images ({getFileCount('image')}/{limits.image})
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) => handleAddFiles(Array.from(e.target.files), 'image')}
              />
            </Button>
          )}

          {allowedTypes.includes('video') && (
            <Button
              variant="outlined"
              component="label"
              size="small"
              startIcon={<VideoLibrary />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                borderColor: 'secondary.main',
                color: 'secondary.main',
              }}
            >
              Videos ({getFileCount('video')}/{limits.video})
              <input
                type="file"
                hidden
                accept="video/*"
                multiple
                onChange={(e) => handleAddFiles(Array.from(e.target.files), 'video')}
              />
            </Button>
          )}

          {allowedTypes.includes('file') && (
            <Button
              variant="outlined"
              component="label"
              size="small"
              startIcon={<InsertDriveFile />}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Files ({getFileCount('file')}/{limits.file})
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx,.xlsx,.xls,.zip,.rar,.txt"
                multiple
                onChange={(e) => handleAddFiles(Array.from(e.target.files), 'file')}
              />
            </Button>
          )}
        </Box>

        {/* Selected Files List */}
        {files && files.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
              Selected Files ({files.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {files.map((fileObj) => (
                <Box
                  key={fileObj.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {fileObj.type === 'image' && fileObj.preview && (
                    <Box
                      component="img"
                      src={fileObj.preview}
                      sx={{
                        width: 40,
                        height: 40,
                        objectFit: 'cover',
                        borderRadius: 1,
                        mr: 1.5,
                      }}
                    />
                  )}
                  {fileObj.type === 'video' && (
                    <VideoLibrary sx={{ mr: 1.5, color: 'secondary.main' }} />
                  )}
                  {fileObj.type === 'file' && <InsertDriveFile sx={{ mr: 1.5 }} />}

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                      {fileObj.name}
                    </Typography>
                    <Chip
                      label={fileObj.type}
                      size="small"
                      sx={{ height: 18, fontSize: '0.65rem', mt: 0.5 }}
                    />
                  </Box>

                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(fileObj.id)}
                    sx={{ ml: 1, color: 'error.main' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {existingMedia.length > 0 && (
          <Button
            variant="text"
            size="small"
            onClick={() => setOpenExisting(true)}
            sx={{ mt: 2, textTransform: 'none' }}
          >
            View Existing Media ({existingMedia.length})
          </Button>
        )}
      </Paper>

      <ExistingMediaModal
        open={openExisting}
        onClose={() => setOpenExisting(false)}
        media={existingMedia}
        onMediaDeleted={onMediaDeleted} // ← Pass it through here
      />
    </Box>
  );
};

export default MediaUploader;
