import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import { cn } from '@/app/lib/utils';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  YoutubeIcon,
  Undo,
  Redo,
  Code,
  Search,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Begin typing your campaign story...',
  className,
}: RichTextEditorProps) => {
  const [imageTitle, setImageTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UnsplashImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            'text-emerald-600 underline decoration-emerald/30 hover:decoration-emerald',
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md max-w-full h-auto',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-md my-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const searchUnsplashImages = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // Using sample Unsplash images in this example
      const sampleImages = [
        {
          id: 'photo-1649972904349-6e44c42644a7',
          urls: {
            regular:
              'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
            small:
              'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400',
          },
          alt_description: 'Woman working on laptop',
          user: { name: 'Unsplash Contributor' },
        },
        {
          id: 'photo-1488590528505-98d2b5aba04b',
          urls: {
            regular:
              'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
            small:
              'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
          },
          alt_description: 'Computer and code',
          user: { name: 'Unsplash Contributor' },
        },
        {
          id: 'photo-1518770660439-4636190af475',
          urls: {
            regular:
              'https://images.unsplash.com/photo-1518770660439-4636190af475',
            small:
              'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
          },
          alt_description: 'Circuit board close-up',
          user: { name: 'Unsplash Contributor' },
        },
        {
          id: 'photo-1461749280684-dccba630e2f6',
          urls: {
            regular:
              'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
            small:
              'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
          },
          alt_description: 'Programming code on screen',
          user: { name: 'Unsplash Contributor' },
        },
        {
          id: 'photo-1486312338219-ce68d2c6f44d',
          urls: {
            regular:
              'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
            small:
              'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400',
          },
          alt_description: 'Person using MacBook',
          user: { name: 'Unsplash Contributor' },
        },
      ];

      setSearchResults(sampleImages);
      toast.success(`Found ${sampleImages.length} images for "${query}"`);
    } catch (error) {
      console.error('Error searching for images:', error);
      toast.error('Failed to search for images');
    } finally {
      setIsSearching(false);
    }
  };

  const insertImage = (url: string, title: string) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .setImage({
          src: url,
          alt: title || 'Campaign image',
          title: title || '',
        })
        .run();
      setImageTitle('');
      setSearchQuery('');
      setSearchResults([]);
      setImageDialogOpen(false);
      toast.success('Image added successfully');
    }
  };

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
      toast.success('Image added successfully');
    }
  };

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube video URL:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
      toast.success('Video added successfully');
    }
  };

  const setLink = () => {
    const url = prompt('Enter URL:');
    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
    toast.success('Link added successfully');
  };

  return (
    <div className={cn('rich-editor-container bg-white', className)}>
      <div className="rich-editor-toolbar">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            editor.isActive('bold')
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground',
          )}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            editor.isActive('italic')
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground',
          )}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={cn(
            editor.isActive('heading', { level: 1 })
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground',
          )}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            editor.isActive('heading', { level: 2 })
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground',
          )}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            editor.isActive('bulletList')
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground',
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            editor.isActive('orderedList')
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground',
          )}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            editor.isActive('blockquote')
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground',
          )}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn(
            editor.isActive('code')
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground',
          )}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1.5" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn(
            editor.isActive({ textAlign: 'left' })
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground',
          )}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn(
            editor.isActive({ textAlign: 'center' })
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground',
          )}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn(
            editor.isActive({ textAlign: 'right' })
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground',
          )}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1.5" />

        <Button
          variant="ghost"
          size="icon"
          onClick={setLink}
          className={cn(
            editor.isActive('link')
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground',
          )}
          title="Link"
        >
          <Link2 className="h-4 w-4" />
        </Button>

        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              title="Add Image from Unsplash"
            >
              <Search className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[725px]">
            <DialogHeader>
              <DialogTitle>Search for Images</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">Search Images</TabsTrigger>
                <TabsTrigger value="url">Image URL</TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search for images..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => searchUnsplashImages(searchQuery)}
                      disabled={isSearching}
                    >
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                  </div>
                  <Input
                    placeholder="Image title (optional)"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 max-h-[400px] overflow-y-auto p-1">
                    {searchResults.map((image) => (
                      <div
                        key={image.id}
                        className="rounded-md overflow-hidden border border-border hover:border-emerald-900 cursor-pointer transition-all"
                        onClick={() =>
                          insertImage(
                            image.urls.regular,
                            imageTitle || image.alt_description,
                          )
                        }
                      >
                        <img
                          src={image.urls.small}
                          alt={image.alt_description}
                          className="w-full h-32 object-cover hover:opacity-90 transition-opacity"
                        />
                        <div className="p-2 text-xs text-muted-foreground truncate">
                          {image.alt_description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Paste image URL"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Input
                    placeholder="Image title (optional)"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                  />
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => insertImage(searchQuery, imageTitle)}
                    disabled={!searchQuery}
                  >
                    Insert Image
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          size="icon"
          onClick={addImage}
          className="text-muted-foreground"
          title="Add Image URL"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={addYoutubeVideo}
          className="text-muted-foreground"
          title="Add YouTube Video"
        >
          <YoutubeIcon className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1.5" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="text-muted-foreground"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="text-muted-foreground"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="rich-editor-content" />
    </div>
  );
};

export default RichTextEditor;
