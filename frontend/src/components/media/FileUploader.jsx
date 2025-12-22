import { Button } from '@mui/material';

const FileUploader = ({ onFilesSelect }) => {
  return (
    <Button variant="outlined" component="label" size="small">
      Files
      <input
        type="file"
        hidden
        accept=".pdf,.doc,.docx,.xlsx,.xls,.zip,.rar,.txt"
        multiple
        onChange={(e) => onFilesSelect(Array.from(e.target.files))}
      />
    </Button>
  );
};

export default FileUploader;
