export type ServiceType = '在宅' | '到宅' | '';
export type VisitMethod = '電訪' | '家訪' | '當面協談' | '小組活動' | '其他' | '';
export type VisitCategory = '例行訪視' | '新收托訪視' | '初次訪視' | '加強訪視' | '實地審查';
export type CheckResult = '符合' | '不符合' | '';
export type YesNo = '是' | '否' | '';
export type HasNo = '有' | '無' | '';
export type ChildAttendance = '是' | '無托兒' | '';
export type NormalAbnormal = '正常' | '異常' | '無明顯異常' | '其他' | '';

export interface ChildInfo {
  status: string;
  name: string;
  idNumber: string;
  birthday: string;
  startDate: string;
}

export interface ChildStatus {
  name: string;
  isNew: YesNo;
  age: string;
  careType: string;
  careTypeOther: string;
  hasLog: '有' | '無' | '';
  logTypes: string[];
  logOther: string;
  logGuidance: string;
  health: NormalAbnormal;
  healthIssues: string[];
  healthOther: string;
  spirit: '精力旺盛' | '精神佳' | '普通' | '異常' | '';
  spiritIssues: string[];
  spiritOther: string;
  appearance: NormalAbnormal;
  appearanceIssues: string[];
  appearanceOther: string;
  appearanceDesc: string;
  healthDesc: string;
  spiritDesc: string;
  appearanceDetail: string;
  sleepSafe: string;
  sleepStatus: string[];
  sleepStatusOther: string;
  sleepPosture: string;
  sleepPostureOther: string;
  sleepNonBackGuidance: string;
  sleepTime: string;
  sleepArea: string;
  sleepSoothing: string;
  cleaning: string;
  diaperFreq: string;
  bathCleaning: string;
  toiletTraining: string;
  cleaningOther: string;
  devCheck: '正常' | '異常' | '未滿3個月14天，無法施作' | '本階段已施作' | '其他' | '';
  devCheckOther: string;
  devStage: string;
  devReport: '已通報' | '未通報' | '';
  devReportTime: string;
  devReportReason: string;
  devPrevDate: string;
  devDesc: string;
  dietDesc: string;
  dietTypes: string[];
  dietTypesOther: string;
  dietContent: string;
  dietStatus: string[];
  dietStatusOther: string;
  interaction: '良好' | '異常' | '其他' | '';
  interactionOther: string;
  interactionDesc: string;
  otherDesc: string;
  adaptStatus: string; // Only if isNew is Yes
  parentComm: string; // Only if isNew is Yes
  peerImpact: string; // Only if isNew is Yes
  attendanceStatus: '有送托' | '當天幼兒未送托' | '無托兒' | '';
  notPresentReason: string;
  isNotPresent: boolean;
}

export interface VisitRecord {
  // 一、托育人員資料
  providerName: string;
  providerNo: string;
  providerId: string;

  // 二、訪視資料
  visitMethod: VisitMethod;
  visitMethodOther: string;
  visitDate: string;
  visitTime: string;
  visitorName: string;

  // 三、托育狀況
  hasChildren: ChildAttendance;
  children: ChildInfo[];

  // 四、訪視類型
  serviceType: ServiceType;
  visitCategories: VisitCategory[];
  newChildName: string; // if 新收托訪視
  reinforceReason: string; // if 加強訪視
  annualVisitCount: string;
  currentVisitCount: string;
  isJoint: YesNo;
  jointProvider1Name: string;
  jointProvider1Children: string;
  jointProvider2Name: string;
  jointProvider2Children: string;

  // 五、六
  prevFollowUp: string;
  currentVisitFocus: string;

  // 七、托育查核
  unitName: string;
  subsidyChildCount: string;
  subsidyChildNames: string;
  hasNoSubsidyChild: YesNo;
  noSubsidyInfo: string;
  actualChildCount: string;
  siteCheckResult: CheckResult;
  siteCheckReason: string;
  feeCheckResult: YesNo;
  feeCheckReason: string;
  feeDetails: string;

  // 八、九
  matchNeeds: string;
  visitStatusDesc: string;

