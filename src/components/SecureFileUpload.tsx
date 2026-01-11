
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { isValidFileType, isValidFileSize } from '@/utils/security';
import { Upload, X } from 'lucide-react';

interface SecureFileUploadProps {
  onFileUpload: (url: string) => void;
  currentFile?: string;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
  label?: string;
}

const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onFileUpload,
  currentFile,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeInMB = 5,
  label = 'Upload File'
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isValidFileType(file, acceptedTypes)) {
      toast({
        title: "Invalid File Type",
        description: `Please upload one of: ${acceptedTypes.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (!isValidFileSize(file, maxSizeInMB)) {
      toast({
        title: "File Too Large",
        description: `File size must be less than ${maxSizeInMB}MB`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Create a simple URL for the file (in production, upload to proper storage)
      const url = URL.createObjectURL(file);
      onFileUpload(url);
      
      toast({
        title: "File Uploaded",
        description: "File has been uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onFileUpload('');
    toast({
      title: "File Removed",
      description: "File has been removed",
    });
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Input
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
          </Button>
        </div>
        
        {currentFile && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">File selected</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        Max file size: {maxSizeInMB}MB. Accepted formats: {acceptedTypes.join(', ')}
      </p>
    </div>
  );
};

export default SecureFileUpload;
