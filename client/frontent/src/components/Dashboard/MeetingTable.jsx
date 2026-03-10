import React, { useState } from 'react';

export default function MeetingTable({ documents, activeDocument, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const processedDocs = documents
    .filter((doc) => {
      const searchLower = searchTerm.toLowerCase();
      const matchNo = doc.meeting_id?.meeting_number?.toLowerCase().includes(searchLower);
      const matchDate = doc.meeting_id?.date?.toLowerCase().includes(searchLower);
      return matchNo || matchDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.meeting_id?.date);
      const dateB = new Date(b.meeting_id?.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="w-96 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10 shrink-0">
      
      <div className="p-6 border-b border-slate-200 flex flex-col bg-white z-20 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-black text-slate-800 uppercase tracking-tighter text-sm">
            Meeting Records
          </h2>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md font-black">
            {processedDocs.length} Found
          </span>
        </div>

        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px]">🔍</span>
            <input 
              type="text" 
              placeholder="Search meeting or date..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto relative bg-slate-50/50">
        {processedDocs.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 sticky top-0 shadow-sm z-10 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">Meeting No</th>
                <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Date</th>
                <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Agenda Items</th>
                <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-slate-500 text-right">Docs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {processedDocs.map((doc) => (
                <tr 
                  key={doc._id}
                  onClick={() => onSelect(doc)}
                  className={`cursor-pointer transition-all ${
                    activeDocument?._id === doc._id 
                      ? 'bg-blue-50/80 shadow-inner' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className={`py-4 px-4 text-xs font-black whitespace-nowrap ${
                    activeDocument?._id === doc._id ? 'text-blue-700' : 'text-slate-800'
                  }`}>
                    {doc.meeting_id?.meeting_number}
                  </td>
                  <td className="py-4 px-4 text-[10px] font-bold text-slate-500 whitespace-nowrap uppercase">
                    {doc.meeting_id?.date}
                  </td>
                  <td className="py-4 px-4 text-[10px] text-slate-500 font-medium">
                    {doc.meeting_id?.agenda_count} Items
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                      activeDocument?._id === doc._id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-blue-600 group-hover:bg-blue-100'
                    }`}>
                      View
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-30 p-8 text-center">
            <span className="text-3xl mb-2">🔍</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No matches found</p>
          </div>
        )}
      </div>
    </div>
  );
}