  // 十、收托幼兒狀況
  childEnrollmentStatus: '有收托' | '無托兒' | '';
  childStatuses: ChildStatus[];

  // 十一、托育環境
  envCheckResult: CheckResult;
  envCheckReason: string;
  envFacilities: string[];
  envFacilitiesOther: string;
  envComfort: string[];
  envComfortOther: string;
  noSmokingResult: CheckResult;
  noSmokingDesc: string;
  envDesc: string;
  envCheckItems: string[];

  // 十二、托育品質
  routineCheck: CheckResult;
  routineDesc: string;
  activities: string[];
  activitiesOther: string;
  mealPrep: string[];
  mealPrepOther: string;
  dietQuality: CheckResult;
  dietQualityDesc: string;
  mealSpace: CheckResult;
  mealSpaceDesc: string;
  mealWay: CheckResult;
  mealWayDesc: string;
  mealCleanProcess: string;
  childCleanAfterMeal: string;
  toyClean: string;
  toyCleanOther: string;
  toyCleanDesc: string;
  envClean: string;
  envCleanOther: string;
  envCleanDesc: string;
  qualityCheckSummary: string;
  qualityDesc: string;
  qualityCheckResult: CheckResult;
  qualityCheckItems: string[];
  qualityCheckReason: string;

  // 十三、互動
  gameInteraction: YesNo;
  gameInteractionDesc: string;
  positiveResponse: YesNo;
  positiveResponseDesc: string;
  socialDevSupport: YesNo;
  socialDevSupportDesc: string;
  otherInteractionObs: string;

  // 十四、十五
  dailyHandover: string;
  parentCooperation: string;
  providerHealthSelf: string;
  visitorEval: NormalAbnormal;
  visitorEvalReasons: string[];
  visitorEvalOther: string;
  familyHealth: '健康' | '尚可' | '無同住成員' | '訪視未遇家庭成員' | '不佳' | '';
  familyHealthReason: string;
  familySupport: YesNo;
  familySupportDesc: string;
  workImpactFamily: YesNo;
  workImpactFamilyDesc: string;

  // 十六 - 二十六
  hasEmergencyDrill: HasNo;
  emergencyDrill: string;
  hasPendingFollowUp: HasNo;
  pendingFollowUp: string;
  suggestedGuidance: string;
  safetyPropaganda: string[];
  safetyPropagandaOther: string;
  generalPropaganda: string[];
  generalPropagandaOther: string;
  supervisorNotes: string;
  providerAttitude: string;
  serviceNeeds: string;
  fieldGuidanceRecord: string;
  guidanceAttitude: string;
  guidanceNeeds: string;

  // 二十七 - 二十九
  nextFollowUpFocus: string;
  isViolation: YesNo;
  reviewResult: string;
  reviewResultDesc: string;

  fullContent: string;
}

export const initialChildInfo: ChildInfo = {
  status: '',
  name: '',
  idNumber: '',
  birthday: '',
  startDate: '',
};

export const initialChildStatus: ChildStatus = {
  name: '',
  isNew: '',
  age: '',
  careType: '',
  careTypeOther: '',
  hasLog: '',
  logTypes: [],
  logOther: '',
  logGuidance: '',
  health: '',
  healthIssues: [],
  healthOther: '',
  spirit: '',
  spiritIssues: [],
  spiritOther: '',
  appearance: '',
  appearanceIssues: [],
  appearanceOther: '',
  appearanceDesc: '',
  healthDesc: '',
  spiritDesc: '',
  appearanceDetail: '',
  sleepSafe: '',
  sleepStatus: [],
  sleepStatusOther: '',
  sleepPosture: '',
  sleepPostureOther: '',
  sleepNonBackGuidance: '',
  sleepTime: '',
  sleepArea: '',
  sleepSoothing: '',
  cleaning: '',
  diaperFreq: '',
  bathCleaning: '',
  toiletTraining: '',
  cleaningOther: '',
  devCheck: '',
  devCheckOther: '',
  devStage: '',
  devReport: '',
  devReportTime: '',
  devReportReason: '',
  devPrevDate: '',
  devDesc: '',
  dietDesc: '',
  dietTypes: [],
  dietTypesOther: '',
  dietContent: '',
  dietStatus: [],
  dietStatusOther: '',
  interaction: '',
  interactionOther: '',
  interactionDesc: '',
  otherDesc: '',
  adaptStatus: '',
  parentComm: '',
  peerImpact: '',
  attendanceStatus: '',
  notPresentReason: '',
  isNotPresent: false,
};

