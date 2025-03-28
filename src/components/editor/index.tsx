"use client";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { Separator } from "./ui/separator";

import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { uploadFn } from "./image-upload";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";

const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand];

interface EditorProps {
  pageUrl?: string;
  pageContent?: string;
}

// Custom event for content structure updates
export const CONTENT_STRUCTURE_UPDATE_EVENT = "content-structure-update";

// Interface for content metrics
export interface ContentStructureMetrics {
  wordCount: number;
  headingCount: number;
  paragraphCount: number;
  imageCount: number;
}

// Helper function to count words
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

// Helper function to analyze content structure
const analyzeContentStructure = (editor: EditorInstance): ContentStructureMetrics => {
  const json = editor.getJSON();
  let wordCount = 0;
  let headingCount = 0;
  let paragraphCount = 0;
  let imageCount = 0;

  // Function to process content nodes recursively
  const processNode = (node: any) => {
    if (!node) return;

    // Check node type
    switch (node.type) {
      case 'heading':
        headingCount++;
        break;
      case 'paragraph':
        paragraphCount++;
        break;
      case 'image':
        imageCount++;
        break;
    }

    // Count words in text nodes
    if (node.text) {
      wordCount += countWords(node.text);
    }

    // Process child content recursively
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(processNode);
    }
  };

  // Process all nodes in the document
  if (json.content && Array.isArray(json.content)) {
    json.content.forEach(processNode);
  }

  // Use the editor's word count as it's more accurate
  try {
    wordCount = editor.storage.characterCount.words();
  } catch (e) {
    console.error("Failed to get word count from editor:", e);
  }

  return {
    wordCount,
    headingCount,
    paragraphCount,
    imageCount
  };
};

// Helper function to convert markdown to JSON content for the editor
const markdownToJSON = (markdown: string): JSONContent => {
  if (!markdown) {
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "" }],
        },
      ],
    };
  }

  // Preprocess the markdown to handle "/n" as a newline
  const preprocessedMarkdown = markdown.replace(/\/n/g, '\n');
  
  // Parse markdown content and create a structured JSON document
  const content: JSONContent['content'] = [];
  
  // Split by lines and process each line
  const lines = preprocessedMarkdown.split('\n');
  let currentParagraph: { type: string; content: any[] } | null = null;
  
  // Helper function to process text and detect formatting like **bold**
  const processText = (text: string): any[] => {
    const result: any[] = [];
    
    // Match bold text patterns: **bold** or __bold__
    const boldRegex = /(\*\*|__)(.*?)\1/g;
    let lastIndex = 0;
    let match;
    
    // Find all bold text matches in the string
    while ((match = boldRegex.exec(text)) !== null) {
      // Add any text before the bold part
      if (match.index > lastIndex) {
        result.push({ 
          type: 'text', 
          text: text.substring(lastIndex, match.index) 
        });
      }
      
      // Add the bold text part
      result.push({ 
        type: 'text', 
        text: match[2],  // The text between ** or __
        marks: [{ type: 'bold' }]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text after the last bold part
    if (lastIndex < text.length) {
      result.push({ 
        type: 'text', 
        text: text.substring(lastIndex) 
      });
    }
    
    // If no formatting was found, return the original text
    if (result.length === 0) {
      return [{ type: 'text', text }];
    }
    
    return result;
  };
  
  for (const line of lines) {
    // Handle headings
    if (line.startsWith('# ')) {
      content.push({
        type: 'heading',
        attrs: { level: 1 },
        content: processText(line.substring(2))
      });
      currentParagraph = null;
    } else if (line.startsWith('## ')) {
      content.push({
        type: 'heading',
        attrs: { level: 2 },
        content: processText(line.substring(3))
      });
      currentParagraph = null;
    } else if (line.startsWith('### ')) {
      content.push({
        type: 'heading',
        attrs: { level: 3 },
        content: processText(line.substring(4))
      });
      currentParagraph = null;
    } else if (line.trim() === '') {
      // Empty line - end current paragraph if any
      currentParagraph = null;
    } else {
      // Regular text - add to current paragraph or create new one
      if (!currentParagraph) {
        currentParagraph = {
          type: 'paragraph',
          content: processText(line)
        };
        content.push(currentParagraph);
      } else {
        // Process the text and add it with a space
        const processedText = processText(' ' + line);
        currentParagraph.content.push(...processedText);
      }
    }
  }
  
  return {
    type: 'doc',
    content
  };
};

const Editor = ({ pageUrl, pageContent }: EditorProps) => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null
  );
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();
  const [contentMetrics, setContentMetrics] = useState<ContentStructureMetrics>({
    wordCount: 0,
    headingCount: 0,
    paragraphCount: 0,
    imageCount: 0
  });

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightElement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  // Function to dispatch content structure update event
  const dispatchContentStructureUpdate = (metrics: ContentStructureMetrics) => {
    const event = new CustomEvent(CONTENT_STRUCTURE_UPDATE_EVENT, {
      detail: metrics,
      bubbles: true
    });
    document.dispatchEvent(event);
  };

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      const wordCount = editor.storage.characterCount.words();
      setCharsCount(wordCount);
      
      // Analyze content structure
      const metrics = analyzeContentStructure(editor);
      setContentMetrics(metrics);
      
      // Dispatch update event
      dispatchContentStructureUpdate(metrics);
      
      window.localStorage.setItem(
        "html-content",
        highlightCodeblocks(editor.getHTML())
      );
      window.localStorage.setItem("novel-content", JSON.stringify(json));
      window.localStorage.setItem(
        "markdown",
        editor.storage.markdown.getMarkdown()
      );
      setSaveStatus("Saved");
    },
    500
  );

  useEffect(() => {
    // If we have pageContent, use that to initialize the editor
    if (pageContent) {
      const contentJSON = markdownToJSON(pageContent);
      setInitialContent(contentJSON);
      
      // Store page URL and content
      if (pageUrl) {
        window.localStorage.setItem("editing-page-url", pageUrl);
        window.localStorage.setItem("editing-page-content", pageContent);
      }
    } else {
      // Otherwise check localStorage for previously saved content
      const content = window.localStorage.getItem("novel-content");
      if (content) setInitialContent(JSON.parse(content));
      else
        setInitialContent({
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "" }],
            },
          ],
        });
    }
  }, [pageContent, pageUrl]);

  if (!initialContent) return null;

  return (
    <div className="relative w-full max-w-screen-lg">
      {pageUrl && (
        <div className="absolute left-5 top-5 z-10 mb-5 gap-2 bg-accent px-3 py-1.5 text-sm text-muted-foreground rounded-md">
          Editing: {pageUrl.replace(/^https?:\/\//, '')}
        </div>
      )}
      <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2 ">
        <div className="bg-accent px-2 py-1 text-sm text-muted-foreground">
          {saveStatus}
        </div>
        <div
          className={
            charsCount
              ? "bg-accent px-2 py-1 text-sm text-muted-foreground"
              : "hidden"
          }
        >
          {charsCount} Words
        </div>
      </div>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="relative h-[calc(100vh-70px)] w-full max-w-screen-lg bg-background border-gray-400/90 p-8 "
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full prose-p:my-1 mt-8",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  // @ts-ignore
                  onCommand={(val) => item.command(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default Editor;
