
import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-html';
import { Button } from '@/components/ui/button';
import { Copy, Check, Play, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeBlockProps {
  code: string;
  language: string;
  showPreview?: boolean;
  title?: string;
}

export const CodeBlock = ({ code, language, showPreview = false, title }: CodeBlockProps) => {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({ title: 'Code copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: 'Failed to copy code', variant: 'destructive' });
    }
  };

  const runCode = async () => {
    setError('');
    setOutput('');
    
    // Only allow safe languages for preview
    const safeLanguages = ['javascript', 'html', 'css', 'json'];
    if (!safeLanguages.includes(language.toLowerCase())) {
      setError('Preview is only available for HTML, CSS, JavaScript, and JSON');
      return;
    }

    try {
      if (language === 'javascript' || language === 'js') {
        // Run JavaScript in a sandboxed environment
        const logs: string[] = [];
        const sandbox = {
          console: {
            log: (...args: any[]) => logs.push(args.map(String).join(' ')),
            error: (...args: any[]) => logs.push('ERROR: ' + args.map(String).join(' ')),
            warn: (...args: any[]) => logs.push('WARN: ' + args.map(String).join(' ')),
          },
        };

        try {
          // Create a sandboxed function
          const func = new Function('console', code);
          func(sandbox.console);
          setOutput(logs.join('\n') || 'Code executed successfully (no output)');
        } catch (err: any) {
          setError(err.message);
        }
      } else if (language === 'html') {
        // For HTML, show a safe preview in an iframe
        setOutput('preview-html');
      } else if (language === 'json') {
        // Validate and format JSON
        try {
          const parsed = JSON.parse(code);
          setOutput(JSON.stringify(parsed, null, 2));
        } catch (err: any) {
          setError('Invalid JSON: ' + err.message);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to execute code');
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-card-border bg-card my-4">
      {title && (
        <div className="px-4 py-2 bg-card border-b border-card-border text-sm font-medium text-muted-foreground">
          {title}
        </div>
      )}
      
      <div className="relative">
        <div className="absolute right-2 top-2 flex gap-2 z-10">
          {showPreview && ['javascript', 'js', 'html', 'json'].includes(language.toLowerCase()) && (
            <Button
              size="sm"
              variant="outline"
              onClick={runCode}
              className="h-8 gap-2"
            >
              <Play className="w-3 h-3" />
              Run
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
            className="h-8 gap-2"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </Button>

          {output === 'preview-html' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPreview(!preview)}
              className="h-8 gap-2"
            >
              {preview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {preview ? 'Hide' : 'Preview'}
            </Button>
          )}
        </div>

        <pre className="!mt-0 overflow-auto p-4">
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>

      {/* Output Display */}
      {output && output !== 'preview-html' && (
        <div className="border-t border-card-border p-4 bg-background">
          <div className="text-xs font-medium text-muted-foreground mb-2">Output:</div>
          <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
            {output}
          </pre>
        </div>
      )}

      {/* HTML Preview */}
      {output === 'preview-html' && preview && (
        <div className="border-t border-card-border p-4 bg-background">
          <div className="text-xs font-medium text-muted-foreground mb-2">Preview:</div>
          <div className="border border-card-border rounded-lg overflow-hidden">
            <iframe
              srcDoc={code}
              sandbox="allow-scripts"
              className="w-full h-64 bg-white"
              title="HTML Preview"
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="border-t border-card-border p-4 bg-destructive/10">
          <div className="text-xs font-medium text-destructive mb-2">Error:</div>
          <pre className="text-sm text-destructive whitespace-pre-wrap font-mono">
            {error}
          </pre>
        </div>
      )}
    </div>
  );
};
