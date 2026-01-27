'use client';

interface CompositionPropsEditorProps {
  compositionId: string;
  props: Record<string, any>;
  onChange: (newProps: Record<string, any>) => void;
}

export default function CompositionPropsEditor({
  compositionId,
  props,
  onChange,
}: CompositionPropsEditorProps) {

  const handleChange = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  const handleArrayItemChange = (key: string, index: number, field: string, value: string) => {
    const arr = [...props[key]];
    arr[index] = { ...arr[index], [field]: value };
    onChange({ ...props, [key]: arr });
  };

  const renderField = (key: string, value: any) => {
    // Skip complex arrays for inline editing — render separately
    if (Array.isArray(value) && typeof value[0] === 'object') {
      return (
        <div key={key} className="space-y-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{key}</label>
          {value.map((item: any, i: number) => (
            <div key={i} className="pl-3 border-l border-white/10 space-y-1">
              <span className="text-xs text-gray-500">#{i + 1}</span>
              {Object.entries(item).map(([field, val]) => (
                <input
                  key={field}
                  type="text"
                  value={val as string}
                  onChange={(e) => handleArrayItemChange(key, i, field, e.target.value)}
                  placeholder={field}
                  className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              ))}
            </div>
          ))}
        </div>
      );
    }

    // Array of strings/enums
    if (Array.isArray(value)) {
      return (
        <div key={key}>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{key}</label>
          <input
            type="text"
            value={value.join(', ')}
            onChange={(e) => handleChange(key, e.target.value.split(',').map(s => s.trim()))}
            className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
          />
        </div>
      );
    }

    // Color picker
    if (typeof value === 'string' && value.startsWith('#')) {
      return (
        <div key={key}>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{key}</label>
          <div className="flex gap-2 mt-1">
            <input
              type="color"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      );
    }

    // Enum for transitionType
    if (key === 'transitionType') {
      return (
        <div key={key}>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{key}</label>
          <select
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
          >
            {['slide', 'fade', 'wipe', 'flip'].map(opt => (
              <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    // Default text input
    return (
      <div key={key}>
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{key}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Props Editor</h3>
        <span className="text-xs text-gray-500">{compositionId}</span>
      </div>
      <div className="space-y-3">
        {Object.entries(props).map(([key, value]) => renderField(key, value))}
      </div>
    </div>
  );
}
