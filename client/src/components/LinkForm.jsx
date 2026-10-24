import { useState,useEffect } from 'react';
const API = import.meta.env.VITE_API_URL;


function LinkForm() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [links, setLinks] = useState([]);
    useEffect(() => {
    async function loadLinks() {
      const res = await fetch(`${API}/api/links`);
      const data = await res.json();
      setLinks(data);
    }
    loadLinks();
  }, []);
    async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(`${API}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl: url }),
    });
    const data = await res.json();
    console.log(res.status, data);
        if (res.ok) {
      setResult(data);
      setLinks([data, ...links]);
      setError('');
    } else {
      setError(data.error);
      setResult(null);
    }
  }
    async function handleDelete(id) {
    await fetch(`${API}/api/links/${id}`, {
      method: 'DELETE',
    });
    setLinks(links.filter((link) => link._id !== id));
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Paste a long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        />
      
      <button type="submit">Shorten</button>
    </form>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {result && (
  <p>
    Short link:{' '}
    <a href={`{API}/{result.shortCode}`} target="_blank">
      ${API}/{result.shortCode}
    </a>
  </p>
)}
<h2>All links</h2>
<ul>
  {links.map((link) => (
    <li key={link._id}>
      <a href={`${API}/${link.shortCode}`} target="_blank">
        {link.shortCode}
      </a>{' '}
      → {link.originalUrl} ({link.clickCount} clicks)
            <button onClick={() => handleDelete(link._id)}>Delete</button>
    </li>
  ))}
</ul>
</>
  );
}

export default LinkForm;