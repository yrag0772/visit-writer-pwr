import React from 'react';
import { ChildStatus, initialChildStatus } from '../types';
import { InputField, SelectField, MultiSelectField, TextAreaField } from './FormElements';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface ChildStatusFormProps {
  statuses: ChildStatus[];
  onChange: (statuses: ChildStatus[]) => void;
}

export const ChildStatusForm: React.FC<ChildStatusFormProps> = ({ statuses, onChange }) => {
  const addStatus = () => {
    if (statuses.length < 4) {
      onChange([...statuses, { ...initialChildStatus, attendanceStatus: '有送托' }]);
    }
  };

  const removeStatus = (index: number) => {
    onChange(statuses.filter((_, i) => i !== index));
  };

  const updateStatus = (index: number, field: keyof ChildStatus, value: any) => {
    const newStatuses = [...statuses];
    newStatuses[index] = { ...newStatuses[index], [field]: value };
    onChange(newStatuses);
  };

  return (
    <div className="space-y-8">
      {statuses.map((s, index) => (
        <div key={index} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-6 relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">幼兒狀況 {index + 1}</span>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer bg-white px-3 py-1 rounded-full border border-slate-200 hover:border-orange-300 transition-colors">
                <input 
                  type="checkbox" 
                  checked={s.attendanceStatus === '當天幼兒未送托'} 
                  onChange={(e) => updateStatus(index, 'attendanceStatus', e.target.checked ? '當天幼兒未送托' : '有送托')}
                  className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                當天未送托
              </label>
            </div>
            {statuses.length > 1 && (
              <button onClick={() => removeStatus(index)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="幼兒姓名" value={s.name} onChange={(v) => updateStatus(index, 'name', v)} />
            <InputField label="幼兒年齡" value={s.age} onChange={(v) => updateStatus(index, 'age', v)} />
          </div>

          {s.attendanceStatus === '當天幼兒未送托' ? (
            <TextAreaField label="未送托原因說明" value={s.notPresentReason} onChange={(v) => updateStatus(index, 'notPresentReason', v)} placeholder="請輸入原因..." />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <SelectField label="是否為新收托" options={['是', '否']} value={s.isNew} onChange={(v) => updateStatus(index, 'isNew', v)} />
                <SelectField 
                  label="托育型態" 
                  options={['日間托育', '全日托育', '半日托育', '夜間托育', '臨時托育']} 
                  value={s.careType} 
                  onChange={(v) => updateStatus(index, 'careType', v)}
                  allowOther
                  otherValue={s.careTypeOther}
                  onOtherChange={(v) => updateStatus(index, 'careTypeOther', v)}
                />
              </div>

              <div className="space-y-4 p-4 bg-white rounded-xl border border-gray-100">
                <SelectField label="寶寶日誌" options={['有', '無']} value={s.hasLog} onChange={(v) => updateStatus(index, 'hasLog', v)} />
                {s.hasLog === '有' && (
                  <MultiSelectField 
                    label="日誌類型" 
                    options={['書面', '照片', '光碟', '電子檔', 'LINE', '網路媒體（APP）']} 
                    values={s.logTypes} 
                    onChange={(v) => updateStatus(index, 'logTypes', v)}
                    allowOther
                    otherValue={s.logOther}
                    onOtherChange={(v) => updateStatus(index, 'logOther', v)}
                  />
                )}
                {s.hasLog === '無' && (
                  <TextAreaField label="輔導措施" value={s.logGuidance} onChange={(v) => updateStatus(index, 'logGuidance', v)} placeholder="請輸入輔導措施..." />
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4 p-4 bg-white rounded-xl border border-gray-100">
                  <SelectField label="健康狀況" options={['無明顯異常', '異常']} value={s.health} onChange={(v) => updateStatus(index, 'health', v)} />
                  {s.health === '異常' && (
                    <MultiSelectField 
                      label="異常狀況" 
                      options={['感冒', '腸病毒', '腸胃不適', '過敏', '排便狀況不正常']} 
                      values={s.healthIssues} 
                      onChange={(v) => updateStatus(index, 'healthIssues', v)}
                      allowOther
                      otherValue={s.healthOther}
                      onOtherChange={(v) => updateStatus(index, 'healthOther', v)}
                    />
                  )}
                  <TextAreaField label="健康狀況詳細說明" value={s.healthDesc} onChange={(v) => updateStatus(index, 'healthDesc', v)} placeholder="請輸入詳細說明..." />
                </div>
                <div className="space-y-4 p-4 bg-white rounded-xl border border-gray-100">
                  <SelectField label="精神狀況" options={['精力旺盛', '精神佳', '普通', '異常']} value={s.spirit} onChange={(v) => updateStatus(index, 'spirit', v)} />
                  {s.spirit === '異常' && (
                    <MultiSelectField 
                      label="異常狀況" 
                      options={['無精打采', '營養不良']} 
                      values={s.spiritIssues} 
                      onChange={(v) => updateStatus(index, 'spiritIssues', v)}
                      allowOther
                      otherValue={s.spiritOther}
                      onOtherChange={(v) => updateStatus(index, 'spiritOther', v)}
                    />
                  )}
                  <TextAreaField label="精神狀況詳細說明" value={s.spiritDesc} onChange={(v) => updateStatus(index, 'spiritDesc', v)} placeholder="請輸入詳細說明..." />
                </div>
              </div>

              <div className="space-y-4 p-4 bg-white rounded-xl border border-gray-100">
                <SelectField label="身體外觀" options={['無明顯異常', '異常']} value={s.appearance} onChange={(v) => updateStatus(index, 'appearance', v)} />
                {s.appearance === '異常' && (
                  <>
                    <MultiSelectField 
                      label="異常狀況" 
                      options={[
                        '瘀青', '抓傷或擦傷', '頭眼腹外傷', 
                        '體重過輕或與身高不成比例，不符合兒童生長發展曲線',
                        '身體重要部位如：頭、腦、頸部、耳朵、軀幹，出現不尋常傷痕，或新舊傷夾雜',
                        '兒童經常性或反覆受傷', '收傷應就醫而未就醫', '穿著不合身或不合時令',
                        '不願與他人互動、恐懼、退縮、焦慮', '精神恍惚、缺少微笑、沈默、沒有情緒表現',
                        '表情木然或不悅、自傷行為、搖晃身體'
                      ]} 
                      values={s.appearanceIssues} 
                      onChange={(v) => updateStatus(index, 'appearanceIssues', v)}
                      allowOther
                      otherValue={s.appearanceOther}
                      onOtherChange={(v) => updateStatus(index, 'appearanceOther', v)}
                    />
                    <TextAreaField label="異常說明" value={s.appearanceDesc} onChange={(v) => updateStatus(index, 'appearanceDesc', v)} />
                  </>
                )}
                <TextAreaField label="身體外觀詳細說明" value={s.appearanceDetail} onChange={(v) => updateStatus(index, 'appearanceDetail', v)} placeholder="請輸入詳細說明..." />
              </div>

              <div className="space-y-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  睡眠安全確認
                </h4>
                <MultiSelectField 
                  label="睡眠情形" 
                  options={['安穩', '易醒', '睡眠時間短', '淺眠', '趴睡（已提醒1歲以下幼兒趴睡有風險，並提醒五招安心睡）']} 
                  values={s.sleepStatus} 
                  onChange={(v) => updateStatus(index, 'sleepStatus', v)}
                  allowOther
                  otherValue={s.sleepStatusOther}
                  onOtherChange={(v) => updateStatus(index, 'sleepStatusOther', v)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <SelectField 
                      label="睡姿" 
                      options={['仰睡', '自由睡姿', '一歲以下幼兒非仰睡']} 
                      value={s.sleepPosture} 
                      onChange={(v) => updateStatus(index, 'sleepPosture', v)} 
                      allowOther
                      otherValue={s.sleepPostureOther}
                      onOtherChange={(v) => updateStatus(index, 'sleepPostureOther', v)}
                    />
                    {s.sleepPosture === '一歲以下幼兒非仰睡' && (
                      <TextAreaField 
                        label="輔導說明 (一歲以下應仰睡)" 
                        value={s.sleepNonBackGuidance} 
                        onChange={(v) => updateStatus(index, 'sleepNonBackGuidance', v)} 
                        placeholder="請輸入輔導措施..."
                      />
                    )}
                  </div>
                  <InputField label="睡眠時間" value={s.sleepTime} onChange={(v) => updateStatus(index, 'sleepTime', v)} />
                  <InputField label="睡眠區域" value={s.sleepArea} onChange={(v) => updateStatus(index, 'sleepArea', v)} hint="客廳？房間？嬰兒床？..." />
                  <InputField label="睡眠與情緒安撫" value={s.sleepSoothing} onChange={(v) => updateStatus(index, 'sleepSoothing', v)} hint="奶嘴？需抱？夜奶？" />
                </div>
              </div>

              <div className="space-y-4 p-4 bg-green-50/50 rounded-xl border border-green-100">
                <h4 className="text-sm font-bold text-green-800">清潔盥洗</h4>
                <div className="grid grid-cols-3 gap-4">
                  <InputField label="換尿布頻率" value={s.diaperFreq} onChange={(v) => updateStatus(index, 'diaperFreq', v)} />
                  <InputField label="洗澡、清洗屁屁" value={s.bathCleaning} onChange={(v) => updateStatus(index, 'bathCleaning', v)} hint="多位托兒時如何安排" />
                  <InputField label="是否如廁練習" value={s.toiletTraining} onChange={(v) => updateStatus(index, 'toiletTraining', v)} hint="托兒已能如廁前表達" />
                </div>
                <InputField label="清潔盥洗其他說明" value={s.cleaningOther} onChange={(v) => updateStatus(index, 'cleaningOther', v)} />
              </div>

              <div className="space-y-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <SelectField 
                  label="督導托育人員施作發展檢核" 
                  options={['正常', '異常', '未滿3個月14天，無法施作', '本階段已施作']} 
                  value={s.devCheck} 
                  onChange={(v) => updateStatus(index, 'devCheck', v)}
                  allowOther
                  otherValue={s.devCheckOther}
                  onOtherChange={(v) => updateStatus(index, 'devCheckOther', v)}
                />
                
                <div className="space-y-4">
                  <TextAreaField label="發展狀況描述" value={s.devDesc} onChange={(v) => updateStatus(index, 'devDesc', v)} />
                  
                  {['正常', '異常', '本階段已施作', '其他'].includes(s.devCheck === '其他' ? '其他' : s.devCheck) && (
                    <InputField label="目前為發展階段第幾階" value={s.devStage} onChange={(v) => updateStatus(index, 'devStage', v)} />
                  )}

                  {s.devCheck === '異常' && (
                    <div className="space-y-4 pt-2 border-t border-purple-200">
                      <div className="grid grid-cols-2 gap-4">
                        <SelectField label="異常通報" options={['已通報', '未通報']} value={s.devReport} onChange={(v) => updateStatus(index, 'devReport', v)} />
                        {s.devReport === '已通報' && (
                          <InputField label="通報時間" value={s.devReportTime} onChange={(v) => updateStatus(index, 'devReportTime', v)} />
                        )}
                        {s.devReport === '未通報' && (
                          <InputField label="未通報原因" value={s.devReportReason} onChange={(v) => updateStatus(index, 'devReportReason', v)} />
                        )}
                      </div>
                    </div>
                  )}

                  {s.devCheck === '本階段已施作' && (
                    <InputField label="先前施作日期" value={s.devPrevDate} onChange={(v) => updateStatus(index, 'devPrevDate', v)} type="date" />
                  )}
                </div>
              </div>

              <div className="space-y-4 p-4 bg-yellow-50/50 rounded-xl border border-yellow-100">
                <h4 className="text-sm font-bold text-yellow-800">幼兒飲食</h4>
                <MultiSelectField 
                  label="餐食型態" 
                  options={['母奶', '配方奶', '副食品（流質-泥狀）', '副食品（流質-糊狀）', '副食品（半固體-粥、燉飯）', '副食品（固體-飯）']} 
                  values={s.dietTypes} 
                  onChange={(v) => updateStatus(index, 'dietTypes', v)}
                  allowOther
                  otherValue={s.dietTypesOther}
                  onOtherChange={(v) => updateStatus(index, 'dietTypesOther', v)}
                />
                <InputField label="餐點內容" value={s.dietContent} onChange={(v) => updateStatus(index, 'dietContent', v)} hint="例如蔬菜、魚、肉、蛋等" />
                <MultiSelectField 
                  label="飲食狀況" 
                  options={['在固定位置用餐', '把食物吃光', '會自己進食（可用手）', '會使用餐具', '沒有偏食', '願意嘗試新食物', '用杯子喝水或奶', '托育人員餵食，狀況正常']} 
                  values={s.dietStatus} 
                  onChange={(v) => updateStatus(index, 'dietStatus', v)}
                  allowOther
                  otherValue={s.dietStatusOther}
                  onOtherChange={(v) => updateStatus(index, 'dietStatusOther', v)}
                />
                <TextAreaField label="飲食狀況描述" value={s.dietDesc} onChange={(v) => updateStatus(index, 'dietDesc', v)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 p-4 bg-white rounded-xl border border-gray-100">
                  <SelectField 
                    label="幼兒與托育人員互動情形" 
                    options={['良好', '異常']} 
                    value={s.interaction} 
                    onChange={(v) => updateStatus(index, 'interaction', v)} 
                    allowOther
                    otherValue={s.interactionOther}
                    onOtherChange={(v) => updateStatus(index, 'interactionOther', v)}
                  />
                  <TextAreaField label="互動情況說明" value={s.interactionDesc} onChange={(v) => updateStatus(index, 'interactionDesc', v)} />
                </div>
                <TextAreaField label="其他描述" value={s.otherDesc} onChange={(v) => updateStatus(index, 'otherDesc', v)} />
              </div>

              {s.isNew === '是' && (
                <div className="space-y-4 p-4 bg-pink-50/50 rounded-xl border border-pink-100">
                  <h4 className="text-sm font-bold text-pink-800">新收托幼兒專區</h4>
                  <TextAreaField label="適應狀況" value={s.adaptStatus} onChange={(v) => updateStatus(index, 'adaptStatus', v)} />
                  <TextAreaField label="保親溝通狀況" value={s.parentComm} onChange={(v) => updateStatus(index, 'parentComm', v)} />
                  <TextAreaField label="加入對其他幼兒的影響" value={s.peerImpact} onChange={(v) => updateStatus(index, 'peerImpact', v)} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      {statuses.length < 4 && (
        <button 
          onClick={addStatus}
          className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-all flex items-center justify-center gap-2 font-bold"
        >
          <Plus className="w-5 h-5" />
          新增幼兒狀況紀錄 (最多 4 位)
        </button>
      )}
    </div>
  );
};
