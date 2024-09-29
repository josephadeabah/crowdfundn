'use client';

import React, { useState } from 'react';
import Modal1 from './Modal1';
import RichTextEditor from './RichTextModal';

const TestPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Modal1 />
      <RichTextEditor />
    </div>
  );
};

export default TestPage;