export const initialRecord: VisitRecord = {
  providerName: '',
  providerNo: '',
  providerId: '',
  visitMethod: '',
  visitMethodOther: '',
  visitDate: new Date().toISOString().split('T')[0],
  visitTime: '',
  visitorName: '',
  hasChildren: '',
  children: [initialChildInfo],
  serviceType: '',
  visitCategories: [],
  newChildName: '',
  reinforceReason: '',
  annualVisitCount: '',
  currentVisitCount: '',
  isJoint: '',
  jointProvider1Name: '',
  jointProvider1Children: '',
  jointProvider2Name: '',
  jointProvider2Children: '',
  prevFollowUp: '',
  currentVisitFocus: '',
  unitName: '',
  subsidyChildCount: '',
  subsidyChildNames: '',
  hasNoSubsidyChild: '',
  noSubsidyInfo: '',
  actualChildCount: '',
  siteCheckResult: '',
  siteCheckReason: '',
  feeCheckResult: '',
  feeCheckReason: '',
  feeDetails: '幼兒姓名，托育時間為周一至周五10:00-19:00，托育費19000元，副食品1500元，延托費130元/H，中秋及端午禮金各2000元，年終為一個月托育費(19000元)。',
  matchNeeds: '',
  visitStatusDesc: '',
  childEnrollmentStatus: '',
  childStatuses: [initialChildStatus],
  envCheckResult: '',
  envCheckReason: '',
  envFacilities: [],
  envFacilitiesOther: '',
  envComfort: [],
  envComfortOther: '',
  noSmokingResult: '',
  noSmokingDesc: '',
  envDesc: '',
  envCheckItems: [],
  routineCheck: '',
  routineDesc: '',
  activities: [],
  activitiesOther: '',
  mealPrep: [],
  mealPrepOther: '',
  dietQuality: '',
  dietQualityDesc: '',
  mealSpace: '',
  mealSpaceDesc: '',
  mealWay: '',
  mealWayDesc: '',
  mealCleanProcess: '',
  childCleanAfterMeal: '',
  toyClean: '',
  toyCleanOther: '',
  toyCleanDesc: '',
  envClean: '',
  envCleanOther: '',
  envCleanDesc: '',
  qualityCheckSummary: '',
  qualityDesc: '',
  qualityCheckResult: '',
  qualityCheckItems: [],
  qualityCheckReason: '',
  gameInteraction: '',
  gameInteractionDesc: '',
  positiveResponse: '',
  positiveResponseDesc: '',
  socialDevSupport: '',
  socialDevSupportDesc: '',
  otherInteractionObs: '',
  dailyHandover: '',
  parentCooperation: '',
  providerHealthSelf: '',
  visitorEval: '',
  visitorEvalReasons: [],
  visitorEvalOther: '',
  familyHealth: '',
  familyHealthReason: '',
  familySupport: '',
  familySupportDesc: '',
  workImpactFamily: '',
  workImpactFamilyDesc: '',
  hasEmergencyDrill: '',
  emergencyDrill: '',
  hasPendingFollowUp: '',
  pendingFollowUp: '',
  suggestedGuidance: '',
  safetyPropaganda: [],
  safetyPropagandaOther: '',
  generalPropaganda: [],
  generalPropagandaOther: '',
  supervisorNotes: '',
  providerAttitude: '',
  serviceNeeds: '',
  fieldGuidanceRecord: '',
  guidanceAttitude: '',
  guidanceNeeds: '',
  nextFollowUpFocus: '',
  isViolation: '',
  reviewResult: '',
  reviewResultDesc: '',
  fullContent: '',
};
