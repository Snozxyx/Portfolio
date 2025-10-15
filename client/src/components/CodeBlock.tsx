import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Import language components
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-html';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';

// Import plugins for enhanced functionality
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';

import { Button } from '@/components/ui/button';
import { Copy, Check, Play, Eye, EyeOff, Download, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeBlockProps {
  code: string;
  language: string;
  showPreview?: boolean;
  title?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  fileName?: string;
  allowDownload?: boolean;
  theme?: 'dark' | 'light';
}

// Language configurations for execution
const EXECUTABLE_LANGUAGES = {
  javascript: { safe: true, extensions: ['js', 'mjs'] },
  js: { safe: true, extensions: ['js'] },
  typescript: { safe: false, extensions: ['ts'] },
  ts: { safe: false, extensions: ['ts'] },
  html: { safe: true, extensions: ['html', 'htm'] },
  css: { safe: true, extensions: ['css'] },
  json: { safe: true, extensions: ['json'] },
  python: { safe: false, extensions: ['py'] },
  bash: { safe: false, extensions: ['sh', 'bash'] },
  sql: { safe: false, extensions: ['sql'] },
} as const;

export const CodeBlock = memo<CodeBlockProps>(({
  code,
  language,
  showPreview = false,
  title,
  showLineNumbers = false,
  maxHeight = '400px',
  fileName,
  allowDownload = true,
  theme = 'dark'
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Normalize language name
  const normalizedLanguage = language.toLowerCase().replace(/[^a-z0-9]/g, '');
  const languageConfig = EXECUTABLE_LANGUAGES[normalizedLanguage as keyof typeof EXECUTABLE_LANGUAGES];

  // Enhanced syntax highlighting with error handling
  useEffect(() => {
    if (codeRef.current && code) {
      try {
        // Clear any existing highlighting
        codeRef.current.className = `language-${normalizedLanguage}`;
        codeRef.current.innerHTML = code;
        
        // Apply syntax highlighting
        Prism.highlightElement(codeRef.current);
        
        // Add line numbers if enabled
        if (showLineNumbers && preRef.current) {
          preRef.current.classList.add('line-numbers');
        }
      } catch (err) {
        console.warn('PrismJS highlighting failed:', err);
      }
    }
  }, [code, normalizedLanguage, showLineNumbers]);

  // Optimized copy functionality
  const copyToClipboard = useCallback(async () => {
    if (!code) return;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({ 
        title: 'Code copied to clipboard!',
        description: `${code.split('').length} lines copied`
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        toast({ title: 'Code copied to clipboard!' });
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        toast({ 
          title: 'Failed to copy code', 
          description: 'Please copy manually',
          variant: 'destructive' 
        });
      }
    }
  }, [code, toast]);

  // Enhanced code execution with better sandboxing
  const runCode = useCallback(async () => {
    if (!languageConfig) {
      setError(`Execution not supported for ${language}`);
      return;
    }

    if (!languageConfig.safe) {
      setError(`Execution of ${language} code is disabled for security reasons`);
      return;
    }

    setError('');
    setOutput('');
    setIsLoading(true);

    try {
      if (normalizedLanguage === 'javascript' || normalizedLanguage === 'js') {
        // Enhanced JavaScript sandbox
        const logs: string[] = [];
        const errors: string[] = [];
        
        const sandboxConsole = {
          log: (...args: any[]) => logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')),
          error: (...args: any[]) => errors.push('ERROR: ' + args.map(String).join(' ')),
          warn: (...args: any[]) => logs.push('WARN: ' + args.map(String).join(' ')),
          info: (...args: any[]) => logs.push('INFO: ' + args.map(String).join(' ')),
          clear: () => logs.length = 0,
        };

        // Create a more secure sandbox
        const sandbox = {
          console: sandboxConsole,
          setTimeout: undefined,
          setInterval: undefined,
          fetch: undefined,
          XMLHttpRequest: undefined,
          localStorage: undefined,
          sessionStorage: undefined,
        };

        try {
          const func = new Function(...Object.keys(sandbox), code);
          const result = func(...Object.values(sandbox));
          
          if (result !== undefined) {
            logs.push(`Return value: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`);
          }
          
          setOutput([...logs, ...errors].join('\n') || 'Code executed successfully (no output)');
        } catch (execError: any) {
          setError(`Execution error: ${execError.message}`);
        }
      } else if (normalizedLanguage === 'html') {
        setOutput('preview-html');
      } else if (normalizedLanguage === 'css') {
        setOutput('preview-css');
      } else if (normalizedLanguage === 'json') {
        try {
          const parsed = JSON.parse(code);
          setOutput(JSON.stringify(parsed, null, 2));
        } catch (jsonError: any) {
          setError(`Invalid JSON: ${jsonError.message}`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to execute code');
    } finally {
      setIsLoading(false);
    }
  }, [code, normalizedLanguage, language, languageConfig]);

  // Download code as file
  const downloadCode = useCallback(() => {
    if (!code) return;
    
    const extension = languageConfig?.extensions[0] || 'txt';
    const filename = fileName || `code.${extension}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ 
      title: 'File downloaded',
      description: `${filename} has been downloaded`
    });
  }, [code, fileName, languageConfig, toast]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (e.currentTarget.getAttribute('data-action') === 'copy') {
        copyToClipboard();
      } else if (e.currentTarget.getAttribute('data-action') === 'run') {
        runCode();
      }
    }
  }, [copyToClipboard, runCode]);

  return (
    <div 
      className={`rounded-lg overflow-hidden border transition-all duration-200 my-4 ${
        theme === 'dark' 
          ? 'border-gray-700 bg-gray-900' 
          : 'border-gray-200 bg-white'
      }`}
      role="region"
      aria-label={`Code block${title ? `: ${title}` : ''}`}
    >
      {/* Header */}
      {(title || fileName) && (
        <div className={`px-4 py-2 border-b text-sm font-medium flex items-center justify-between ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700 text-gray-300' 
            : 'bg-gray-50 border-gray-200 text-gray-600'
        }`}>
          <div className="flex items-center gap-2">
            {title && <span>{title}</span>}
            {fileName && (
              <span className={`px-2 py-1 rounded text-xs ${
                theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
                {fileName}
              </span>
            )}
            <span className={`px-2 py-1 rounded text-xs ${
              theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
            }`}>
              {language}
            </span>
          </div>
          <div className="text-xs opacity-75">
            {code.split('\n').length} lines
          </div>
        </div>
      )}
      
      {/* Code container */}
      <div className="relative">
        {/* Action buttons */}
        <div className="absolute right-2 top-2 flex gap-1 z-10">
          {showPreview && languageConfig?.safe && (
            <Button
              size="sm"
              variant="ghost"
              onClick={runCode}
              disabled={isLoading}
              className="h-8 w-8 p-0"
              title={`Run ${language} code`}
              data-action="run"
              onKeyDown={handleKeyDown}
            >
              <Play className="w-3 h-3" />
              <span className="sr-only">Run code</span>
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0"
            title="Copy code to clipboard"
            data-action="copy"
            onKeyDown={handleKeyDown}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span className="sr-only">{copied ? 'Copied' : 'Copy code'}</span>
          </Button>

          {allowDownload && (
            <Button
              size="sm"
              variant="ghost"
              onClick={downloadCode}
              className="h-8 w-8 p-0"
              title="Download code as file"
            >
              <Download className="w-3 h-3" />
              <span className="sr-only">Download code</span>
            </Button>
          )}

          {output === 'preview-html' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPreview(!preview)}
              className="h-8 w-8 p-0"
              title={preview ? 'Hide preview' : 'Show preview'}
            >
              {preview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span className="sr-only">{preview ? 'Hide preview' : 'Show preview'}</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <Maximize2 className="w-3 h-3" />
            <span className="sr-only">{isExpanded ? 'Collapse' : 'Expand'}</span>
          </Button>
        </div>

        {/* Code display */}
        <pre 
          ref={preRef}
          className={`!mt-0 overflow-auto p-4 ${showLineNumbers ? 'line-numbers' : ''}`}
          style={{ 
            maxHeight: isExpanded ? 'none' : maxHeight,
            fontSize: '14px',
            lineHeight: '1.5'
          }}
          tabIndex={0}
          role="textbox"
          aria-label="Code content"
          aria-readonly="true"
        >
          <code 
            ref={codeRef} 
            className={`language-${normalizedLanguage}`}
            aria-label={`${language} code`}
          >
            {code}
          </code>
        </pre>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className={`border-t p-4 flex items-center gap-2 ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-sm">Executing code...</span>
        </div>
      )}

      {/* Output Display */}
      {output && output !== 'preview-html' && output !== 'preview-css' && (
        <div className={`border-t p-4 ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="text-xs font-medium mb-2 opacity-75">Output:</div>
          <pre className={`text-sm whitespace-pre-wrap font-mono p-3 rounded ${
            theme === 'dark' ? 'bg-gray-900 text-green-400' : 'bg-white text-gray-800 border'
          }`}>
            {output}
          </pre>
        </div>
      )}

      {/* HTML Preview */}
      {output === 'preview-html' && preview && (
        <div className={`border-t p-4 ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="text-xs font-medium mb-2 opacity-75">Preview:</div>
          <div className="border rounded-lg overflow-hidden">
            <iframe
              srcDoc={code}
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-64 bg-white"
              title="HTML Preview"
            />
          </div>
        </div>
      )}

      {/* CSS Preview */}
      {output === 'preview-css' && (
        <div className={`border-t p-4 ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="text-xs font-medium mb-2 opacity-75">CSS Preview:</div>
          <div className="p-4 border rounded bg-white">
            <style>{code}</style>
            <div className="text-sm text-gray-600">
              CSS styles applied. Create HTML elements to see the effect.
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className={`border-t p-4 ${
          theme === 'dark' 
            ? 'border-red-900 bg-red-900/20' 
            : 'border-red-200 bg-red-50'
        }`}>
          <div className={`text-xs font-medium mb-2 ${
            theme === 'dark' ? 'text-red-400' : 'text-red-600'
          }`}>
            Error:
          </div>
          <pre className={`text-sm whitespace-pre-wrap font-mono ${
            theme === 'dark' ? 'text-red-300' : 'text-red-700'
          }`}>
            {error}
          </pre>
        </div>
      )}
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';

export default CodeBlock;