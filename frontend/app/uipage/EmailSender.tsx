import React, { useState, useRef } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const EmailSender = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  interface Errors {
    to?: string;
    subject?: string;
    body?: string;
    attachment?: string;
    api?: string;
  }

  const [errors, setErrors] = useState<Errors>({});
  const [isSending, setIsSending] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          attachment: 'File size should be less than 5MB',
        });
        const newErrors: Errors = {};
        setAttachment(file);
        setErrors({ ...errors, attachment: undefined });
      }
    }
  };

  const handleSend = async () => {
    const newErrors: Errors = {};
    if (!validateEmail(to)) newErrors.to = 'Invalid email address';
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    if (!body.trim()) newErrors.body = 'Email body is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSending(true);
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setConfirmationMessage('Email sent successfully!');
      setTo('');
      setSubject('');
      setBody('');
      setAttachment(null);
      setErrors({});
    } catch (error) {
      setErrors({ api: 'Failed to send email. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Send an Email</h2>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="to"
            className="block text-sm font-medium text-gray-700"
          >
            To:
          </label>
          <input
            type="email"
            id="to"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              if (validateEmail(e.target.value)) {
                setErrors({ ...errors, to: undefined });
              }
            }}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors.to ? 'border-red-500' : ''}`}
            placeholder="recipient@example.com"
            aria-describedby="to-error"
          />
          {errors.to && (
            <p id="to-error" className="mt-2 text-sm text-red-600">
              {errors.to}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700"
          >
            Subject:
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (e.target.value.trim()) {
                setErrors({ ...errors, subject: undefined });
              }
            }}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors.subject ? 'border-red-500' : ''}`}
            placeholder="Enter subject"
            aria-describedby="subject-error"
          />
          {errors.subject && (
            <p id="subject-error" className="mt-2 text-sm text-red-600">
              {errors.subject}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gray-700"
          >
            Message:
          </label>
          <ReactQuill
            value={body}
            onChange={(content) => {
              setBody(content);
              if (content.trim()) {
                setErrors({ ...errors, body: undefined });
              }
            }}
            className={`mt-1 block w-full ${errors.body ? 'border-red-500' : ''}`}
            placeholder="Compose your email"
          />
          {errors.body && (
            <p id="body-error" className="mt-2 text-sm text-red-600">
              {errors.body}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="attachment"
            className="block text-sm font-medium text-gray-700"
          >
            Attachment:
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              id="attachment"
              ref={fileInputRef}
              onChange={handleAttachment}
              className="hidden"
              aria-describedby="attachment-error"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPaperclip className="mr-2" />
              {attachment ? attachment.name : 'Attach File'}
            </button>
          </div>
          {errors.attachment && (
            <p id="attachment-error" className="mt-2 text-sm text-red-600">
              {errors.attachment}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaPaperPlane className="mr-2" />
            {isSending ? 'Sending...' : 'Send Email'}
          </button>
          {confirmationMessage && (
            <p className="text-sm text-green-600">{confirmationMessage}</p>
          )}
        </div>
      </form>
      {errors.api && <p className="mt-4 text-sm text-red-600">{errors.api}</p>}
    </div>
  );
};

export default EmailSender;

export const EmailSender2 = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    content: '',
  });
  interface FormErrors {
    recipient?: string;
    subject?: string;
    content?: string;
    submit?: string;
  }

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.recipient) {
      newErrors.recipient = 'Recipient email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.recipient)) {
      newErrors.recipient = 'Invalid email address';
    }
    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.content) {
      newErrors.content = 'Email content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoint
        await axios.post('https://api.example.com/send-email', formData);
        setIsSuccess(true);
        setFormData({ recipient: '', subject: '', content: '' });
      } catch (error) {
        setErrors({ submit: 'Failed to send email. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Send Email
      </h2>
      {isSuccess ? (
        <div
          className="text-green-600 text-center py-4 bg-green-100 rounded-md mb-4"
          role="alert"
        >
          Email sent successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="recipient"
              className="block text-sm font-medium text-gray-700"
            >
              Recipient Email
            </label>
            <input
              type="email"
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors.recipient ? 'border-red-500' : ''}`}
              aria-invalid={errors.recipient ? 'true' : 'false'}
              aria-describedby="recipient-error"
            />
            {errors.recipient && (
              <p className="mt-2 text-sm text-red-600" id="recipient-error">
                {errors.recipient}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors.subject ? 'border-red-500' : ''}`}
              aria-invalid={errors.subject ? 'true' : 'false'}
              aria-describedby="subject-error"
            />
            {errors.subject && (
              <p className="mt-2 text-sm text-red-600" id="subject-error">
                {errors.subject}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Email Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={4}
              value={formData.content}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors.content ? 'border-red-500' : ''}`}
              aria-invalid={errors.content ? 'true' : 'false'}
              aria-describedby="content-error"
            ></textarea>
            {errors.content && (
              <p className="mt-2 text-sm text-red-600" id="content-error">
                {errors.content}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              'Sending...'
            ) : (
              <>
                <FaPaperPlane className="mr-2 h-5 w-5" aria-hidden="true" />
                Send Email
              </>
            )}
          </button>
          {errors.submit && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.submit}
            </p>
          )}
        </form>
      )}
    </div>
  );
};
