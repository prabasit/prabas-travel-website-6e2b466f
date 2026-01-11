
import React from 'react';
import { sanitizeHtml } from '@/utils/security';

interface SecureContentProps {
  content: string;
  className?: string;
}

const SecureContent: React.FC<SecureContentProps> = ({ content, className = '' }) => {
  const sanitizedContent = sanitizeHtml(content);
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SecureContent;
