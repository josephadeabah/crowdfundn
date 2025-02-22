'use client';

import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useArticlesContext } from '@/app/context/admin/articles/ArticlesContext';
import RichTextEditor from '@/app/components/richtext/Richtext';
import Modal from '@/app/components/modal/Modal';
import { ArticleResponseDataType } from '@/app/types/articles.types';

// Define the structure for displaying content

interface Section {
  id: string;
  title: string;
  content: ArticleResponseDataType[];
}

const ContentManagerAdminPage = () => {
  const {
    articles,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
  } = useArticlesContext(); // Use the context

  // State for displaying content
  const [sections, setSections] = useState<Section[]>([
    { id: 'faqs', title: 'FAQs', content: [] },
    { id: 'cta', title: 'Calls-to-Action', content: [] },
    { id: 'hero', title: 'Hero Section', content: [] },
    { id: 'about', title: 'About Us', content: [] },
    { id: 'contact', title: 'Contact Us', content: [] },
    { id: 'blog', title: 'Blog', content: [] },
    { id: 'partners', title: 'Partners', content: [] },
    { id: 'footer', title: 'Footer', content: [] },
  ]);

  // State for editing content
  const [editingContent, setEditingContent] =
    useState<ArticleResponseDataType | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isCreatingContent, setIsCreatingContent] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Map articles to the "Blog" section
  useEffect(() => {
    if (articles.length > 0) {
      const blogSectionIndex = sections.findIndex((s) => s.id === 'blog');
      if (blogSectionIndex !== -1) {
        const updatedSections = [...sections];
        updatedSections[blogSectionIndex].content = articles.map((article) => ({
          id: article.id,
          title: article.title,
          description: article.description,
          meta_description: article.meta_description,
          featured_image: article.featured_image,
        }));
        setSections(updatedSections);
      }
    }
  }, [articles]);

  // Handle drag-and-drop reordering
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newSections = Array.from(sections);
    const [reorderedSection] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, reorderedSection);

    setSections(newSections);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle adding new content
  const handleAddContent = (sectionId: string) => {
    if (sectionId === 'blog') {
      setIsCreatingContent(true);
      setEditingSection(sectionId);
      setEditingContent({
        id: Date.now(),
        title: '',
        description: {
          id: 0,
          name: '',
          body: '',
          record_type: 'Article',
          record_id: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        meta_description: '',
        featured_image: '',
      });
    } else {
      // Handle other sections
      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            content: [
              ...section.content,
              {
                id: Date.now(),
                title: 'New Content',
                description: {
                  id: 0,
                  name: '',
                  body: '',
                  record_type: 'Article',
                  record_id: 0,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
                meta_description: '',
                featured_image: '',
              },
            ],
          };
        }
        return section;
      });
      setSections(updatedSections);
    }
  };

  // Handle editing content
  const handleEditContent = (sectionId: string, contentId: number) => {
    const section = sections.find((s) => s.id === sectionId);
    const content = section?.content.find((c) => c.id === contentId);
    if (content) {
      setEditingSection(sectionId);
      setEditingContent(content);
      setImagePreview(content.featured_image || null);
    }
  };

  // Handle saving content
  const handleSaveContent = async () => {
    if (editingSection === 'blog' && editingContent) {
      const formData = new FormData();
      formData.append('article[title]', editingContent.title);
      formData.append(
        'article[description]',
        editingContent.description.body,
      );
      formData.append(
        'article[meta_description]',
        editingContent.meta_description,
      );
      formData.append('article[status]', 'published');
      formData.append('article[published_at]', new Date().toISOString());

      // Add featured image if available
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('article[featured_image]', fileInput.files[0]);
      }

      if (isCreatingContent) {
        const createdArticle = await createArticle(formData);
        if (createdArticle) {
          const blogSectionIndex = sections.findIndex((s) => s.id === 'blog');
          if (blogSectionIndex !== -1) {
            const updatedSections = [...sections];
            updatedSections[blogSectionIndex].content = [
              ...updatedSections[blogSectionIndex].content,
              {
                id: createdArticle.id,
                title: createdArticle.title,
                description: createdArticle.description,
                meta_description: createdArticle.meta_description,
                featured_image: createdArticle.featured_image,
              },
            ];
            setSections(updatedSections);
          }
        }
      } else {
        const updatedArticle = await updateArticle(
          editingContent.id.toString(),
          formData,
        );
        if (updatedArticle) {
          const blogSectionIndex = sections.findIndex((s) => s.id === 'blog');
          if (blogSectionIndex !== -1) {
            const updatedSections = [...sections];
            updatedSections[blogSectionIndex].content = updatedSections[
              blogSectionIndex
            ].content.map((c) =>
              c.id === editingContent.id
                ? {
                    ...c,
                    title: editingContent.title,
                    description: editingContent.description,
                    meta_description: editingContent.meta_description,
                    featured_image:
                      updatedArticle.featured_image || c.featured_image,
                  }
                : c,
            );
            setSections(updatedSections);
          }
        }
      }
      // Reset states after saving
      setIsCreatingContent(false);
      setEditingSection(null);
      setEditingContent(null);
      setImagePreview(null);
    }
  };

  // Handle deleting content
  const handleDeleteContent = async (sectionId: string, contentId: number) => {
    if (sectionId === 'blog') {
      await deleteArticle(contentId.toString());
      const blogSectionIndex = sections.findIndex((s) => s.id === 'blog');
      if (blogSectionIndex !== -1) {
        const updatedSections = [...sections];
        updatedSections[blogSectionIndex].content = updatedSections[
          blogSectionIndex
        ].content.filter((c) => c.id !== contentId);
        setSections(updatedSections);
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsCreatingContent(false);
    setEditingSection(null);
    setEditingContent(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen p-2">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Content Manager Admin
      </h1>
      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search sections..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {filteredSections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white rounded-lg shadow p-6 mb-6"
                    >
                      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                        {section.title}
                      </h2>
                      <div className="space-y-4">
                        {section.content.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded"
                          >
                            <div className="flex items-center space-x-4">
                              {item.featured_image && (
                                <img
                                  src={item.featured_image}
                                  alt="Featured"
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="text-gray-600 font-semibold">
                                  {item.title}
                                </p>
                                {/* <div
                                  className="prose dark:prose-dark max-w-none"
                                  dangerouslySetInnerHTML={{
                                    __html: item.description.body || '',
                                  }}
                                /> */}
                                <p className="text-gray-400 text-xs">
                                  {item.meta_description}
                                </p>
                              </div>
                            </div>
                            <div className="space-x-2">
                              <button
                                onClick={() =>
                                  handleEditContent(section.id, item.id)
                                }
                                className="text-blue-500 hover:text-blue-600"
                                aria-label="Edit content"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteContent(section.id, item.id)
                                }
                                className="text-red-500 hover:text-red-600"
                                aria-label="Delete content"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => handleAddContent(section.id)}
                        className="mt-4 flex items-center text-green-500 hover:text-green-600"
                      >
                        <FaPlus className="mr-2" /> Add Content
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Modal
        isOpen={!!editingSection || isCreatingContent}
        onClose={handleCloseModal}
        size="xxxlarge"
        closeOnBackdropClick={false}
      >
        <div className="overflow-y-auto p-2">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">
              {isCreatingContent ? 'Create New Article' : 'Edit Content'}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={editingContent ? editingContent.title : ''}
                onChange={(e) =>
                  setEditingContent((prev) =>
                    prev ? { ...prev, title: e.target.value } : null,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
              <RichTextEditor
                value={editingContent ? editingContent.description.body : ''}
                onChange={(value) =>
                  setEditingContent((prev) =>
                    prev
                      ? {
                          ...prev,
                          description: { ...prev.description, body: value },
                        }
                      : null,
                  )
                }
                controls={[
                  ['bold', 'italic', 'underline', 'link'],
                  ['unorderedList', 'orderedList'],
                  ['h1', 'h2', 'h3'],
                  ['alignLeft', 'alignCenter', 'alignRight'],
                  ['image', 'video'],
                ]}
              />
              <input
                type="text"
                placeholder="Meta Description"
                value={editingContent ? editingContent.meta_description : ''}
                onChange={(e) =>
                  setEditingContent((prev) =>
                    prev ? { ...prev, meta_description: e.target.value } : null,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-4"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              )}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveContent}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContentManagerAdminPage;
