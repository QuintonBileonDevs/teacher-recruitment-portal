import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Trash2, Calendar, FileDown } from 'lucide-react';
import { User, DocumentMeta } from '../../types';

interface UpdateDocumentsProps {
  currentUser: User;
  onUpdateUser: (fields: Partial<User>) => void;
}

const DEFAULT_DOCS: DocumentMeta[] = [
  { name: "National ID (Omang).pdf", size: "1.2 MB", uploadedAt: "2026-05-15T10:00:00Z" },
  { name: "Diploma in Education.pdf", size: "3.4 MB", uploadedAt: "2026-05-15T10:05:00Z" }
];

export default function UpdateDocuments({ currentUser, onUpdateUser }: UpdateDocumentsProps) {
  const [documents, setDocuments] = useState<DocumentMeta[]>(() => {
    const saved = localStorage.getItem(`moesd_docs_${currentUser.id}`);
    if (saved) return JSON.parse(saved);
    return currentUser.documents || DEFAULT_DOCS;
  });

  const [selectedType, setSelectedType] = useState<string>("Omang Card/ID");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingName, setUploadingName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    localStorage.setItem(`moesd_docs_${currentUser.id}`, JSON.stringify(documents));
    onUpdateUser({ documents });
  }, [documents]);

  const simulateUpload = (fileName: string) => {
    setUploadingName(fileName);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newDoc: DocumentMeta = {
              name: `${selectedType} - ${fileName}`,
              size: (Math.random() * 4 + 1).toFixed(1) + " MB",
              uploadedAt: new Date().toISOString()
            };
            setDocuments(prevDocs => [newDoc, ...prevDocs]);
            setUploadingName(null);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      simulateUpload(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file.name);
    }
  };

  const handleDelete = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FileText className="w-6 h-6 text-sky-500" />
          Offical Document Manager
        </h3>
        <p className="text-sm text-slate-505 dark:text-slate-400 mt-1">
          Maintain your records updated in the national directory. Upload certified copies of your credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Segment */}
        <div className="md:col-span-1 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Document Category</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
            >
              <option value="Omang Card/ID">Omang Card (National ID)</option>
              <option value="Academic Certificate">Academic Certificate (Diploma/Degree)</option>
              <option value="Referees Recommendation">Referees Recommendation Letter</option>
              <option value="Curriculum Vitae (CV)">Curriculum Vitae (CV)</option>
              <option value="Marriage/Name Certificate">Marriage/Name Change Certificate</option>
              <option value="Teacher License/Registration">Teacher License / Registration Proof</option>
            </select>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              isDragging 
                ? 'border-sky-500 bg-sky-500/5' 
                : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 hover:bg-slate-50/50 dark:hover:bg-slate-950/20'
            }`}
          >
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Drag & drop certification file</p>
            <p className="text-xs text-slate-400 mt-1">Accepts PDF, JPG, PNG up to 10MB</p>
            
            <div className="relative mt-4">
              <input
                type="file"
                id="file-upload-input"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload-input"
                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer text-slate-700 dark:text-slate-300 transition-all shadow-sm"
              >
                Choose Local File
              </label>
            </div>
          </div>

          {uploadingName && (
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{uploadingName}</span>
                <span className="font-bold text-sky-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full transition-all duration-100" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Directory File Grid list */}
        <div className="md:col-span-2 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Verified Files Directory ({documents.length})</label>
          {documents.length === 0 ? (
            <div className="text-center py-10 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/40 dark:bg-slate-950/20">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No documents uploaded yet.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all bg-white dark:bg-slate-900/60">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-sky-50 dark:bg-sky-900/10 rounded-xl text-sky-600 dark:text-sky-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200 max-w-[200px] md:max-w-xs truncate">{doc.name}</h4>
                      <p className="text-[11px] font-medium text-slate-400 flex items-center gap-3 mt-1">
                        <span>{doc.size}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(doc.uploadedAt).toLocaleDateString([], { dateStyle: 'medium' })}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      title="Download file"
                      className="p-2 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition-colors cursor-pointer"
                      onClick={() => alert(`Initiating mock download: ${doc.name}`)}
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button 
                      title="Delete document"
                      className="p-2 text-slate-400 hover:text-red-650 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                      onClick={() => handleDelete(idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
