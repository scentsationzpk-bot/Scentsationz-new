import React from 'react';

const noteDefinitions: Record<string, string> = {
  'Bergamot': 'A fresh, citrusy scent with floral and spicy nuances.',
  'Vanilla': 'A sweet, warm, and comforting scent.',
  'Oud': 'A rich, woody, and complex scent.',
  'Mahonial': 'A fresh, lily-of-the-valley floral scent.',
  'Akigalawood': 'A woody, spicy, and slightly floral scent.',
  // Add more as needed
};

export const NoteTooltip: React.FC<{ note: string }> = ({ note }) => {
  const definition = noteDefinitions[note] || 'A unique scent note.';
  return (
    <span className="group relative inline-block">
      <span className="cursor-help border-b border-dashed border-slate-400">{note}</span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {definition}
      </span>
    </span>
  );
};
