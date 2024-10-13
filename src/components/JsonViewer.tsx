import { AnalysisResult } from '@/types/AnalysisResult';
import React from 'react';

// Type for the JSON structure, allowing nested arrays and objects
type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray
  | AnalysisResult;

interface JsonObject {
  [key: string]: JsonValue;
}

type JsonArray = JsonValue[];

// Props type for the JsonViewer component
interface JsonViewerProps {
  data: JsonValue; // Accepts any valid JSON structure
  level?: number; // Tracks the indentation level
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, level = 0 }) => {
  // Helper to determine if the value is an object
  const isObject = (val: JsonValue): val is JsonObject => 
    typeof val === 'object' && val !== null && !Array.isArray(val);

  const toTitleCase = (str: string): string => {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div style={{ paddingLeft: level * 20 }}> {/* Indentation for nested levels */}
      {Array.isArray(data) ? (
        // Render Array
        data.map((item, index) => (
          <div key={index} style={{ marginBottom: '4px' }}>
            <span style={{ fontWeight: 'bold' }}>[{index + 1}]</span>:{' '}
            {isObject(item) || Array.isArray(item) ? (
              <JsonViewer data={item} level={level + 1} />
            ) : (
              <span>{String(item)}</span>
            )}
          </div>
        ))
      ) : isObject(data) ? (
        // Render Object
        Object.entries(data).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>{toTitleCase(key)}:</span>{' '}
            {isObject(value) || Array.isArray(value) ? (
              <JsonViewer data={value} level={level + 1} />
            ) : (
              <span>{String(value)}</span>
            )}
          </div>
        ))
      ) : (
        // Render Primitive Value (string, number, boolean, or null)
        <span>{String(data)}</span>
      )}
    </div>
  );
};

export default JsonViewer;
