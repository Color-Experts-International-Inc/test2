import { useState } from 'react';
export default function Hello() {
  const [n, setN] = useState(0);
  return (
    <button type="button" onClick={() => setN(n + 1)} className="rounded-lg bg-teal-700 px-4 py-2 text-white">
      clicked {n}
    </button>
  );
}
