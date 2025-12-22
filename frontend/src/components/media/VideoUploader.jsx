import { Button } from '@mui/material';

const VideoUploader = ({ onFilesSelect }) => {
  return (
    <Button variant="outlined" component="label" size="small">
      Videos
      <input
        type="file"
        hidden
        accept="video/*"
        multiple
        onChange={(e) => onFilesSelect(Array.from(e.target.files))}
      />
    </Button>
  );
};

export default VideoUploader;
