import React from 'react';

/**
 * Utility functions for formatting text from AI responses
 */

/**
 * Converts markdown-style **bold** text to HTML with styling
 * @param text - The text containing **bold** markdown
 * @returns JSX elements with properly formatted bold text
 */
export const formatBoldText = (text: string): React.ReactElement[] => {
  // Split text by **bold** patterns and create JSX elements
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove the ** markers and make bold with a distinctive color
      const boldText = part.slice(2, -2);
      return (
        <span key={index} className="font-bold text-primary">
          {boldText}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

/**
 * Converts markdown-style **bold** text to HTML string for simple cases
 * @param text - The text containing **bold** markdown
 * @returns HTML string with <strong> tags
 */
export const formatBoldTextToHTML = (text: string): string => {
  return text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-primary">$1</strong>');
};

/**
 * Removes markdown formatting entirely for plain text
 * @param text - The text containing markdown
 * @returns Plain text without markdown
 */
export const stripMarkdown = (text: string): string => {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1');
};