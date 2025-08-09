import { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import TurndownService from "turndown";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Copy,
  Edit,
  FileText,
} from "lucide-react";

export default function Home() {
  const [markdownContent, setMarkdownContent] = useState("");
  const { toast } = useToast();

  // Initialize TurndownService with proper configuration
  const turndownService = new TurndownService({
    codeBlockStyle: "fenced",
    fence: "```",
    emDelimiter: "*",
    strongDelimiter: "**",
    linkStyle: "inlined",
    bulletListMarker: "-",
    headingStyle: "atx",
  });

  // Configure turndown for better Markdown output
  turndownService.addRule("strikethrough", {
    filter: ["del", "s"],
    replacement: (content: string) => `~~${content}~~`,
  });

  // Ensure proper heading conversion
  turndownService.addRule("heading", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: (content: string, node: any) => {
      const level = parseInt(node.nodeName.charAt(1));
      const prefix = "#".repeat(level);
      return `\n${prefix} ${content}\n\n`;
    },
  });

  // Ensure proper list conversion
  turndownService.addRule("listItem", {
    filter: "li",
    replacement: (content: string, node: any) => {
      const parent = node.parentNode;
      if (parent.nodeName === "OL") {
        const index = Array.prototype.indexOf.call(parent.children, node) + 1;
        return `${index}. ${content}\n`;
      } else {
        return `- ${content}\n`;
      }
    },
  });

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Strike,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: false,
      }),
      CodeBlock,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = turndownService.turndown(html);
      setMarkdownContent(markdown);
    },
    editorProps: {
      attributes: {
        "data-placeholder": "Start typing or paste your HTML content here...",
      },
    },
  });

  const copyToClipboard = useCallback(async () => {
    if (!markdownContent) {
      toast({
        title: "No content",
        description: "There's no markdown content to copy.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(markdownContent);
      toast({
        title: "Copied!",
        description: "Markdown copied to clipboard!",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy markdown to clipboard.",
        variant: "destructive",
      });
    }
  }, [markdownContent, toast]);

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const setHeading = useCallback(
    (level: 1 | 2 | 3) => {
      editor?.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  const addLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const toggleCodeBlock = useCallback(() => {
    editor?.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900" data-testid="title-main">
            GetMarkdown
          </h1>
          <p className="text-sm text-slate-600 mt-1" data-testid="subtitle-main">
            Rich Text to Markdown Converter
          </p>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Rich Text Editor */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center" data-testid="title-editor">
                <Edit className="text-blue-600 mr-2 h-5 w-5" />
                Rich Text Editor
              </h2>
            </div>

            {/* Custom Toolbar */}
            <div className="border-b border-slate-200 px-4 py-2 bg-slate-50">
              <div className="flex flex-wrap gap-1">
                {/* Text Formatting */}
                <div className="flex border-r border-slate-300 pr-2 mr-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBold}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${
                      editor.isActive("bold") ? "bg-slate-200" : ""
                    }`}
                    data-testid="button-bold"
                  >
                    <BoldIcon className="h-4 w-4 text-slate-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleItalic}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${
                      editor.isActive("italic") ? "bg-slate-200" : ""
                    }`}
                    data-testid="button-italic"
                  >
                    <ItalicIcon className="h-4 w-4 text-slate-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleUnderline}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${
                      editor.isActive("underline") ? "bg-slate-200" : ""
                    }`}
                    data-testid="button-underline"
                  >
                    <UnderlineIcon className="h-4 w-4 text-slate-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleStrike}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${
                      editor.isActive("strike") ? "bg-slate-200" : ""
                    }`}
                    data-testid="button-strikethrough"
                  >
                    <Strikethrough className="h-4 w-4 text-slate-700" />
                  </Button>
                </div>

                {/* Headers */}
                <div className="flex border-r border-slate-300 pr-2 mr-2">
                  <select
                    className="bg-transparent text-sm text-slate-700 border-none outline-none px-2 py-1 rounded hover:bg-slate-200"
                    onChange={(e) => {
                      const level = parseInt(e.target.value);
                      if (level === 0) {
                        editor.chain().focus().setParagraph().run();
                      } else {
                        setHeading(level as 1 | 2 | 3);
                      }
                    }}
                    value={
                      editor.isActive("heading", { level: 1 })
                        ? "1"
                        : editor.isActive("heading", { level: 2 })
                        ? "2"
                        : editor.isActive("heading", { level: 3 })
                        ? "3"
                        : "0"
                    }
                    data-testid="select-heading"
                  >
                    <option value="0">Normal</option>
                    <option value="1">H1</option>
                    <option value="2">H2</option>
                    <option value="3">H3</option>
                  </select>
                </div>

                {/* Lists */}
                <div className="flex border-r border-slate-300 pr-2 mr-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleOrderedList}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${
                      editor.isActive("orderedList") ? "bg-slate-200" : ""
                    }`}
                    data-testid="button-ordered-list"
                  >
                    <ListOrdered className="h-4 w-4 text-slate-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBulletList}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${
                      editor.isActive("bulletList") ? "bg-slate-200" : ""
                    }`}
                    data-testid="button-bullet-list"
                  >
                    <List className="h-4 w-4 text-slate-700" />
                  </Button>
                </div>

                {/* Special Elements */}
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addLink}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${
                      editor.isActive("link") ? "bg-slate-200" : ""
                    }`}
                    data-testid="button-link"
                  >
                    <LinkIcon className="h-4 w-4 text-slate-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleCodeBlock}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${
                      editor.isActive("codeBlock") ? "bg-slate-200" : ""
                    }`}
                    data-testid="button-code-block"
                  >
                    <Code className="h-4 w-4 text-slate-700" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Editor Content Area */}
            <div className="flex-1 overflow-hidden">
              <EditorContent
                editor={editor}
                className="h-full overflow-auto"
                data-testid="editor-content"
              />
            </div>
          </div>

          {/* Markdown Preview */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
            <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center" data-testid="title-markdown">
                <FileText className="text-blue-600 mr-2 h-5 w-5" />
                Markdown Output
              </h2>
              <Button
                onClick={copyToClipboard}
                className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-slate-400"
                disabled={!markdownContent}
                data-testid="button-copy"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>

            <div className="flex-1 overflow-hidden">
              <div
                className="h-full bg-slate-900 text-slate-100 p-4 overflow-auto font-mono text-sm"
                data-testid="markdown-output"
              >
                {markdownContent ? (
                  <pre className="whitespace-pre-wrap">{markdownContent}</pre>
                ) : (
                  <div className="text-slate-500 italic">
                    No content yet. Start typing in the editor to see markdown output.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
