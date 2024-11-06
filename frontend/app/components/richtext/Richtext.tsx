'use client';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@mantine/rte'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});

export default RichTextEditor;
