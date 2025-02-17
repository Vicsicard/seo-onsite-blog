// pages/input.js
import { useState } from 'react';

export default function InputPage() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic || !questions) {
      setError('Both fields are required.');
      return;
    }
    setError('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, questions }),
      });
      const data = await response.json();
      // Handle the response, e.g., navigate to the preview page with the blog ID
    } catch (err) {
      console.error('Error generating content:', err);
    }
  };

  return (
    <div>
      <h1>Generate Blog Content</h1>
      <input
        type="text"
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <textarea
        placeholder="Paste related questions"
        value={questions}
        onChange={(e) => setQuestions(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleGenerate}>Generate Content</button>
    </div>
  );
}
