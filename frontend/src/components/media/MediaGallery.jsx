import { useState } from 'react';
import { Box, Stack, CardMedia, Typography } from '@mui/material';

const MediaGallery = ({ media = [] }) => {
  // Filter items
  const images = media.filter((m) => m.media_type === 'image');
  const videos = media.filter((m) => m.media_type === 'video');

  const gallery = [...images, ...videos];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = gallery[activeIndex];

  return (
    <Box sx={{ width: '100%' }}>
      {/* MAIN DISPLAY */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 300, md: 450 },
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 3,
          mb: 2,
        }}
      >
        {activeItem?.media_type === 'image' && (
          <CardMedia
            component="img"
            src={activeItem.media_url}
            alt="product media"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}

        {activeItem?.media_type === 'video' && (
          <Box sx={{ width: '100%', height: '100%', background: '#000' }}>
            <video
              src={activeItem.media_url}
              controls
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        )}
      </Box>

      {/* THUMBNAIL STRIP */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          overflowX: 'auto',
          py: 1,
          px: 0.5,
        }}
      >
        {gallery.map((item, index) => (
          <Box
            key={item.media_id + index}
            onClick={() => setActiveIndex(index)}
            sx={{
              width: 80,
              height: 80,
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'pointer',
              border: activeIndex === index ? '2px solid #A3C4F3' : '2px solid transparent',
              transition: '0.2s',
              boxShadow: activeIndex === index ? 3 : 1,
              '&:hover': { boxShadow: 3 },
            }}
          >
            {item.media_type === 'image' ? (
              <CardMedia
                component="img"
                src={item.media_url}
                alt="thumb"
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                <video
                  src={item.media_url}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                />
                <Typography
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    left: 4,
                    color: '#fff',
                    fontSize: '0.7rem',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    px: 0.5,
                    borderRadius: 1,
                  }}
                >
                  Video
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default MediaGallery;
