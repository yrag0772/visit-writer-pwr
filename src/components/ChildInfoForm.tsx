import React from 'react';
import { ChildInfo, initialChildInfo } from '../types';
import { InputField } from './FormElements';
import { Plus, Trash2 } from 'lucide-react';

interface ChildInfoFormProps {
  children: ChildInfo[];
  onChange: (children: ChildInfo[]) => void;
}

export const ChildInfoForm: React.FC<ChildInfoFormProps> = ({ children, onChange }) => {
  const addChild = () => {
    if (children.length < 4) {
      onChange([...children, { ...initialChildInfo }]);
    }
  };

  const removeChild = (index: number) => {
    onChange(children.filter((_, i) => i !== index));
  };

  const updateChild = (index: number, field: keyof ChildInfo, value: string) => {
    const newChildren = [...children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    onChange(newChildren);
  };

  return (
    <div className="space-y-6">
      {children.map((child, index) => (
        <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4 relative group">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">幼兒 {index + 1}</span>
            {children.length > 1 && (
              <button 
                onClick={() => removeChild(index)}
                className="text-red-400 hover:text-red-600 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="幼兒姓名" value={child.name} onChange={(v) => updateChild(index, 'name', v)} />
            <InputField label="幼兒狀態" value={child.status} onChange={(v) => updateChild(index, 'status', v)} placeholder="例如：收托中" />
            <InputField label="身分證字號" value={child.idNumber} onChange={(v) => updateChild(index, 'idNumber', v)} />
            <InputField label="出生年月日" value={child.birthday} onChange={(v) => updateChild(index, 'birthday', v)} type="date" />
            <InputField label="托育起始日" value={child.startDate} onChange={(v) => updateChild(index, 'startDate', v)} type="date" className="col-span-2" />
          </div>
        </div>
      ))}
      {children.length < 4 && (
        <button 
          onClick={addChild}
          className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2 font-bold text-sm"
        >
          <Plus className="w-4 h-4" />
          新增幼兒資料 (最多 4 位)
        </button>
      )}
    </div>
  );
};
