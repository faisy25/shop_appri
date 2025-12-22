import { Button } from '@mui/material';

const ImageUploader = ({ onFilesSelect }) => {
  return (
    <Button variant="outlined" component="label" size="small">
      Images
      <input
        type="file"
        hidden
        accept="image/*"
        multiple
        onChange={(e) => onFilesSelect(Array.from(e.target.files))}
      />
    </Button>
  );
};

export default ImageUploader;
