import React, { useState, useEffect, useRef } from 'react';
import { 
  ClipboardCheck, 
  FileText, 
  Download, 
  Upload,
  Save,
  User,
  Calendar,
  Settings,
  CheckCircle2,
  Copy,
  Check,
  Home,
  Users,
  ShieldCheck,
  Heart,
  MessageSquare,
  Info,
  AlertCircle,
  Plus,
  X,
  List,
  ArrowUpRight,
  RefreshCw,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { VisitRecord, initialRecord, ServiceType, VisitMethod, VisitCategory, CheckResult, YesNo, NormalAbnormal } from './types';
import { ENV_SAFETY_INDICATORS, QUALITY_ASSESSMENT_INDICATORS, FOUR_CHILD_CHECK_INDICATORS } from './constants';
import { FormSection, InputField, SelectField, MultiSelectField, TextAreaField } from './components/FormElements';
import { ChildInfoForm } from './components/ChildInfoForm';
import { ChildStatusForm } from './components/ChildStatusForm';
import { generateVisitReport } from './utils/reportGenerator';
import { PrepData, defaultPrepData, generatePrepReport, prepSectionsList } from './utils/prepReportGenerator';

export default function App() {
  const [records, setRecords] = useState<VisitRecord[]>([{ ...initialRecord }]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isOutlineOpen, setIsOutlineOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState<'record' | 'prep'>('record');
  const [prepData, setPrepData] = useState<PrepData>(defaultPrepData);
  const [prepContent, setPrepContent] = useState<string>('');
  const record = records[activeTabIndex] || initialRecord;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('visit_records');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Robustness: Merge each saved record with initialRecord to ensure new fields are present
          const migratedRecords = parsed.map(r => ({
            ...initialRecord,
            ...r
          }));
          setRecords(migratedRecords);
        }
      } catch (e) {
        console.error('Failed to load records from localStorage', e);
      }
    }
  }, []);

  // Save to localStorage when records change
  useEffect(() => {
    localStorage.setItem('visit_records', JSON.stringify(records));
  }, [records]);

  const [copied, setCopied] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'provider': true,
    'visit': true,
    'children': true,
    'type': true,
    'prevFollowUp': true,
    'currentVisitFocus': true,
    'check': true,
    'match': true,
    'statusDesc': true,
    'childStatus': true,
    'env': true,
    'quality': true,
    'interaction': true,
    'relationship': true,
    'providerStatus': true,
    'emergency': true,
    'pending': true,
    'suggested': true,
    'safety': true,
    'general': true,
    'supervisor': true,
    'attitude': true,
    'needs': true,
    'field': true,
    'guidanceAttitude': true,
    'guidanceNeeds': true,
    'nextFocus': true,
    'violation': true,
    'review': true
  });
  const editorRef = useRef<HTMLDivElement>(null);

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Sync logic: Generate the "Word" content based on left-side inputs
  useEffect(() => {
    if (autoSync) {
      const content = generateVisitReport(record);
      updateField('fullContent', content);
    }
  }, [autoSync, record.providerName, record.providerNo, record.providerId, record.visitMethod, record.visitMethodOther, record.visitDate, record.visitTime, record.visitorName, record.hasChildren, record.children, record.serviceType, record.visitCategories, record.initialVisitCount, record.newChildName, record.reinforceReason, record.annualVisitCount, record.currentVisitCount, record.visitCountDesc, record.isJoint, record.jointProvider1Name, record.jointProvider1Children, record.jointProvider2Name, record.jointProvider2Children, record.prevFollowUp, record.currentVisitFocus, record.unitName, record.subsidyChildCount, record.subsidyChildNames, record.hasNoSubsidyChild, record.noSubsidyInfo, record.actualChildCount, record.siteCheckResult, record.siteCheckReason, record.feeCheckResult, record.feeCheckReason, record.feeDetails, record.matchNeeds, record.visitStatusDesc, record.childEnrollmentStatus, record.childStatuses, record.envCheckResult, record.envCheckReason, record.envFacilities, record.envFacilitiesOther, record.envComfort, record.envComfortOther, record.noSmokingResult, record.noSmokingDesc, record.envDesc, record.envCheckItems, record.routineCheck, record.routineDesc, record.routineOther, record.activities, record.activitiesOther, record.mealPrep, record.mealPrepOther, record.dietQuality, record.dietQualityDesc, record.dietQualityOther, record.mealSpace, record.mealSpaceDesc, record.mealSpaceOther, record.mealWay, record.mealWayDesc, record.mealWayOther, record.mealCleanProcess, record.childCleanAfterMeal, record.toyClean, record.toyCleanOther, record.toyCleanDesc, record.envClean, record.envCleanOther, record.envCleanDesc, record.qualityDesc, record.qualityCheckResult, record.qualityCheckItems, record.qualityCheckReason, record.fourChildCheckResult, record.fourChildCheckItems, record.fourChildCheckReason, record.gameInteraction, record.gameInteractionDesc, record.positiveResponse, record.positiveResponseDesc, record.socialDevSupport, record.socialDevSupportDesc, record.otherInteractionObs, record.dailyHandover, record.parentCooperation, record.providerHealthSelf, record.visitorEval, record.visitorEvalReasons, record.visitorEvalOther, record.familyHealth, record.familyHealthReason, record.familyHealthDesc, record.familySupport, record.familySupportDesc, record.workImpactFamily, record.workImpactFamilyDesc, record.hasEmergencyDrill, record.emergencyDrill, record.emergencyDrillDesc, record.hasPendingFollowUp, record.pendingFollowUp, record.suggestedGuidance, record.safetyPropaganda, record.safetyPropagandaOther, record.generalPropaganda, record.generalPropagandaOther, record.providerAttitude, record.serviceNeeds, record.fieldGuidanceRecord, record.nextFollowUpFocus, record.isViolation, record.reviewResultDesc]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (viewMode === 'prep') {
      setPrepContent(generatePrepReport(prepData));
    }
  }, [viewMode, prepData]);

  const updatePrepData = (section: string, field: 'enabled' | 'notes', value: any) => {
    setPrepData(prev => {
      const sectionData = prev.sections[section] || { enabled: true, notes: '' };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [section]: {
            ...sectionData,
            [field]: value
          }
        }
      };
    });
  };

  // Track active section on scroll
  useEffect(() => {
    const sections = viewMode === 'record' ? [
      "一、托育人員資料", "二、訪視資料", "三、托育狀況", "四、訪視類型", 
      "五、前次輔導追蹤", "六、本次訪視重點", "七、托育查核", "八、媒合需求", 
      "九、訪視狀況簡述", "十、收托幼兒狀況", "十一、托育環境", "十二、托育品質", 
      "十三、托育人員與托兒間互動與社會行為", "十四、保親關係", "十五、托育人員現況", 
      "十六、緊急事件演練與抽問", "十七、待追蹤、改善事項", "十八、建議輔導事項", 
      "十九、托育安全宣導事項", "二十、宣導事項", "二十一、現場輔導紀錄", 
      "二十二、針對建議輔導後托育人員態度", "二十三、托育人員反映需求/建議", "二十四、下次輔導重點", 
      "二十5、是否違反考核項目" // Typo in original code maybe? Wait, let's just make it match the other array
    ] : [
      "一、基本資料", "二、收托兒童基本資料", "四、訪視類型", "五、訪視重點", 
      "六、單位訪查紀錄", "七、訪視查核及評估", "八、托育品質與互動狀況", "九、托育人員現況", "十、宣導事項及建議"
    ];

    // Correcting typo just in case
    sections[sections.indexOf("二十5、是否違反考核項目")] = "二十五、是否違反考核項目"; // Though indexOf returns -1 if not found which we must protect against
    const targetSections = sections.map(s => s === "二十5、是否違反考核項目" ? "二十五、是否違反考核項目" : s);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-10% 0px -70% 0px' }
    );

    targetSections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeTabIndex, viewMode]);

  // Use a separate effect to update the editor DOM when fullContent changes
  useEffect(() => {
    if (editorRef.current) {
      const targetContent = viewMode === 'prep' ? prepContent : record.fullContent;
      if (editorRef.current.innerHTML !== targetContent) {
        editorRef.current.innerHTML = targetContent;
      }
    }
  }, [record.fullContent, prepContent, viewMode]);

  const updateField = (field: keyof VisitRecord, value: any) => {
    setRecords(prev => {
      const newRecords = [...prev];
      newRecords[activeTabIndex] = { ...newRecords[activeTabIndex], [field]: value };
      return newRecords;
    });
  };

  const addTab = () => {
    setRecords(prev => [...prev, { ...initialRecord, visitDate: new Date().toISOString().split('T')[0] }]);
    setActiveTabIndex(records.length);
  };

  const removeTab = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (records.length === 1) return;
    setRecords(prev => prev.filter((_, i) => i !== index));
    if (activeTabIndex >= index && activeTabIndex > 0) {
      setActiveTabIndex(activeTabIndex - 1);
    }
  };

  const exportSection = (keys: (keyof VisitRecord)[], title: string) => {
    const dataObj: any = {};
    keys.forEach(key => {
      dataObj[key] = record[key];
    });
    const data = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const now = new Date();
    const timestamp = now.getFullYear() + 
      String(now.getMonth() + 1).padStart(2, '0') + 
      String(now.getDate()).padStart(2, '0') + 
      String(now.getHours()).padStart(2, '0') + 
      String(now.getMinutes()).padStart(2, '0');
    
    link.href = url;
    link.download = `${record.providerName || '未命名'}_${title}_${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSection = (keys: (keyof VisitRecord)[]) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setRecords(prev => {
            const newRecords = [...prev];
            const currentRecord = { ...newRecords[activeTabIndex] };
            keys.forEach(key => {
              if (json[key] !== undefined) {
                (currentRecord as any)[key] = json[key];
              }
            });
            newRecords[activeTabIndex] = currentRecord;
            return newRecords;
          });
          // Reset input value to allow uploading the same file again
          e.target.value = '';
        } catch (err) {
          alert('匯入失敗，請檢查檔案格式。');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const clearSection = (keys: (keyof VisitRecord)[], title: string) => {
    if (window.confirm(`確定要清空「${title}」區塊的資料嗎？此動作無法復原。`)) {
      setRecords(prev => {
        const newRecords = [...prev];
        const currentRecord = { ...newRecords[activeTabIndex] };
        keys.forEach(key => {
          // Deep clone or fresh copy for arrays/objects
          const initialValue = initialRecord[key];
          if (Array.isArray(initialValue)) {
            (currentRecord as any)[key] = JSON.parse(JSON.stringify(initialValue));
          } else if (typeof initialValue === 'object' && initialValue !== null) {
            (currentRecord as any)[key] = JSON.parse(JSON.stringify(initialValue));
          } else {
            (currentRecord as any)[key] = initialValue;
          }
        });
        newRecords[activeTabIndex] = currentRecord;
        return newRecords;
      });
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      if (newContent !== record.fullContent) {
        updateField('fullContent', newContent);
      }
    }
  };

  const forceSync = () => {
    if (window.confirm('確定要執行手動同步嗎？這將會根據左側輸入內容重新生成右側預覽。')) {
      const content = generateVisitReport(record);
      updateField('fullContent', content);
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
      }
    }
  };

  const exportIndividualRecord = () => {
    const data = JSON.stringify(record, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const now = new Date();
    const timestamp = now.getFullYear() + 
      String(now.getMonth() + 1).padStart(2, '0') + 
      String(now.getDate()).padStart(2, '0') + "_" +
      String(now.getHours()).padStart(2, '0') + 
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    link.href = url;
    link.download = `撰寫紀錄_${record.providerName || '未命名'}_${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importIndividualRecord = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Robustness: Merge with initialRecord
        const migrated = { ...initialRecord, ...json };
        setRecords(prev => {
          const newRecords = [...prev];
          newRecords[activeTabIndex] = migrated;
          return newRecords;
        });
        alert('個別紀錄匯入成功！');
      } catch (err) {
        alert('讀取檔案失敗，請確保檔案格式正確。');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const getSectionStatus = (title: string) => {
    let isFilled = false;
    let hasIssues = false;

    switch (title) {
      case "一、托育人員資料":
        isFilled = !!(record.providerName || record.providerNo || record.providerId);
        break;
      case "二、訪視資料":
        isFilled = !!(record.visitMethod || record.visitorName);
        break;
      case "三、托育狀況":
        isFilled = !!(record.hasChildren);
        break;
      case "四、訪視類型":
        isFilled = !!(record.serviceType || record.visitCategories.length > 0);
        break;
      case "五、前次輔導追蹤":
        isFilled = !!record.prevFollowUp;
        break;
      case "六、本次訪視重點":
        isFilled = !!record.currentVisitFocus;
        break;
      case "七、托育查核":
        isFilled = !!(record.unitName || record.subsidyChildCount || record.siteCheckResult);
        hasIssues = record.siteCheckResult === '不符合' || record.feeCheckResult === '否';
        break;
      case "八、媒合需求":
        isFilled = !!record.matchNeeds;
        break;
      case "九、訪視狀況簡述":
        isFilled = !!record.visitStatusDesc;
        break;
      case "十、收托幼兒狀況":
        isFilled = !!record.childEnrollmentStatus;
        hasIssues = record.childStatuses.some(s => s.health === '異常' || s.spirit === '異常' || s.appearance === '異常' || s.devCheck === '異常');
        break;
      case "十一、托育環境":
        isFilled = !!(record.envCheckResult || record.envCheckReason || record.envFacilities.length > 0 || record.envComfort.length > 0 || record.noSmokingResult || record.envDesc);
        hasIssues = record.envCheckResult === '不符合' || record.noSmokingResult === '不符合' || (record.envCheckItems && record.envCheckItems.length > 0);
        break;
      case "十二、托育品質":
        isFilled = !!(record.routineCheck || record.qualityCheckResult || record.fourChildCheckResult || record.activities.length > 0 || record.mealPrep.length > 0 || record.dietQuality || record.mealSpace || record.mealWay || record.toyClean || record.envClean);
        hasIssues = record.routineCheck === '不符合' || record.dietQuality === '不符合' || record.mealSpace === '不符合' || record.mealWay === '不符合' || record.qualityCheckResult === '不符合' || record.fourChildCheckResult === '不符合';
        break;
      case "十三、托育人員與托兒間互動與社會行為":
        isFilled = !!(record.gameInteraction || record.positiveResponse || record.socialDevSupport || record.otherInteractionObs);
        hasIssues = record.gameInteraction === '否' || record.positiveResponse === '否' || record.socialDevSupport === '否';
        break;
      case "十四、保親關係":
        isFilled = !!(record.dailyHandover || record.parentCooperation);
        break;
      case "十五、托育人員現況":
        isFilled = !!(record.providerHealthSelf || record.visitorEval || record.familyHealth || record.familySupport || record.workImpactFamily);
        hasIssues = record.visitorEval === '異常' || record.familyHealth === '不佳' || record.familySupport === '否' || record.workImpactFamily === '是';
        break;
      case "十六、緊急事件演練與抽問":
        isFilled = !!(record.hasEmergencyDrill || record.emergencyDrillDesc);
        hasIssues = record.hasEmergencyDrill === '無';
        break;
      case "十七、待追蹤、改善事項":
        isFilled = !!(record.hasPendingFollowUp || record.pendingFollowUp);
        break;
      case "十八、建議輔導事項":
        isFilled = !!record.suggestedGuidance;
        break;
      case "十九、托育安全宣導事項":
        isFilled = record.safetyPropaganda.length > 0;
        break;
      case "二十、宣導事項":
        isFilled = record.generalPropaganda.length > 0;
        break;
      case "二十一、現場輔導紀錄":
        isFilled = !!record.fieldGuidanceRecord;
        break;
      case "二十二、針對建議輔導後托育人員態度":
        isFilled = !!record.providerAttitude;
        break;
      case "二十三、托育人員反映需求/建議":
        isFilled = !!record.serviceNeeds;
        break;
      case "二十四、下次輔導重點":
        isFilled = !!record.nextFollowUpFocus;
        break;
      case "二十五、是否違反考核項目":
        isFilled = !!record.isViolation;
        hasIssues = record.isViolation === '是';
        break;
    }

    return { isFilled, hasIssues };
  };

  const scrollToSection = (title: string) => {
    const id = title;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Also scroll the Word preview if possible
    if (editorRef.current) {
      const headers = editorRef.current.querySelectorAll('h3');
      for (const h of Array.from(headers) as HTMLElement[]) {
        if (h.textContent?.includes(title.split('、')[0])) {
          h.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        }
      }
    }
  };

  const SectionActions = ({ sectionKeys, title }: { sectionKeys: (keyof VisitRecord)[], title: string }) => (
    <div className="flex items-center gap-1">
      <button 
        onClick={(e) => { e.stopPropagation(); exportSection(sectionKeys, title); }}
        className="p-1.5 text-slate-400 hover:text-brand hover:bg-brand-light rounded-lg transition-all group/btn relative"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
          下載「{title}」
        </span>
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); importSection(sectionKeys); }}
        className="p-1.5 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all group/btn relative"
      >
        <Upload className="w-3.5 h-3.5" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
          上傳「{title}」
        </span>
      </button>
    </div>
  );

  const copyToClipboard = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportToWord = () => {
    const content = viewMode === 'prep' ? prepContent : record.fullContent;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    const now = new Date();
    const timestamp = now.getFullYear() + 
      String(now.getMonth() + 1).padStart(2, '0') + 
      String(now.getDate()).padStart(2, '0') + 
      String(now.getHours()).padStart(2, '0') + 
      String(now.getMinutes()).padStart(2, '0');

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileLink = document.createElement("a");
    document.body.appendChild(fileLink);
    fileLink.href = source;
    
    // Optimized filename: Category_ProviderName_Timestamp.doc
    const category = viewMode === 'prep' ? '訪視準備' : (record.visitCategories.length > 0 ? record.visitCategories[0] : '訪視紀錄');
    const fileName = `${category}_${record.providerName || '未命名'}_${timestamp}.doc`;
    
    fileLink.download = fileName;
    fileLink.click();
    document.body.removeChild(fileLink);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-brand p-2 rounded-xl shadow-brand-light shadow-lg">
              <ClipboardCheck className="text-white w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight text-slate-800">居家托育訪視紀錄撰寫器</h1>
              <div className="text-[10px] text-brand font-bold uppercase tracking-widest mt-0.5">
                {currentTime.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })} 
                ({currentTime.toLocaleDateString('zh-TW', { weekday: 'short' })}) 
                {currentTime.toLocaleTimeString('zh-TW', { hour12: false })}
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {records.map((r, i) => (
              <button
                key={i}
                onClick={() => setActiveTabIndex(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTabIndex === i 
                  ? 'bg-white text-brand shadow-sm' 
                  : 'text-slate-500 hover:bg-white/50'
                }`}
              >
                <FileText className="w-3 h-3" />
                {r.providerName || `紀錄 ${i + 1}`}
                {records.length > 1 && (
                  <X 
                    className="w-3 h-3 hover:text-red-500 transition-colors" 
                    onClick={(e) => removeTab(i, e)}
                  />
                )}
              </button>
            ))}
            <button 
              onClick={addTab}
              className="p-1.5 text-slate-400 hover:text-brand hover:bg-white rounded-lg transition-all"
              title="新增紀錄"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('record')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all rounded-lg ${viewMode === 'record' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FileText className="w-4 h-4" />
              紀錄撰寫
            </button>
            <button
              onClick={() => setViewMode('prep')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all rounded-lg ${viewMode === 'prep' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ClipboardCheck className="w-4 h-4" />
              訪視準備
            </button>
          </div>
          
          {viewMode === 'record' && (
            <>
              <div className="w-px h-6 bg-slate-200 mx-1" />
              {/* Individual Record Group */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={exportIndividualRecord}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-brand hover:bg-white rounded-lg transition-all"
                  title="儲存目前這份紀錄 (JSON)"
                >
                  <Save className="w-3.5 h-3.5" />
                  儲存個別紀錄
                </button>
                <label className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-brand hover:bg-white rounded-lg transition-all cursor-pointer" title="匯入單份紀錄檔案">
                  <Upload className="w-3.5 h-3.5" />
                  匯入個別紀錄
                  <input type="file" accept=".json" onChange={importIndividualRecord} className="hidden" />
                </label>
              </div>
            </>
          )}

          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? '已複製' : '複製文字'}
          </button>
          <button 
            onClick={exportToWord}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-brand hover:bg-brand-hover rounded-xl transition-all shadow-md shadow-brand-light cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            匯出 Word
          </button>
        </div>
      </header>

      <main className="flex h-[calc(100vh-64px)] overflow-hidden relative">
            {/* Outline Sidebar */}
            <aside className={`${isOutlineOpen ? 'w-64' : 'w-12'} border-r border-slate-200 bg-white transition-all duration-300 flex flex-col relative group`}>
              <button 
                onClick={() => setIsOutlineOpen(!isOutlineOpen)}
                className="absolute -right-3 top-4 bg-white border border-slate-200 rounded-full p-1 shadow-sm z-50 hover:bg-slate-50 transition-colors"
              >
                {isOutlineOpen ? <ChevronLeft className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
              </button>
    
              <div className={`flex items-center gap-2 p-4 border-b border-slate-50 ${!isOutlineOpen && 'justify-center'}`}>
                <List className="w-4 h-4 text-brand shrink-0" />
                {isOutlineOpen && <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider truncate">內容大綱</h3>}
              </div>
              
              <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                {(viewMode === 'record' ? [
                  "一、托育人員資料", "二、訪視資料", "三、托育狀況", "四、訪視類型", 
                  "五、前次輔導追蹤", "六、本次訪視重點", "七、托育查核", "八、媒合需求", 
                  "九、訪視狀況簡述", "十、收托幼兒狀況", "十一、托育環境", "十二、托育品質", 
                  "十三、托育人員與托兒間互動與社會行為", "十四、保親關係", "十五、托育人員現況", 
                  "十六、緊急事件演練與抽問", "十七、待追蹤、改善事項", "十八、建議輔導事項", 
                  "十九、托育安全宣導事項", "二十、宣導事項", "二十一、現場輔導紀錄", 
                  "二十二、針對建議輔導後托育人員態度", "二十三、托育人員反映需求/建議", "二十四、下次輔導重點", 
                  "二十五、是否違反考核項目"
                ] : prepSectionsList).map((title) => {
                  const { isFilled, hasIssues } = viewMode === 'record' ? getSectionStatus(title) : { isFilled: true, hasIssues: false };
                  return (
                    <button
                      key={title}
                      onClick={() => scrollToSection(title)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between group ${!isOutlineOpen && 'justify-center'} ${
                        activeSection === title 
                        ? 'bg-brand-light text-brand font-bold' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-brand'
                      }`}
                      title={!isOutlineOpen ? title : ''}
                    >
                      {isOutlineOpen ? (
                        <>
                          <div className="flex items-center gap-2 truncate">
                            {isFilled && <Check className="w-3 h-3 text-green-500 shrink-0" />}
                            <span className="truncate">{title}</span>
                            {hasIssues && <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" title="偵測到異常項" />}
                          </div>
                          <ArrowUpRight className={`w-3 h-3 transition-opacity ${activeSection === title ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </>
                      ) : (
                        <div className="relative">
                          <span className={`text-[10px] font-bold ${activeSection === title ? 'text-brand' : ''}`}>{title.split('、')[0]}</span>
                          {hasIssues && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />}
                          {isFilled && !hasIssues && <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-green-500 rounded-full" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>

        {/* Left Side: Input Form */}
        <section className="flex-1 border-r border-slate-200 bg-slate-50/50 overflow-y-auto p-6 shadow-inner" id="scroll-container">
          <div className="max-w-2xl mx-auto space-y-6 pb-24">
            
            {viewMode === 'prep' ? (
              <>
                {prepSectionsList.map((title) => (
                  <FormSection key={title} title={title} isOpen={true} onToggle={() => {}} id={title}>
                    <div className="space-y-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer bg-indigo-50 p-3 rounded-lg hover:bg-indigo-100 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={prepData.sections[title]?.enabled ?? true} 
                          onChange={(e) => updatePrepData(title, 'enabled', e.target.checked)} 
                          className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className="font-bold text-indigo-900">在報表中顯示此區塊</span>
                      </label>
                      
                      {title === '一、托育人員資料' && (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          <InputField label="姓名" value={prepData.providerName || ''} onChange={(v) => setPrepData(prev => ({ ...prev, providerName: v }))} />
                        </div>
                      )}

                      {title === '三、托育狀況' && (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                          <SelectField 
                            label="收托人數" 
                            options={['1', '2', '3', '4']} 
                            value={String(prepData.childCount)} 
                            onChange={(v) => setPrepData(prev => ({ ...prev, childCount: parseInt(v) }))} 
                          />
                          {Array.from({ length: prepData.childCount }).map((_, i) => (
                            <div key={i} className="space-y-4 border-t border-slate-200 pt-4 mt-4">
                              <h4 className="font-bold text-sm text-slate-700">幼兒 {i + 1}</h4>
                              <InputField label="幼兒姓名" value={prepData.children[i]?.name || ''} onChange={(v) => {
                                const newChildren = [...prepData.children];
                                newChildren[i] = { ...newChildren[i], name: v };
                                setPrepData(prev => ({ ...prev, children: newChildren }));
                              }} />
                              <InputField label="出生年月日" value={prepData.children[i]?.birthday || ''} onChange={(v) => {
                                const newChildren = [...prepData.children];
                                newChildren[i] = { ...newChildren[i], birthday: v };
                                setPrepData(prev => ({ ...prev, children: newChildren }));
                              }} />
                              <InputField label="托育起日" value={prepData.children[i]?.startDate || ''} onChange={(v) => {
                                const newChildren = [...prepData.children];
                                newChildren[i] = { ...newChildren[i], startDate: v };
                                setPrepData(prev => ({ ...prev, children: newChildren }));
                              }} />
                            </div>
                          ))}
                        </div>
                      )}

                      {title === '四、訪視類型' && (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-6">
                          <SelectField label="服務類型" options={['在宅', '到宅']} value={prepData.serviceType} onChange={(v) => setPrepData(prev => ({ ...prev, serviceType: v }))} />
                          <MultiSelectField label="訪視類別" options={['例行訪視', '新收托訪視', '初次訪視', '加強訪視', '實地審查']} values={prepData.visitCategories} onChange={(v) => setPrepData(prev => ({ ...prev, visitCategories: v }))} />
                          
                          {prepData.visitCategories.includes('新收托訪視') && (
                            <InputField label="新收托幼兒姓名" value={prepData.newChildName} onChange={(v) => setPrepData(prev => ({ ...prev, newChildName: v }))} />
                          )}
                          {prepData.visitCategories.includes('初次訪視') && (
                            <InputField label="第幾次初訪" value={prepData.initialVisitCount} onChange={(v) => setPrepData(prev => ({ ...prev, initialVisitCount: v }))} />
                          )}
                          {prepData.visitCategories.includes('加強訪視') && (
                            <InputField label="加強訪視原因" value={prepData.reinforceReason} onChange={(v) => setPrepData(prev => ({ ...prev, reinforceReason: v }))} />
                          )}
                          
                          <div className="grid grid-cols-2 gap-4">
                            <InputField label="年度應訪視次數" value={prepData.annualVisitCount} onChange={(v) => setPrepData(prev => ({ ...prev, annualVisitCount: v }))} />
                            <InputField label="本次為今年次第幾次" value={prepData.currentVisitCount} onChange={(v) => setPrepData(prev => ({ ...prev, currentVisitCount: v }))} />
                          </div>
                          
                          <InputField label="說明" value={prepData.visitCountDesc} onChange={(v) => setPrepData(prev => ({ ...prev, visitCountDesc: v }))} />
                          
                          <SelectField label="是否為聯合收托" options={['是', '否']} value={prepData.isJoint} onChange={(v) => setPrepData(prev => ({ ...prev, isJoint: v }))} />
                          
                          {prepData.isJoint === '是' && (
                            <div className="space-y-4 pt-4 border-t border-slate-200">
                              <div className="grid grid-cols-2 gap-4">
                                <InputField label="聯合收托人1姓名" value={prepData.jointProvider1Name} onChange={(v) => setPrepData(prev => ({ ...prev, jointProvider1Name: v }))} />
                                <InputField label="收托幼兒" value={prepData.jointProvider1Children} onChange={(v) => setPrepData(prev => ({ ...prev, jointProvider1Children: v }))} />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <InputField label="聯合收托人2姓名" value={prepData.jointProvider2Name} onChange={(v) => setPrepData(prev => ({ ...prev, jointProvider2Name: v }))} />
                                <InputField label="收托幼兒" value={prepData.jointProvider2Children} onChange={(v) => setPrepData(prev => ({ ...prev, jointProvider2Children: v }))} />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {title === '七、托育查核' && (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                          <TextAreaField label="申請補助之幼兒人數及姓名、是否有未申請補助者：" value={prepData.subsidyStatus || ''} onChange={(v) => setPrepData(prev => ({ ...prev, subsidyStatus: v }))} />
                          <InputField label="現場親見收托兒童數：" value={prepData.actualChildCountCheck || ''} onChange={(v) => setPrepData(prev => ({ ...prev, actualChildCountCheck: v }))} />
                          <SelectField label="收托數是否符合收托資料：" options={['是', '否']} value={prepData.childCountMatch || '是'} onChange={(v) => setPrepData(prev => ({ ...prev, childCountMatch: v as '是' | '否' }))} />
                          <SelectField label="收費是否與托育契約書一致：" options={['是', '否']} value={prepData.feeMatch || '是'} onChange={(v) => setPrepData(prev => ({ ...prev, feeMatch: v as '是' | '否' }))} />
                          <TextAreaField label="幼兒托育時間及費用" value={prepData.feeDetails || ''} onChange={(v) => setPrepData(prev => ({ ...prev, feeDetails: v }))} />
                        </div>
                      )}

                      <TextAreaField 
                        label="區塊筆記 (在此輸入提醒自己要注意的事項)" 
                        value={prepData.sections[title]?.notes ?? ''} 
                        onChange={(v) => updatePrepData(title, 'notes', v)} 
                      />
                    </div>
                  </FormSection>
                ))}
              </>
            ) : (
              <>
                {/* 一、托育人員資料 */}
                <FormSection title="一、托育人員資料" icon={<User className="w-5 h-5" />} isOpen={openSections['provider']} onToggle={() => toggleSection('provider')} extraActions={<SectionActions sectionKeys={['providerName', 'providerNo', 'providerId']} title="托育人員資料" />}>
              <div className="grid grid-cols-3 gap-4">
                <InputField label="姓名" value={record.providerName} onChange={(v) => updateField('providerName', v)} placeholder="請輸入姓名" />
                <InputField label="編號" value={record.providerNo} onChange={(v) => updateField('providerNo', v)} placeholder="請輸入編號" />
                <InputField label="身分證字號" value={record.providerId} onChange={(v) => updateField('providerId', v)} placeholder="請輸入身分證" />
              </div>
            </FormSection>

            {/* 二、訪視資料 */}
            <FormSection title="二、訪視資料" icon={<Calendar className="w-5 h-5" />} borderColor="border-indigo-500" isOpen={openSections['visit']} onToggle={() => toggleSection('visit')} extraActions={<SectionActions sectionKeys={['visitMethod', 'visitMethodOther', 'visitorName', 'visitDate', 'visitTime']} title="訪視資料" />}>
              <div className="grid grid-cols-2 gap-4">
                <SelectField 
                  label="訪視方式" 
                  options={['電訪', '家訪', '當面協談', '小組活動']} 
                  value={record.visitMethod} 
                  onChange={(v) => updateField('visitMethod', v)}
                  allowOther
                  otherValue={record.visitMethodOther}
                  onOtherChange={(v) => updateField('visitMethodOther', v)}
                />
                <InputField label="訪視員" value={record.visitorName} onChange={(v) => updateField('visitorName', v)} placeholder="請輸入姓名" />
                <InputField label="訪視日期" value={record.visitDate} onChange={(v) => updateField('visitDate', v)} type="date" />
                <InputField label="訪視時間" value={record.visitTime} onChange={(v) => updateField('visitTime', v)} placeholder="例如：14:00-15:30" />
              </div>
            </FormSection>

            {/* 三、托育狀況 */}
            <FormSection title="三、托育狀況" icon={<Users className="w-5 h-5" />} borderColor="border-emerald-500" isOpen={openSections['children']} onToggle={() => toggleSection('children')} extraActions={<SectionActions sectionKeys={['hasChildren', 'children']} title="托育狀況" />}>
              <SelectField label="是否有托兒？" options={['是', '無托兒']} value={record.hasChildren} onChange={(v) => updateField('hasChildren', v)} />
              {record.hasChildren === '是' && (
                <ChildInfoForm children={record.children} onChange={(v) => updateField('children', v)} />
              )}
            </FormSection>

            {/* 四、訪視類型 */}
            <FormSection title="四、訪視類型" icon={<ShieldCheck className="w-5 h-5" />} borderColor="border-cyan-500" isOpen={openSections['type']} onToggle={() => toggleSection('type')} extraActions={<SectionActions sectionKeys={['serviceType', 'visitCategories', 'newChildName', 'initialVisitCount', 'reinforceReason', 'annualVisitCount', 'currentVisitCount', 'visitCountDesc', 'isJoint', 'jointProvider1Name', 'jointProvider1Children', 'jointProvider2Name', 'jointProvider2Children']} title="訪視類型" />}>
              <div className="space-y-6">
                <SelectField label="服務類型" options={['在宅', '到宅']} value={record.serviceType} onChange={(v) => updateField('serviceType', v)} />
                <MultiSelectField label="訪視類別" options={['例行訪視', '新收托訪視', '初次訪視', '加強訪視', '實地審查']} values={record.visitCategories} onChange={(v) => updateField('visitCategories', v)} />
                
                {record.visitCategories.includes('新收托訪視') && (
                  <InputField label="新收托幼兒姓名" value={record.newChildName} onChange={(v) => updateField('newChildName', v)} />
                )}
                {record.visitCategories.includes('初次訪視') && (
                  <InputField 
                    label="第幾次初訪" 
                    type="number"
                    value={record.initialVisitCount} 
                    onChange={(v) => updateField('initialVisitCount', v)} 
                  />
                )}
                {record.visitCategories.includes('加強訪視') && (
                  <TextAreaField label="加強訪視原因" value={record.reinforceReason} onChange={(v) => updateField('reinforceReason', v)} placeholder="請寫明原因或幼兒姓名..." />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="年度應訪視次數" value={record.annualVisitCount} onChange={(v) => updateField('annualVisitCount', v)} type="number" />
                  <InputField label="本次訪視為今年第幾次" value={record.currentVisitCount} onChange={(v) => updateField('currentVisitCount', v)} type="number" />
                </div>
                <InputField label="說明" value={record.visitCountDesc} onChange={(v) => updateField('visitCountDesc', v)} placeholder="訪視次數說明..." />

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="是否為聯合收托？" options={['是', '否']} value={record.isJoint} onChange={(v) => updateField('isJoint', v)} />
                  {record.isJoint === '是' && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <InputField label="托育人員 1 姓名" value={record.jointProvider1Name} onChange={(v) => updateField('jointProvider1Name', v)} />
                      <InputField label="托育人員 1 收托幼兒" value={record.jointProvider1Children} onChange={(v) => updateField('jointProvider1Children', v)} />
                      <InputField label="托育人員 2 姓名" value={record.jointProvider2Name} onChange={(v) => updateField('jointProvider2Name', v)} />
                      <InputField label="托育人員 2 收托幼兒" value={record.jointProvider2Children} onChange={(v) => updateField('jointProvider2Children', v)} />
                    </div>
                  )}
                </div>
              </div>
            </FormSection>

            {/* 五、六 */}
            <FormSection title="五、前次輔導追蹤" icon={<MessageSquare className="w-5 h-5" />} borderColor="border-amber-500" isOpen={openSections['prevFollowUp']} onToggle={() => toggleSection('prevFollowUp')} extraActions={<SectionActions sectionKeys={['prevFollowUp']} title="前次輔導追蹤" />}>
              <TextAreaField label="前次輔導建議事項追蹤與回應" value={record.prevFollowUp} onChange={(v) => updateField('prevFollowUp', v)} />
            </FormSection>
            <FormSection title="六、本次訪視重點" icon={<AlertCircle className="w-5 h-5" />} borderColor="border-red-500" isOpen={openSections['currentVisitFocus']} onToggle={() => toggleSection('currentVisitFocus')} extraActions={<SectionActions sectionKeys={['currentVisitFocus']} title="本次訪視重點" />}>
              <TextAreaField label="本次訪視重點" value={record.currentVisitFocus} onChange={(v) => updateField('currentVisitFocus', v)} />
            </FormSection>

            {/* 七、托育查核 */}
            <FormSection title="七、托育查核" icon={<ShieldCheck className="w-5 h-5" />} borderColor="border-blue-600" isOpen={openSections['check']} onToggle={() => toggleSection('check')} extraActions={<SectionActions sectionKeys={['unitName', 'subsidyChildCount', 'subsidyChildNames', 'hasNoSubsidyChild', 'noSubsidyInfo', 'actualChildCount', 'siteCheckResult', 'siteCheckReason', 'feeCheckResult', 'feeCheckReason', 'feeDetails']} title="托育查核" />}>
              <div className="space-y-6">
                <SelectField 
                  label="單位名稱" 
                  options={['臺北市北投區居家托育服務中心', '臺北市士林區居家托育服務中心', '臺北市中山區居家托育服務中心', '新北市中和區居家托育服務中心', '桃園市第六區居家托育服務中心', '臺中市第一區居家托育服務中心', '臺南市第一區居家托育服務中心']} 
                  value={record.unitName} 
                  onChange={(v) => updateField('unitName', v)} 
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="申請補助之幼兒人數" value={record.subsidyChildCount} onChange={(v) => updateField('subsidyChildCount', v)} type="number" />
                  <InputField label="申請補助之幼兒姓名" value={record.subsidyChildNames} onChange={(v) => updateField('subsidyChildNames', v)} />
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="是否有未申請補助幼兒？" options={['是', '否']} value={record.hasNoSubsidyChild} onChange={(v) => updateField('hasNoSubsidyChild', v)} />
                  {record.hasNoSubsidyChild === '是' && (
                    <TextAreaField label="未申請補助幼兒姓名及原因" value={record.noSubsidyInfo} onChange={(v) => updateField('noSubsidyInfo', v)} />
                  )}
                </div>

                <InputField 
                  label="實際收托人數" 
                  value={record.actualChildCount} 
                  onChange={(v) => updateField('actualChildCount', v)} 
                  type="number"
                  max="20"
                />
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="訪視現場親見幼兒與收托資料" options={['符合', '不符合']} value={record.siteCheckResult} onChange={(v) => updateField('siteCheckResult', v)} />
                  {record.siteCheckResult === '不符合' && <TextAreaField label="不符合原因" value={record.siteCheckReason} onChange={(v) => updateField('siteCheckReason', v)} />}
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="托育人員收費是否與托育契約書一致" options={['是', '否']} value={record.feeCheckResult} onChange={(v) => updateField('feeCheckResult', v)} />
                  {record.feeCheckResult === '否' && <TextAreaField label="不符合原因" value={record.feeCheckReason} onChange={(v) => updateField('feeCheckReason', v)} />}
                </div>

                <TextAreaField label="幼兒托育時間及費用" value={record.feeDetails} onChange={(v) => updateField('feeDetails', v)} />
              </div>
            </FormSection>

            {/* 八、九 */}
            <FormSection title="八、媒合需求" icon={<Info className="w-5 h-5" />} borderColor="border-slate-500" isOpen={openSections['match']} onToggle={() => toggleSection('match')} extraActions={<SectionActions sectionKeys={['matchNeeds']} title="媒合需求" />}>
              <InputField label="八、媒合需求" value={record.matchNeeds} onChange={(v) => updateField('matchNeeds', v)} />
            </FormSection>
            <FormSection title="九、訪視狀況簡述" icon={<MessageSquare className="w-5 h-5" />} borderColor="border-slate-400" isOpen={openSections['statusDesc']} onToggle={() => toggleSection('statusDesc')} extraActions={<SectionActions sectionKeys={['visitStatusDesc']} title="訪視狀況簡述" />}>
              <TextAreaField label="九、訪視狀況簡述" value={record.visitStatusDesc} onChange={(v) => updateField('visitStatusDesc', v)} hint="互動、特殊狀況、拒訪、保親溝通..." />
            </FormSection>

            {/* 十、收托幼兒狀況 */}
            <FormSection title="十、收托幼兒狀況" icon={<Heart className="w-5 h-5" />} borderColor="border-rose-500" isOpen={openSections['childStatus']} onToggle={() => toggleSection('childStatus')} extraActions={<SectionActions sectionKeys={['childEnrollmentStatus', 'childStatuses']} title="收托幼兒狀況" />}>
              <div className="space-y-6">
                <SelectField 
                  label="有無收托幼兒" 
                  options={['無托兒', '有收托']} 
                  value={record.childEnrollmentStatus} 
                  onChange={(v) => updateField('childEnrollmentStatus', v)} 
                />
                {record.childEnrollmentStatus === '有收托' && (
                  <ChildStatusForm statuses={record.childStatuses} onChange={(v) => updateField('childStatuses', v)} />
                )}
              </div>
            </FormSection>

            {/* 十一、十二 */}
            <FormSection title="十一、托育環境" icon={<Home className="w-5 h-5" />} borderColor="border-teal-500" isOpen={openSections['env']} onToggle={() => toggleSection('env')} extraActions={<SectionActions sectionKeys={['envCheckResult', 'envCheckReason', 'envFacilities', 'envFacilitiesOther', 'envComfort', 'envComfortOther', 'noSmokingResult', 'noSmokingDesc', 'envDesc']} title="托育環境" />}>
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="1. 托育環評 40 項檢查結果" options={['符合', '不符合']} value={record.envCheckResult} onChange={(v) => updateField('envCheckResult', v)} />
                  {record.envCheckResult === '不符合' && (
                    <div className="space-y-4 pt-2">
                      <TextAreaField label="未符合項目、原因、改善期限" value={record.envCheckReason} onChange={(v) => updateField('envCheckReason', v)} />
                      <MultiSelectField 
                        label="環境安全檢核指標 (請勾選不符合項目)" 
                        options={ENV_SAFETY_INDICATORS} 
                        values={record.envCheckItems} 
                        onChange={(v) => updateField('envCheckItems', v)}
                        className="bg-white p-4 rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>
                <MultiSelectField label="2. 托育地設施設備" options={['充足', '合宜', '安全', '適齡']} values={record.envFacilities} onChange={(v) => updateField('envFacilities', v)} allowOther otherValue={record.envFacilitiesOther} onOtherChange={(v) => updateField('envFacilitiesOther', v)} />
                <MultiSelectField label="3. 整體舒適度" options={['光線明亮', '無異味', '通風良好', '溫度適中']} values={record.envComfort} onChange={(v) => updateField('envComfort', v)} allowOther otherValue={record.envComfortOther} onOtherChange={(v) => updateField('envComfortOther', v)} />
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="4. 確認托育地確實為全面禁菸場所" options={['符合', '不符合']} value={record.noSmokingResult} onChange={(v) => updateField('noSmokingResult', v)} />
                  {record.noSmokingResult === '不符合' && <TextAreaField label="現況及輔導措施說明" value={record.noSmokingDesc} onChange={(v) => updateField('noSmokingDesc', v)} />}
                </div>
              </div>
            </FormSection>

            {/* 十二、托育品質 */}
            <FormSection title="十二、托育品質" icon={<CheckCircle2 className="w-5 h-5" />} borderColor="border-indigo-600" isOpen={openSections['quality']} onToggle={() => toggleSection('quality')} extraActions={<SectionActions sectionKeys={['routineCheck', 'routineDesc', 'routineOther', 'activities', 'activitiesOther', 'mealPrep', 'mealPrepOther', 'dietQuality', 'dietQualityDesc', 'dietQualityOther', 'mealSpace', 'mealSpaceDesc', 'mealSpaceOther', 'mealWay', 'mealWayDesc', 'mealWayOther', 'mealCleanProcess', 'childCleanAfterMeal', 'toyClean', 'toyCleanOther', 'toyCleanDesc', 'envClean', 'envCleanOther', 'envCleanDesc', 'qualityDesc', 'qualityCheckResult', 'qualityCheckItems', 'qualityCheckReason', 'fourChildCheckResult', 'fourChildCheckItems', 'fourChildCheckReason']} title="托育品質" />}>
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="1. 安排基本作息與活動時間" options={['符合', '不符合']} value={record.routineCheck} onChange={(v) => updateField('routineCheck', v)} />
                  <TextAreaField label="現況及說明" value={record.routineOther} onChange={(v) => updateField('routineOther', v)} placeholder="請輸入說明..." />
                  {record.routineCheck === '不符合' && <TextAreaField label="輔導措施說明" value={record.routineDesc} onChange={(v) => updateField('routineDesc', v)} />}
                </div>
                <MultiSelectField label="2. 學習與提供適齡適性的教玩具" options={['說故事', '聽音樂', '戶外散步', '玩教玩具', '聊天', '嬰幼兒按摩', '大肌肉活動', '小肌肉活動', '自由探索']} values={record.activities} onChange={(v) => updateField('activities', v)} allowOther otherValue={record.activitiesOther} onOtherChange={(v) => updateField('activitiesOther', v)} />
                <MultiSelectField label="3. 備餐方式、時間" options={['前一晚製作', '早上收托兒尚未開始托育時', '利用收托兒休息時間', '請家人幫忙看顧時', '家長自行準備']} values={record.mealPrep} onChange={(v) => updateField('mealPrep', v)} allowOther otherValue={record.mealPrepOther} onOtherChange={(v) => updateField('mealPrepOther', v)} />
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="4. 依兒童年齡提供多樣化飲食" options={['符合', '不符合']} value={record.dietQuality} onChange={(v) => updateField('dietQuality', v)} />
                  <TextAreaField label="現況及說明" value={record.dietQualityOther} onChange={(v) => updateField('dietQualityOther', v)} placeholder="請輸入說明..." />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="5.1 用餐空間、用品合宜、足夠" options={['符合', '不符合']} value={record.mealSpace} onChange={(v) => updateField('mealSpace', v)} />
                  <TextAreaField label="現況及說明" value={record.mealSpaceOther} onChange={(v) => updateField('mealSpaceOther', v)} placeholder="請輸入說明..." />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="5.2 適齡的餵食或用餐方式" options={['符合', '不符合']} value={record.mealWay} onChange={(v) => updateField('mealWay', v)} />
                  <TextAreaField label="現況及說明" value={record.mealWayOther} onChange={(v) => updateField('mealWayOther', v)} placeholder="請輸入說明..." />
                </div>
                <InputField label="5.3 用餐後環境清潔流程：" value={record.mealCleanProcess} onChange={(v) => updateField('mealCleanProcess', v)} />
                <InputField label="5.4 用餐完幼兒清潔（擦臉、刷牙）：" value={record.childCleanAfterMeal} onChange={(v) => updateField('childCleanAfterMeal', v)} />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <SelectField label="6.1 教玩具、寢具清潔" options={['符合（每天定期消毒）', '符合（每週定期消毒）', '不符合']} value={record.toyClean} onChange={(v) => updateField('toyClean', v)} allowOther otherValue={record.toyCleanOther} onOtherChange={(v) => updateField('toyCleanOther', v)} />
                    {record.toyClean === '不符合' && <TextAreaField label="現況及輔導措施說明" value={record.toyCleanDesc} onChange={(v) => updateField('toyCleanDesc', v)} />}
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <SelectField label="6.2 托育環境衛生整潔" options={['符合（定期消毒打掃）', '不符合']} value={record.envClean} onChange={(v) => updateField('envClean', v)} allowOther otherValue={record.envCleanOther} onOtherChange={(v) => updateField('envCleanOther', v)} />
                    {record.envClean === '不符合' && <TextAreaField label="現況及輔導措施說明" value={record.envCleanDesc} onChange={(v) => updateField('envCleanDesc', v)} />}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="照顧品質評估指標檢核" options={['符合', '不符合']} value={record.qualityCheckResult} onChange={(v) => updateField('qualityCheckResult', v)} />
                  {record.qualityCheckResult === '不符合' && (
                    <div className="space-y-4 pt-2">
                      <TextAreaField 
                        label="不符合原因說明" 
                        value={record.qualityCheckReason} 
                        onChange={(v) => updateField('qualityCheckReason', v)} 
                        placeholder="請輸入不符合原因之具體說明..."
                      />
                      <MultiSelectField 
                        label="照顧品質評估指標 (請勾選不符合項目)" 
                        options={QUALITY_ASSESSMENT_INDICATORS} 
                        values={record.qualityCheckItems} 
                        onChange={(v) => updateField('qualityCheckItems', v)}
                        className="bg-white p-4 rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="居家托育人員收托4名兒童訪視檢核表" options={['符合', '不符合']} value={record.fourChildCheckResult} onChange={(v) => updateField('fourChildCheckResult', v)} />
                  {record.fourChildCheckResult === '不符合' && (
                    <div className="space-y-4 pt-2">
                      <TextAreaField 
                        label="不符合原因說明" 
                        value={record.fourChildCheckReason} 
                        onChange={(v) => updateField('fourChildCheckReason', v)} 
                        placeholder="請輸入不符合原因之具體說明..."
                      />
                      <div className="space-y-4 bg-white p-4 rounded-lg border border-slate-200">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">收托4名兒童訪視檢核指標 (請勾選不符合項目)</label>
                        {FOUR_CHILD_CHECK_INDICATORS.map((group, idx) => (
                          <div key={idx} className="space-y-2">
                            <h4 className="text-sm font-bold text-brand">{group.category}</h4>
                            <div className="flex flex-wrap gap-2">
                              {group.items.map((item) => (
                                <button
                                  key={item}
                                  onClick={() => {
                                    const vals = record.fourChildCheckItems;
                                    if (vals.includes(item)) {
                                      updateField('fourChildCheckItems', vals.filter(v => v !== item));
                                    } else {
                                      updateField('fourChildCheckItems', [...vals, item]);
                                    }
                                  }}
                                  className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer text-left ${
                                    record.fourChildCheckItems.includes(item) 
                                    ? 'bg-brand border-brand text-white shadow-md' 
                                    : 'bg-white border-gray-100 text-gray-500 hover:border-brand-light'
                                  }`}
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <TextAreaField label="托育品質說明" value={record.qualityDesc} onChange={(v) => updateField('qualityDesc', v)} placeholder="請輸入額外說明..." />
              </div>
            </FormSection>

            {/* 十三、十四、十五 */}
            <FormSection title="十三、托育人員與托兒間互動與社會行為" icon={<Users className="w-5 h-5" />} borderColor="border-pink-500" isOpen={openSections['interaction']} onToggle={() => toggleSection('interaction')} extraActions={<SectionActions sectionKeys={['gameInteraction', 'gameInteractionDesc', 'positiveResponse', 'positiveResponseDesc', 'socialDevSupport', 'socialDevSupportDesc', 'otherInteractionObs']} title="托育人員與托兒間互動與社會行為" />}>
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="1. 托育人員能與幼兒經常進行遊戲互動" options={['是', '否']} value={record.gameInteraction} onChange={(v) => updateField('gameInteraction', v)} />
                  {record.gameInteraction === '否' && <TextAreaField label="說明" value={record.gameInteractionDesc} onChange={(v) => updateField('gameInteractionDesc', v)} />}
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="2. 托育人員能敏銳、正向、溫暖親切的回應幼兒" options={['是', '否']} value={record.positiveResponse} onChange={(v) => updateField('positiveResponse', v)} />
                  {record.positiveResponse === '否' && <TextAreaField label="說明" value={record.positiveResponseDesc} onChange={(v) => updateField('positiveResponseDesc', v)} />}
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="3. 托育人員能藉由對幼兒間互動和合作的協助來促進其社會發展" options={['是', '否']} value={record.socialDevSupport} onChange={(v) => updateField('socialDevSupport', v)} />
                  {record.socialDevSupport === '否' && <TextAreaField label="說明" value={record.socialDevSupportDesc} onChange={(v) => updateField('socialDevSupportDesc', v)} />}
                </div>
                <TextAreaField label="4. 其他互動觀察" value={record.otherInteractionObs} onChange={(v) => updateField('otherInteractionObs', v)} hint="托育人員與幼兒、幼兒與幼兒，托育嬰幼兒擁抱、移動時，動作輕柔、適時的護住頭頸，環境中是否有疑似處罰工具等" />
              </div>
            </FormSection>

            <FormSection title="十四、保親關係" icon={<Heart className="w-5 h-5" />} borderColor="border-red-400" isOpen={openSections['relationship']} onToggle={() => toggleSection('relationship')} extraActions={<SectionActions sectionKeys={['dailyHandover', 'parentCooperation']} title="保親關係" />}>
              <div className="space-y-6">
                <TextAreaField label="十四-1. 每日交接方式" value={record.dailyHandover} onChange={(v) => updateField('dailyHandover', v)} />
                <TextAreaField label="十四-2. 保親合作狀況" value={record.parentCooperation} onChange={(v) => updateField('parentCooperation', v)} />
              </div>
            </FormSection>

            <FormSection title="十五、托育人員現況" icon={<User className="w-5 h-5" />} borderColor="border-orange-400" isOpen={openSections['providerStatus']} onToggle={() => toggleSection('providerStatus')} extraActions={<SectionActions sectionKeys={['providerHealthSelf', 'visitorEval', 'visitorEvalReasons', 'visitorEvalOther', 'familyHealth', 'familyHealthReason', 'familyHealthDesc', 'familySupport', 'familySupportDesc', 'workImpactFamily', 'workImpactFamilyDesc']} title="托育人員現況" />}>
              <div className="space-y-6">
                <TextAreaField label="十五-1. 托育人員自述健康狀況" value={record.providerHealthSelf} onChange={(v) => updateField('providerHealthSelf', v)} />
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="十五-2. 訪員評估" options={['正常', '異常']} value={record.visitorEval} onChange={(v) => updateField('visitorEval', v)} />
                  {record.visitorEval === '異常' && <MultiSelectField label="異常原因" options={['呈現焦慮與壓力感', '呈現衝動與控制力較差', '表情冷漠或社交退縮', '有獨留兒童在家之風險', '同住家人關係衝突']} values={record.visitorEvalReasons} onChange={(v) => updateField('visitorEvalReasons', v)} allowOther otherValue={record.visitorEvalOther} onOtherChange={(v) => updateField('visitorEvalOther', v)} />}
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="十五-3. 同住成員身心狀況" options={['無明顯異常', '尚可', '無同住成員', '訪視未遇家庭成員', '不佳']} value={record.familyHealth} onChange={(v) => updateField('familyHealth', v)} />
                  <TextAreaField label="說明" value={record.familyHealthDesc} onChange={(v) => updateField('familyHealthDesc', v)} placeholder="請輸入說明..." />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="十五-4. 同住成員是否支持" options={['是', '否']} value={record.familySupport} onChange={(v) => updateField('familySupport', v)} />
                  <TextAreaField label="說明" value={record.familySupportDesc} onChange={(v) => updateField('familySupportDesc', v)} placeholder="請輸入說明..." />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <SelectField label="十五-5. 托育工作是否影響家庭" options={['是', '否']} value={record.workImpactFamily} onChange={(v) => updateField('workImpactFamily', v)} />
                  <TextAreaField label="說明" value={record.workImpactFamilyDesc} onChange={(v) => updateField('workImpactFamilyDesc', v)} placeholder="請輸入說明..." />
                </div>
              </div>
            </FormSection>

            {/* 十六 - 二十六 */}
            <FormSection title="十六、緊急事件演練與抽問" icon={<MessageSquare className="w-5 h-5" />} borderColor="border-slate-600" isOpen={openSections['emergency']} onToggle={() => toggleSection('emergency')} extraActions={<SectionActions sectionKeys={['hasEmergencyDrill', 'emergencyDrill', 'emergencyDrillDesc']} title="緊急事件演練與抽問" />}>
              <SelectField label="是否有進行緊急事件演練？" options={['有', '無']} value={record.hasEmergencyDrill} onChange={(v) => updateField('hasEmergencyDrill', v)} />
              <TextAreaField label="演練與抽問狀況說明" value={record.emergencyDrillDesc} onChange={(v) => updateField('emergencyDrillDesc', v)} placeholder="請輸入說明..." />
            </FormSection>

            <FormSection title="十七、待追蹤、改善事項" icon={<AlertCircle className="w-5 h-5" />} borderColor="border-red-600" isOpen={openSections['pending']} onToggle={() => toggleSection('pending')} extraActions={<SectionActions sectionKeys={['hasPendingFollowUp', 'pendingFollowUp']} title="待追蹤、改善事項" />}>
              <SelectField label="是否有待追蹤、改善事項？" options={['有', '無']} value={record.hasPendingFollowUp} onChange={(v) => updateField('hasPendingFollowUp', v)} />
              {record.hasPendingFollowUp === '有' && (
                <TextAreaField label="待追蹤、改善事項說明" value={record.pendingFollowUp} onChange={(v) => updateField('pendingFollowUp', v)} />
              )}
            </FormSection>

            <FormSection title="十八、建議輔導事項" icon={<Info className="w-5 h-5" />} borderColor="border-slate-400" isOpen={openSections['suggested']} onToggle={() => toggleSection('suggested')} extraActions={<SectionActions sectionKeys={['suggestedGuidance']} title="建議輔導事項" />}>
              <TextAreaField label="十八、建議輔導事項" value={record.suggestedGuidance} onChange={(v) => updateField('suggestedGuidance', v)} />
            </FormSection>

            <FormSection title="十九、托育安全宣導事項" icon={<ShieldCheck className="w-5 h-5" />} borderColor="border-slate-400" isOpen={openSections['safety']} onToggle={() => toggleSection('safety')} extraActions={<SectionActions sectionKeys={['safetyPropaganda', 'safetyPropagandaOther']} title="托育安全宣導事項" />}>
              <MultiSelectField 
                label="十九、托育安全宣導事項" 
                options={[
                  '宣導五招安心睡', 
                  '不應運用任何工具長時間約束幼兒活動，提醒不應長時間使用高腳餐椅、嬰兒床、遊戲床約束幼兒活動', 
                  '照顧幼兒時應安全看視，注意幼兒安全，並留意幼兒互動時有無咬、抓行為，避免幼兒受傷', 
                  '宣導托育人員應留意直徑3.17公分的物品並收納在幼兒無法碰觸之處以避免窒息，如玩具、零錢等', 
                  '托兒使用大型遊戲設備時，請托育人員務必陪同', 
                  '宣導嬰兒床上不應吊掛任何毛巾、衣物', 
                  '高腳餐椅使用安全：請確保幼兒不會攀爬，且具穩固性，並妥善使用安全帶。',
                  '提醒托育人員應注意食用熱水、熱湯、使用熱水的安全，避免幼兒燙傷'
                ]} 
                values={record.safetyPropaganda} 
                onChange={(v) => updateField('safetyPropaganda', v)} 
                allowOther
                otherValue={record.safetyPropagandaOther}
                onOtherChange={(v) => updateField('safetyPropagandaOther', v)}
              />
            </FormSection>

            <FormSection title="二十、宣導事項" icon={<Info className="w-5 h-5" />} borderColor="border-slate-400" isOpen={openSections['general']} onToggle={() => toggleSection('general')} extraActions={<SectionActions sectionKeys={['generalPropaganda', 'generalPropagandaOther']} title="宣導事項" />}>
              <MultiSelectField 
                label="二十、宣導事項" 
                options={[
                  '不得進行任何形式的體罰、不當管教：提醒托育人員應正向管教(包括身教、言教)，不打罵、不懲罰、不體罰，即使家長授權同意都是不可以。（不合適的行為包含，罰站、恐嚇孩子不乖就要打手手、叫孩子閉嘴、打罵孩子）', 
                  '收托人數宣導：如有原幼兒增加過夜、全日托，應先與中心聯繫，確認收托人數未超收。', 
                  '應專心托育：托育人員於收托時間勿擅離托育地(不得於托育時間將幼兒委託家人照顧)，如有需外出，建議由家人處理或運用非托育時間或向家長請假。', 
                  '托育人員不得獨留幼兒在托育地，即使是領掛號信、開一樓大門…等，暫時離開一下也不可以。如獨留幼兒將違反兒少權法第51條，如有違規將會影響準公身分、且被裁罰；如因此幼兒發生意外事件將有後續刑責。', 
                  '宣導傳染病、意外事件的緊急處理程序、通報中心之責任。', 
                  '傳染疾病盛行，請務必加強托育地消毒與勤洗手、注意幼兒及托育人員健康。', 
                  '宣導新收托、終托、收托異動應於異動起始日 7日內通報中心。', 
                  '宣導托育人員應有適當紓壓管道，並提醒幼兒照顧時明顯有壓力或情緒，請聯絡中心，中心可提供相關支持、及相關資源。', 
                  '宣導托育人員應正向管教，留意同住家人與幼兒的互動，不得使用任何不當的照顧、管教方式。', 
                  '宣導托育人員應留意幼兒外觀是否有受傷狀況，無論傷害是否在托育地造成，均須通報中心，中心會關懷後續與處理。',
                  '寶寶日誌應每日以紙本、電子APP、LINE(記事本)等多元形式記錄，內容需有基本照顧事項(含時間、頻率及量等):1.飲食(喝奶、副食品)2.睡眠3.排便(換尿布、大小便)4.服藥(有托藥應敘明)及聯絡事項(受托幼兒活動情形及特殊事件等) 。',
                  '托育時遇到緊急事件，請托育人員第一時間務必撥打119並配合119進行緊急處置，在安全狀況下聯絡家長、並回報中心。'
                ]} 
                values={record.generalPropaganda} 
                onChange={(v) => updateField('generalPropaganda', v)} 
                allowOther
                otherValue={record.generalPropagandaOther}
                onOtherChange={(v) => updateField('generalPropagandaOther', v)}
              />
            </FormSection>

            <FormSection title="二十一、現場輔導紀錄" icon={<FileText className="w-5 h-5" />} borderColor="border-slate-400" isOpen={openSections['field']} onToggle={() => toggleSection('field')} extraActions={<SectionActions sectionKeys={['fieldGuidanceRecord']} title="現場輔導紀錄" />}>
              <TextAreaField label="二十一、現場輔導紀錄" value={record.fieldGuidanceRecord} onChange={(v) => updateField('fieldGuidanceRecord', v)} />
            </FormSection>

            <FormSection title="二十二、針對建議輔導後托育人員態度" icon={<MessageSquare className="w-5 h-5" />} borderColor="border-slate-400" isOpen={openSections['attitude']} onToggle={() => toggleSection('attitude')} extraActions={<SectionActions sectionKeys={['providerAttitude']} title="針對建議輔導後托育人員態度" />}>
              <TextAreaField label="二十二、建議輔導後托育人員態度" value={record.providerAttitude} onChange={(v) => updateField('providerAttitude', v)} />
            </FormSection>

            <FormSection title="二十三、托育人員反映需求/建議" icon={<Info className="w-5 h-5" />} borderColor="border-slate-400" isOpen={openSections['needs']} onToggle={() => toggleSection('needs')} extraActions={<SectionActions sectionKeys={['serviceNeeds']} title="托育人員反映需求/建議" />}>
              <TextAreaField label="二十三、托育人員反映需求/建議" value={record.serviceNeeds} onChange={(v) => updateField('serviceNeeds', v)} />
            </FormSection>

            <FormSection title="二十四、下次輔導重點" icon={<AlertCircle className="w-5 h-5" />} borderColor="border-slate-900" isOpen={openSections['nextFocus']} onToggle={() => toggleSection('nextFocus')} extraActions={<SectionActions sectionKeys={['nextFollowUpFocus']} title="下次輔導重點" />}>
              <TextAreaField label="二十四、下次輔導重點" value={record.nextFollowUpFocus} onChange={(v) => updateField('nextFollowUpFocus', v)} hint="系統會自動偵測異常項並列入追蹤" />
            </FormSection>

            <FormSection title="二十五、是否違反考核項目" icon={<ShieldCheck className="w-5 h-5" />} borderColor="border-slate-900" isOpen={openSections['violation']} onToggle={() => toggleSection('violation')} extraActions={<SectionActions sectionKeys={['isViolation', 'reviewResultDesc']} title="是否違反考核項目" />}>
              <div className="space-y-4">
                <SelectField label="二十五、是否違反考核項目" options={['是', '否']} value={record.isViolation} onChange={(v) => updateField('isViolation', v)} />
                {record.isViolation === '是' && (
                  <TextAreaField label="違反項目說明" value={record.reviewResultDesc} onChange={(v) => updateField('reviewResultDesc', v)} placeholder="請輸入說明..." />
                )}
              </div>
            </FormSection>
            </>
            )}

          </div>
        </section>

        {/* Right Side: Word-like Editor */}
        <section className="flex-1 bg-slate-200 overflow-y-auto p-10 relative flex flex-col items-center">
          {/* Paper Container */}
          <div className={`w-full max-w-[210mm] bg-white shadow-2xl min-h-fit p-[20mm] transition-all duration-500 relative mb-20 ${!autoSync && viewMode === 'record' ? 'ring-4 ring-amber-400 ring-inset' : ''}`}>
            <div className="h-full bg-white">
              <div className="absolute top-4 right-4 flex flex-col items-end gap-2 pointer-events-none">
                {!autoSync && viewMode === 'record' && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-600 rounded text-[10px] font-bold border border-amber-200 animate-pulse">
                    <RefreshCw className="w-3 h-3" />
                    非同步模式
                  </div>
                )}
                {autoSync && viewMode === 'record' && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100">
                    <RefreshCw className="w-3 h-3" />
                    自動同步啟用中
                  </div>
                )}
                <div className="text-[10px] text-slate-300 font-mono uppercase tracking-widest">
                  A4 Document View
                </div>
              </div>
              
              {autoSync && viewMode === 'record' && (
                <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none z-10">
                  <div className="bg-amber-50/90 backdrop-blur text-amber-700 text-[11px] font-bold px-4 py-2 rounded-full border border-amber-200 shadow-sm flex items-center gap-2 animate-bounce">
                    <AlertCircle className="w-3.5 h-3.5" />
                    目前自動同步啟用中，手動編輯內容可能會被覆蓋
                  </div>
                </div>
              )}

              <div
                ref={editorRef}
                contentEditable={viewMode === 'record'}
                onInput={viewMode === 'record' ? handleEditorChange : undefined}
                className="outline-none prose prose-slate max-w-none min-h-[297mm] font-serif text-[#333] leading-relaxed bg-white"
                style={{ fontFamily: "'Microsoft JhengHei', sans-serif" }}
              />
            </div>
          </div>
          
          <div className="fixed bottom-6 right-10 flex flex-col items-end gap-3 z-50">
            {viewMode === 'record' && (
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl border border-slate-200">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={autoSync} 
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  自動同步表單內容
                </label>
              </div>
            )}
            {viewMode === 'record' ? (
              <div className="text-slate-400 text-[10px] font-medium flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                <Settings className="w-3 h-3" />
                右側內容可直接點擊編輯，編輯後將同步至匯出檔案
              </div>
            ) : (
              <div className="text-slate-400 text-[10px] font-medium flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                <Settings className="w-3 h-3" />
                訪視準備清單為系統自動生成，不可手動編輯
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
