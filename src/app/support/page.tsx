"use client";

import React, { useState } from 'react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const webhookUrl = 'https://discord.com/api/webhooks/1361029845559148715/i20VsADw6pawnGkhRJKdO7Q4oiNNGNKw_KASyZmyFJ8nzHIXQf8VVbudjI661ccJOKqK'; // Replace with your Discord webhook URL

      const payload = {
        content: `New Contact Us Form Submission:\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`,
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to send message to Discord');
      }

      setResponseMessage('Your message has been sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      setResponseMessage('Failed to send your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-1">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message here..."
            required
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      {responseMessage && <p className="mt-4 text-center">{responseMessage}</p>}
    </div>
  );
}