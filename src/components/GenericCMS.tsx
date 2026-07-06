import React, { useState, useEffect } from 'react';
import { supabase, uploadFileToSupabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { 
  Plus, Edit, Trash2, Save, X, RefreshCw, Upload, 
  Check, AlertCircle, Eye, EyeOff, Loader2, ArrowUpDown
} from 'lucide-react';

export interface CMSField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'image' | 'select' | 'tags';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: any }[];
  defaultValue?: any;
}

interface GenericCMSProps {
  tableName: string;
  title: string;
  description?: string;
  fields: CMSField[];
  searchField?: string;
  orderByField?: string;
  orderAscending?: boolean;
  onDataChange?: () => void;
  gridDisplay?: boolean;
}

export default function GenericCMS({
  tableName,
  title,
  description,
  fields,
  searchField,
  orderByField = 'id',
  orderAscending = true,
  onDataChange,
  gridDisplay = false
}: GenericCMSProps) {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load data on mount / table name change
  const loadData = async () => {
    setLoading(true);
    try {
      let query = supabase.from(tableName).select('*');
      
      if (orderByField) {
        query = query.order(orderByField, { ascending: orderAscending });
      }

      const { data: result, error } = await query;
      if (error) throw error;
      
      setData(result || []);
      if (onDataChange) onDataChange();
    } catch (err: any) {
      console.error(`Error loading data from ${tableName}:`, err);
      toast(`Failed to load ${title} data: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tableName, orderByField, orderAscending]);

  // Open modal for Create/Edit
  const handleOpenModal = (item: any | null = null) => {
    setEditingItem(item);
    const initialValues: Record<string, any> = {};
    
    fields.forEach(f => {
      if (item) {
        initialValues[f.name] = item[f.name];
      } else {
        initialValues[f.name] = f.defaultValue !== undefined ? f.defaultValue : (f.type === 'boolean' ? false : f.type === 'number' ? 0 : '');
      }
    });
    
    setFormValues(initialValues);
    setIsModalOpen(true);
  };

  const handleInputChange = (name: string, value: any) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  // Image upload handler
  const handleImageUpload = async (fieldName: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      toast('Please upload a valid image file.', 'warning');
      return;
    }

    setUploadingField(fieldName);
    try {
      const publicUrl = await uploadFileToSupabase(file);
      handleInputChange(fieldName, publicUrl);
      toast('Image uploaded successfully to Supabase Storage!', 'success');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      toast(`Upload failed: ${err.message}`, 'error');
    } finally {
      setUploadingField(null);
    }
  };

  // Delete item handler
  const handleDelete = async (id: any) => {
    if (!confirm(`Are you sure you want to delete this ${title.toLowerCase()} item?`)) return;

    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;

      toast('Item deleted successfully from database!', 'success');
      loadData();
    } catch (err: any) {
      console.error('Delete failed:', err);
      toast(`Delete failed: ${err.message}`, 'error');
    }
  };

  // Toggle boolean fields (e.g. active, published) directly in list
  const handleToggle = async (item: any, fieldName: string) => {
    try {
      const updatedValue = !item[fieldName];
      const { error } = await supabase
        .from(tableName)
        .update({ [fieldName]: updatedValue })
        .eq('id', item.id);

      if (error) throw error;

      toast(`Toggled state of ${fieldName} successfully.`, 'success');
      loadData();
    } catch (err: any) {
      console.error('Toggle failed:', err);
      toast(`Update failed: ${err.message}`, 'error');
    }
  };

  // Save / Submit handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare payload - parse numbers or JSON if needed
      const payload: Record<string, any> = { ...formValues };
      
      fields.forEach(f => {
        if (f.type === 'number') {
          payload[f.name] = Number(payload[f.name]);
        }
        if (f.type === 'tags' && typeof payload[f.name] === 'string') {
          payload[f.name] = payload[f.name]
            .split(',')
            .map((t: string) => t.trim())
            .filter((t: string) => t.length > 0);
        }
      });

      // If editing, use ID
      if (editingItem) {
        payload.id = editingItem.id;
      } else if (!payload.id) {
        // Generate a valid custom ID if none exists (usually UUID or sequential)
        payload.id = `${tableName.substring(0, 4)}_${Date.now()}`;
      }

      const { error } = await supabase.from(tableName).upsert(payload);
      if (error) throw error;

      toast(`${title} saved successfully in real time!`, 'success');
      setIsModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (err: any) {
      console.error('Save failed:', err);
      toast(`Save failed: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Filter items based on search query
  const filteredData = data.filter(item => {
    if (!searchQuery) return true;
    if (searchField && item[searchField]) {
      return String(item[searchField]).toLowerCase().includes(searchQuery.toLowerCase());
    }
    // General fallback search across string fields
    return Object.values(item).some(val => 
      typeof val === 'string' && val.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
      {/* CMS Header Section */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{title} Table Manager</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/50">
              Supabase Live CMS
            </span>
          </h2>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={loadData}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-sm disabled:opacity-50 transition-all duration-250"
            title="Reload Supabase table data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl shadow-sm hover:shadow transition-all duration-250"
          >
            <Plus className="h-4 w-4" />
            <span>Add Row</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/20 dark:bg-slate-950/10 flex items-center gap-3">
        <input
          type="text"
          placeholder="Filter data rows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white dark:bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-850 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1 max-w-xs"
        />
        <div className="text-[10px] font-semibold text-slate-400 font-mono">
          Showing {filteredData.length} of {data.length} records
        </div>
      </div>

      {/* Main CMS Table / Grid */}
      <div className="p-6">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-7 w-7 text-emerald-500 animate-spin" />
            <div className="text-xs text-slate-500 font-medium">Querying Supabase live table...</div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/10">
            <AlertCircle className="h-8 w-8 text-slate-350 dark:text-slate-650 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">No Records Found</div>
            <p className="text-[10px] text-slate-450 mt-1 max-w-xs mx-auto">No records are active in table "{tableName}". Try creating a new row above to push data to Supabase.</p>
          </div>
        ) : gridDisplay ? (
          /* Grid visual format */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div 
                key={item.id} 
                className="bg-slate-50/40 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Find first image field to show as card thumbnail */}
                {fields.find(f => f.type === 'image') && (
                  <div className="relative h-32 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    <img 
                      src={item[fields.find(f => f.type === 'image')!.name] || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=60'} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-400 font-mono font-bold flex items-center justify-between">
                      <span>ID: {item.id}</span>
                      {fields.find(f => f.name === 'isActive' || f.name === 'active') && (
                        <button
                          onClick={() => handleToggle(item, fields.find(f => f.name === 'isActive' || f.name === 'active')!.name)}
                          className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${item[fields.find(f => f.name === 'isActive' || f.name === 'active')!.name] ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-100 dark:bg-slate-850 text-slate-400 border border-slate-200/40'}`}
                        >
                          {item[fields.find(f => f.name === 'isActive' || f.name === 'active')!.name] ? 'Active' : 'Draft'}
                        </button>
                      )}
                    </div>
                    
                    {/* Render first 3 text/textarea field summaries */}
                    {fields.filter(f => f.type === 'text' || f.type === 'textarea').slice(0, 3).map(f => (
                      <div key={f.name}>
                        <div className="text-[9px] font-bold uppercase text-slate-400">{f.label}</div>
                        <div className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 mt-0.5 font-medium">
                          {String(item[f.name] || '—')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-150/60 dark:border-slate-850/50">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-1.5 text-slate-500 hover:text-emerald-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                      title="Edit Row"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                      title="Delete Row"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table Tabular View */
          <div className="overflow-x-auto border border-slate-150 dark:border-slate-850 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-150 dark:border-slate-850">
                  <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Row ID</th>
                  {fields.map(f => (
                    <th key={f.name} className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {f.label}
                    </th>
                  ))}
                  <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr 
                    key={item.id}
                    className="border-b last:border-b-0 border-slate-100 dark:border-slate-850/80 hover:bg-slate-50/30 dark:hover:bg-slate-950/10 transition-colors"
                  >
                    <td className="p-3 text-xs font-mono font-bold text-slate-400 select-all">{item.id}</td>
                    {fields.map(f => {
                      const value = item[f.name];
                      return (
                        <td key={f.name} className="p-3 max-w-[200px]">
                          {f.type === 'image' ? (
                            value ? (
                              <img 
                                src={value} 
                                alt={f.label} 
                                className="h-10 w-16 object-cover rounded-lg border border-slate-200/60 dark:border-slate-850 bg-slate-100 dark:bg-slate-900" 
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-[10px] text-slate-350 italic">No image</span>
                            )
                          ) : f.type === 'boolean' ? (
                            <button
                              onClick={() => handleToggle(item, f.name)}
                              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold transition-all ${
                                value 
                                  ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 border border-emerald-200/30' 
                                  : 'bg-slate-50 text-slate-400 dark:bg-slate-900 border border-slate-200/20'
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${value ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                              <span>{value ? 'True' : 'False'}</span>
                            </button>
                          ) : f.type === 'tags' ? (
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(value) ? (
                                value.map((t, idx) => (
                                  <span key={idx} className="text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200/40 dark:border-slate-800/60">
                                    {t}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-400 text-xs">—</span>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate" title={String(value)}>
                              {value !== undefined && value !== null ? String(value) : <span className="text-slate-350 italic">Null</span>}
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over / Modal for Create and Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/45 dark:bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{editingItem ? 'Edit Row' : 'Add New Row'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">in {title}</span>
                </h3>
                <p className="text-[10px] text-slate-450 mt-0.5">Push real-time updates directly to Supabase storage & database.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* ID field helper */}
                {editingItem && (
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450">Unique ID (Primary Key)</label>
                    <input
                      type="text"
                      disabled
                      value={editingItem.id}
                      className="w-full bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 text-xs text-slate-500 select-all mt-1 cursor-not-allowed font-mono"
                    />
                  </div>
                )}

                {/* Dynamically Generated Form Fields */}
                {fields.map(f => {
                  const val = formValues[f.name];
                  
                  return (
                    <div key={f.name} className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <span>{f.label}</span>
                        {f.required && <span className="text-rose-500">*</span>}
                      </label>

                      {f.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          value={val || ''}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          required={f.required}
                          placeholder={f.placeholder || `Enter ${f.label.toLowerCase()}...`}
                          className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      ) : f.type === 'boolean' ? (
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/60">
                          <button
                            type="button"
                            onClick={() => handleInputChange(f.name, !val)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              val 
                                ? 'bg-emerald-500 text-white shadow-sm' 
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {val ? 'Enabled / True' : 'Disabled / False'}
                          </button>
                          <span className="text-[10px] text-slate-400">Sets value to live or draft mode.</span>
                        </div>
                      ) : f.type === 'select' ? (
                        <select
                          value={val || ''}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          required={f.required}
                          className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="">Select an option...</option>
                          {f.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : f.type === 'image' ? (
                        <div className="space-y-3">
                          {/* Image preview & uploader combo */}
                          <div className="flex items-center gap-3">
                            {val && (
                              <img 
                                src={val} 
                                alt="Preview" 
                                className="h-14 w-24 object-cover rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-950" 
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div className="flex-1">
                              <input
                                type="text"
                                value={val || ''}
                                onChange={(e) => handleInputChange(f.name, e.target.value)}
                                required={f.required}
                                placeholder="Paste external image URL or upload below..."
                                className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>
                          </div>

                          {/* Supabase Drag-and-Drop Dropzone */}
                          <div 
                            className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                              uploadingField === f.name
                                ? 'border-emerald-400 bg-slate-50 dark:bg-slate-900 animate-pulse'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950/40'
                            }`}
                            onClick={() => {
                              if (uploadingField) return;
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) handleImageUpload(f.name, file);
                              };
                              input.click();
                            }}
                          >
                            {uploadingField === f.name ? (
                              <div className="space-y-1">
                                <Loader2 className="mx-auto text-emerald-500 animate-spin mb-1 h-5 w-5" />
                                <div className="text-emerald-500 font-bold text-[11px]">Uploading to Supabase bucket...</div>
                              </div>
                            ) : (
                              <div className="space-y-1 text-slate-400 hover:text-slate-500">
                                <Upload className="mx-auto h-4 w-4 mb-1" />
                                <div className="text-[10px] font-semibold">Click to upload from device directly to Storage</div>
                                <p className="text-[9px] text-slate-400">Supported types: PNG, JPEG, WEBP, SVG</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : f.type === 'tags' ? (
                        <div>
                          <input
                            type="text"
                            value={Array.isArray(val) ? val.join(', ') : (val || '')}
                            onChange={(e) => handleInputChange(f.name, e.target.value)}
                            required={f.required}
                            placeholder={f.placeholder || "e.g. Mentor Support, Live Labs, Certificate"}
                            className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <p className="text-[9px] text-slate-400 mt-1">Separate elements with commas to render as chip lists.</p>
                        </div>
                      ) : (
                        /* Default standard 'text' or 'number' inputs */
                        <input
                          type={f.type === 'number' ? 'number' : 'text'}
                          value={val !== undefined ? val : ''}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          required={f.required}
                          placeholder={f.placeholder || `Enter ${f.label.toLowerCase()}...`}
                          className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Modal Actions */}
              <div className="p-5 border-t border-slate-100 dark:border-slate-800/85 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !!uploadingField}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl shadow-sm disabled:opacity-50 transition-all duration-200"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
