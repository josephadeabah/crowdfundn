// components/MyForm.tsx
import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill's CSS

const initialData = {
  name: 'Wall-E',
  location: 'Earth',
  about: [
    {
      insert:
        'A robot who has developed sentience, and is the only robot of his kind shown to be still functioning on Earth.\n',
    },
  ],
};

const MyForm = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    // Check if we are in the browser
    if (typeof window !== 'undefined' && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        modules: {
          toolbar: [
            ['bold', 'italic'],
            ['link', 'blockquote', 'code-block', 'image', 'video'],
            [{ list: 'ordered' }, { list: 'bullet' }],
          ],
        },
        theme: 'snow',
      });

      const resetForm = () => {
        const nameInput = document.querySelector(
          '[name="name"]',
        ) as HTMLInputElement | null;
        const locationInput = document.querySelector(
          '[name="location"]',
        ) as HTMLInputElement | null;

        if (nameInput) {
          nameInput.value = initialData.name;
        }
        if (locationInput) {
          locationInput.value = initialData.location;
        }
        if (quillRef.current) {
          quillRef.current.setContents(initialData.about);
        }
      };

      resetForm();

      const form = document.querySelector('form') as HTMLFormElement | null;
      if (form) {
        form.addEventListener('formdata', (event) => {
          event.formData.append(
            'about',
            JSON.stringify(quillRef.current?.getContents().ops),
          );
        });
      }

      const resetButton = document.querySelector('#resetForm');
      if (resetButton) {
        resetButton.addEventListener('click', resetForm);
      }
    }
  }, []);

  return (
    <div className="container">
      <form action="https://httpbin.org/post" method="post">
        <div className="form-group">
          <label htmlFor="name">Display name</label>
          <input id="name" name="name" type="text" />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input id="location" name="location" type="text" />
        </div>
        <div className="form-group">
          <label>About me</label>
          <div ref={editorRef} id="editor"></div>
        </div>
        <button type="submit">Submit Form</button>
        <button type="button" id="resetForm">
          Reset to Initial Data
        </button>
      </form>
    </div>
  );
};

export default MyForm;
