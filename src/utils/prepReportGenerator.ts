export interface PrepSectionData {
  enabled: boolean;
  notes: string;
}

export interface PrepChildData {
  name: string;
  birthday: string;
  startDate: string;
}

export interface PrepData {
  childCount: number;
  children: PrepChildData[];
  providerName: string;
  serviceType: string;
  visitCategories: string[];
  newChildName: string;
  initialVisitCount: string;
  reinforceReason: string;
  annualVisitCount: string;
  currentVisitCount: string;
  visitCountDesc: string;
  isJoint: string;
  jointProvider1Name: string;
  jointProvider1Children: string;
  jointProvider2Name: string;
  jointProvider2Children: string;
  feeDetails: string;
  subsidyStatus: string;
  actualChildCountCheck: string;
  childCountMatch: string;
  feeMatch: string;
  sections: Record<string, PrepSectionData>;
}

export const prepSectionsList = [
  "一、托育人員資料",
  "三、托育狀況",
  "四、訪視類型",
  "五、前次輔導追蹤",
  "六、本次訪視重點",
  "七、托育查核",
  "八、媒合需求",
  "九、訪視狀況簡述",
  "十、收托幼兒狀況",
  "十一、托育環境",
  "十二、托育品質",
  "十三、托育人員與托兒間互動與社會行為",
  "十四、保親關係",
  "十五、托育人員現況",
  "十六、緊急事件演練與抽問",
  "十七、待追蹤、改善事項",
  "十八、建議輔導事項",
  "十九、托育安全宣導事項",
  "二十、宣導事項",
  "二十一、現場輔導紀錄",
  "二十二、針對建議輔導後托育人員態度",
  "二十三、托育人員反映需求/建議",
];

export const defaultPrepData: PrepData = {
  childCount: 1,
  children: [
    { name: "", birthday: "", startDate: "" },
    { name: "", birthday: "", startDate: "" },
    { name: "", birthday: "", startDate: "" },
    { name: "", birthday: "", startDate: "" },
  ],
  providerName: "",
  serviceType: "",
  visitCategories: [],
  newChildName: "",
  initialVisitCount: "",
  reinforceReason: "",
  annualVisitCount: "",
  currentVisitCount: "",
  visitCountDesc: "",
  isJoint: "否",
  jointProvider1Name: "",
  jointProvider1Children: "",
  jointProvider2Name: "",
  jointProvider2Children: "",
  feeDetails: "（幼兒姓名，托育時間為周一至周五10:00-19:00，托育費19000元，副食品1500元，延托費130元/H，中秋及端午禮金各2000元，年終為一個月托育費(19000元)。",
  subsidyStatus: "",
  actualChildCountCheck: "",
  childCountMatch: "是",
  feeMatch: "是",
  sections: prepSectionsList.reduce(
    (acc, title) => {
      acc[title] = { enabled: true, notes: "" };
      return acc;
    },
    {} as Record<string, PrepSectionData>,
  ),
};

export function generatePrepReport(prepData: PrepData): string {
  const nl2br = (str: string) => (str ? str.replace(/\n/g, "<br/>") : "");

  const renderSection = (title: string, notes: string, content: string) => {
    const displayTitle = title.includes('、') ? title.split('、').slice(1).join('、') : title;
    return `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #0f172a; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0;">◎ ${displayTitle}</h2>
        <div style="font-size: 14px; color: #334155; line-height: 1.6;">
          ${content}
          ${notes ? `<div style="margin-top: 8px;">${nl2br(notes)}</div>` : ""}
        </div>
      </div>
    `;
  };

  let html = `<div style="font-family: '微軟正黑體', 'Microsoft JhengHei', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">`;

  const getSect = (title: string) =>
    prepData.sections[title] || { enabled: false, notes: "" };

  const add = (title: string, content: string) => {
    const sect = getSect(title);
    if (sect.enabled) {
      html += renderSection(title, sect.notes, content);
    }
  };

  add(
    "一、托育人員資料",
    `
    <p>姓名：${prepData.providerName || "________"}</p>
  `,
  );

  const childrenHtml = Array.from({ length: prepData.childCount })
    .map((_, i) => {
      const c = prepData.children[i];
      return `<p><strong>幼兒 ${i + 1}：</strong> 姓名: ${c.name || "________"} / 生日: ${c.birthday || "________"} / 托育起始日: ${c.startDate || "________"}</p>`;
    })
    .join("");

  add(
    "三、托育狀況",
    `
    ${childrenHtml}
  `,
  );

  const sT = prepData.serviceType;
  const sC = prepData.visitCategories;
  add(
    "四、訪視類型",
    `
    <p>服務類型： ${sT === '在宅' ? '■' : '□'} 在宅　${sT === '到宅' ? '■' : '□'} 到宅</p>
    <p>訪視類別： ${sC.includes('例行訪視') ? '■' : '□'} 例行訪視　${sC.includes('新收托訪視') ? '■' : '□'} 新收托訪視　${sC.includes('初次訪視') ? '■' : '□'} 初次訪視　${sC.includes('加強訪視') ? '■' : '□'} 加強訪視　${sC.includes('實地審查') ? '■' : '□'} 實地審查</p>
    <p>新收托幼兒姓名：${prepData.newChildName || "________"}</p>
    <p>初次訪視：第 ${prepData.initialVisitCount || "________"} 次</p>
    <p>加強訪視原因：${prepData.reinforceReason || "________"}</p>
    <p>年度應訪視次數：${prepData.annualVisitCount || "________"}</p>
    <p>本次為今年次第幾次訪視：${prepData.currentVisitCount || "________"}</p>
    <p>說明：${prepData.visitCountDesc || "________"}</p>
    <p>是否為聯合收托： ${prepData.isJoint === '是' ? '■ 是　□ 否' : '□ 是　■ 否'}</p>
    <p>聯合收托托育人員1：${prepData.jointProvider1Name || "________"} (收托幼兒：${prepData.jointProvider1Children || "________"})</p>
    <p>聯合收托托育人員2：${prepData.jointProvider2Name || "________"} (收托幼兒：${prepData.jointProvider2Children || "________"})</p>
  `,
  );

  add(
    "五、前次輔導追蹤",
    ``,
  );

  add(
    "六、本次訪視重點",
    ``,
  );

  add(
    "七、托育查核",
    `
    <p>申請補助之幼兒人數及姓名、是否有未申請補助者：${prepData.subsidyStatus || "________"}</p>
    <p>現場親見收托兒童數：${prepData.actualChildCountCheck || "________"}</p>
    <p>收托數是否符合收托資料： ${prepData.childCountMatch === '是' ? '■ 是　□ 否' : '□ 是　■ 否'}</p>
    <p>收費是否與托育契約書一致： ${prepData.feeMatch === '是' ? '■ 是　□ 否' : '□ 是　■ 否'}</p>
    <p>幼兒托育時間及費用：<br/>${nl2br(prepData.feeDetails) || "________"}</p>
  `,
  );

  add(
    "八、媒合需求",
    `
    <p>近期配合媒合需求意願： □ 有　□ 暫無 (預定________開始收托)　□ 滿托</p>
  `,
  );

  add(
    "九、訪視狀況簡述",
    ``,
  );

  const detailChildrenHtml = Array.from({ length: prepData.childCount })
    .map(
      (_, i) => `
    <div style="border: 1px dotted #94a3b8; padding: 8px; margin-bottom: 8px;">
      <p style="font-weight: bold; margin-bottom: 4px;">幼兒 ${i + 1}</p>
      <p>出席狀況： □ 正常　□ 當天幼兒未送托 (原因：________)</p>
      <p>新收托： □ 是　□ 否</p>
      <p>新收托適應情況：__________________</p>
      <p>新收托保親溝通：__________________</p>
      <p>新托兒加入對其他幼兒影響：__________________</p>
      <p>型態： □ 全日托　□ 半日托　□ 臨時托　□ 延時托　□ 夜間托</p>
      <p>寶寶日誌： □ 有 (□ 書面 □ 照片 □ 光碟 □ 電子檔 □ LINE □ 網路媒體（APP） □ 其他：________)　□ 無 (輔導：________)</p>
      <p>健康： □ 無明顯異常　□ 異常 (□ 感冒 □ 腸病毒 □ 腸胃不適 □ 過敏 □ 排便狀況不正常 □ 其他：________)</p>
      <p>精神： □ 精力旺盛　□ 精神佳　□ 普通　□ 異常 (□ 無精打采 □ 營養不良 □ 其他：________)</p>
      <p>身體外觀： □ 無明顯異常　□ 異常 (□ 瘀青 □ 抓傷或擦傷 □ 頭眼腹外傷 □ 體重過輕或與身高不成比例，不符合兒童生長發展曲線 □ 身體重要部位如：頭、腦、頸部、耳朵、軀幹，出現不尋常傷痕，或新舊傷夾雜 □ 兒童經常性或反覆受傷 □ 受傷應就醫而未就醫 □ 穿著不合身或不合時令 □ 不願與他人互動、恐懼、退縮、焦慮 □ 精神恍惚、缺少微笑、沈默、沒有情緒表現 □ 表情木然或不悅、自傷行為、搖晃身體 □ 其他：________)</p>
      <p>睡眠情形： □ 安穩　□ 易醒　□ 睡眠時間短　□ 淺眠　□ 趴睡（應宣導趴睡風險及五招安心睡）　□ 其他：________</p>
      <p>睡姿： □ 仰睡　□ 自由睡姿　□ 一歲以下幼兒非仰睡（應輔導）　□ 其他：________</p>
      <p>睡眠時間：__________________</p>
      <p>睡眠區域（客廳？房間？嬰兒床？）：__________________</p>
      <p>睡眠與情緒安撫（奶嘴？需抱？夜奶？）：__________________</p>
      <p>換尿布頻率：__________________</p>
      <p>洗澡、清洗屁屁（多位托兒如何安排）：__________________</p>
      <p>如廁練習：__________________</p>
      <p>發展檢核： □ 正常　□ 異常　□ 未滿3個月14天，無法施作　□ 本階段已施作（應確認先前施作時間）　□ 其他：________</p>
      <p>發展異常通報： □ 已通報 (時間：________)　□ 尚未通報 (原因：________)</p>
      <p>餐食型態： □ 母奶　□ 配方奶　□ 副食品（流質-泥狀）　□ 副食品（流質-糊狀）　□ 副食品（半固體-粥、燉飯）　□ 副食品（固體-飯）　□ 其他：________</p>
      <p>餐點內容（蔬菜、肉、蛋等）：__________________</p>
      <p>飲食狀況： □ 在固定位置用餐　□ 把食物吃光　□ 會自己進食（可用手）　□ 會使用餐具　□ 沒有偏食　□ 願意嘗試新食物　□ 用杯子喝水或奶　□ 托育人員餵食，狀況正常　□ 其他：________</p>
      <p>幼兒與托育人員互動情形： □ 良好　□ 異常　□ 其他：________</p>
    </div>
  `,
    )
    .join("");

  add(
    "十、收托幼兒狀況",
    `
    <p>收托狀態： □ 正常收托　□ 無托兒</p>
    ${detailChildrenHtml}
  `,
  );

  add(
    "十一、托育環境",
    `
    <p>1. 托育環境安全檢核： □ 符合　□ 不符合 (原因：________)</p>
    <p>2. 設施設備： □ 充足　□ 合宜　□ 安全　□ 適齡　□ 其他：________</p>
    <p>3. 整體舒適度： □ 光線明亮　□ 無異味　□ 通風良好　□ 溫度適中　□ 其他：________</p>
    <p>4. 居家空間無菸環境查核(張貼禁菸標誌)： □ 符合（張貼禁菸標籤）　□ 不符合 (說明：________)</p>
  `,
  );

  add(
    "十二、托育品質",
    `
    <p>1. 安排基本作息與活動時間： □ 符合　□ 不符合　□ 現況及說明(其他)：________</p>
    <p>2. 學習與提供適齡適性的教玩具： □ 說故事　□ 聽音樂　□ 戶外散步　□ 玩教玩具　□ 聊天　□ 嬰幼兒按摩　□ 大肌肉活動　□ 小肌肉活動　□ 自由探索　□ 其他：________</p>
    <p>3. 備餐方式、時間： □ 前一晚製作　□ 早上收托兒尚未開始托育時　□ 利用收托兒休息時間　□ 請家人幫忙看顧時　□ 家長自行準備　□ 其他：________</p>
    <p>4. 依兒童年齡提供多樣化飲食： □ 符合　□ 不符合　□ 現況及說明(其他)：________</p>
    <p>5.1 用餐空間、用品合宜、足夠： □ 符合　□ 不符合　□ 現況及說明(其他)：________</p>
    <p>5.2 適齡的餵食或用餐方式： □ 符合　□ 不符合　□ 現況及說明(其他)：________</p>
    <p>5.3 用餐後環境清潔流程：__________________</p>
    <p>5.4 用餐完幼兒清潔（擦臉、刷牙）：__________________</p>
    <p>6.1 教玩具、寢具清潔： □ 符合（每天定期消毒）　□ 符合（每週定期消毒）　□ 不符合 (現況及輔導措施說明：________)　□ 其他：________</p>
    <p>6.2 托育環境衛生整潔： □ 符合（定期消毒打掃）　□ 不符合 (現況及輔導措施說明：________)　□ 其他：________</p>
    <br/>
    <p>照顧品質評估指標檢核： □ 符合　□ 不符合</p>
    <p>居家托育人員收托4名兒童訪視檢核表： □ 符合　□ 不符合</p>
    <p>備註：檢核表細節於檢核表附件中勾選。</p>
  `,
  );

  add(
    "十三、托育人員與托兒間互動與社會行為",
    `
    <p>1. 托育人員能與幼兒經常進行遊戲互動： □ 是　□ 否 (說明：________)</p>
    <p>2. 托育人員能敏銳、正向、溫暖親切的回應幼兒： □ 是　□ 否 (說明：________)</p>
    <p>3. 托育人員能藉由對幼兒間互動和合作的協助來促進其社會發展： □ 是　□ 否 (說明：________)</p>
    <p>4. 其他互動觀察：（托育人員與幼兒、幼兒與幼兒，托育嬰幼兒擁抱、移動時，動作輕柔、適時的護住頭頸，環境中是否有疑似處罰工具等）__________________</p>
  `,
  );

  add(
    "十四、保親關係",
    `
    <p>十四-1. 每日交接方式：__________________</p>
    <p>十四-2. 保親合作狀況：__________________</p>
  `,
  );

  add(
    "十五、托育人員現況",
    `
    <p>十五-1. 托育人員自述健康狀況：__________________</p>
    <p>十五-2. 訪員評估： □ 正常　□ 異常 (□ 呈現焦慮與壓力感 □ 呈現衝動與控制力較差 □ 表情冷漠或社交退縮 □ 有獨留兒童在家之風險 □ 同住家人關係衝突 □ 其他：________)</p>
    <p>十五-3. 同住成員身心狀況： □ 無明顯異常　□ 尚可　□ 無同住成員　□ 訪視未遇家庭成員　□ 不佳 ／ 說明：________</p>
    <p>十五-4. 同住成員是否支持： □ 是　□ 否 ／ 說明：________</p>
    <p>十五-5. 托育工作是否影響家庭生活： □ 否　□ 是 ／ 說明：________</p>
  `,
  );

  add(
    "十六、緊急事件演練與抽問",
    `
    <p>是否有進行緊急事件演練？： □ 有　□ 無</p>
    <p>演練狀況描述：________</p>
  `,
  );

  add(
    "十七、待追蹤、改善事項",
    `
    <p>是否有待追蹤事項： □ 有　□ 無</p>
    <p>狀況說明：________</p>
  `,
  );

  add(
    "十八、建議輔導事項",
    `
    <p>建議：________</p>
  `,
  );

  add(
    "十九、托育安全宣導事項",
    `
    <p>□ 宣導五招安心睡</p>
    <p>□ 不應運用任何工具長時間約束幼兒活動，提醒不應長時間使用高腳餐椅、嬰兒床、遊戲床約束幼兒活動</p>
    <p>□ 照顧幼兒時應安全看視，注意幼兒安全，並留意幼兒互動時有無咬、抓行為，避免幼兒受傷</p>
    <p>□ 宣導托育人員應留意直徑3.17公分的物品並收納在幼兒無法碰觸之處以避免窒息，如玩具、零錢等</p>
    <p>□ 托兒使用大型遊戲設備時，請托育人員務必陪同</p>
    <p>□ 宣導嬰兒床上不應吊掛任何毛巾、衣物</p>
    <p>□ 高腳餐椅使用安全：請確保幼兒不會攀爬，且具穩固性，並妥善使用安全帶。</p>
    <p>□ 提醒托育人員應注意食用熱水、熱湯、使用熱水的安全，避免幼兒燙傷</p>
    <p>□ 其他：________</p>
  `,
  );

  add(
    "二十、宣導事項",
    `
    <p>□ 不得進行任何形式的體罰、不當管教：提醒托育人員應正向管教(包括身教、言教)，不打罵、不懲罰、不體罰，即使家長授權同意都是不可以。（不合適的行為包含，罰站、恐嚇孩子不乖就要打手手、叫孩子閉嘴、打罵孩子）</p>
    <p>□ 收托人數宣導：如有原幼兒增加過夜、全日托，應先與中心聯繫，確認收托人數未超收。</p>
    <p>□ 應專心托育：托育人員於收托時間勿擅離托育地(不得於托育時間將幼兒委託家人照顧)，如有需外出，建議由家人處理或運用非托育時間或向家長請假。</p>
    <p>□ 托育人員不得獨留幼兒在托育地，即使是領掛號信、開一樓大門…等，暫時離開一下也不可以。如獨留幼兒將違反兒少權法第51條，如有違規將會影響準公身分、且被裁罰；如因此幼兒發生意外事件將有後續刑責。</p>
    <p>□ 宣導傳染病、意外事件的緊急處理程序、通報中心之責任。</p>
    <p>□ 傳染疾病盛行，請務必加強托育地消毒與勤洗手、注意幼兒及托育人員健康。</p>
    <p>□ 宣導新收托、終托、收托異動應於異動起始日 7日內通報中心。</p>
    <p>□ 宣導托育人員應有適當紓壓管道，並提醒幼兒照顧時明顯有壓力或情緒，請聯絡中心，中心可提供相關支持、及相關資源。</p>
    <p>□ 宣導托育人員應正向管教，留意同住家人與幼兒的互動，不得使用任何不當的照顧、管教方式。</p>
    <p>□ 宣導托育人員應留意幼兒外觀是否有受傷狀況，無論傷害是否在托育地造成，均須通報中心，中心會關懷後續與處理。</p>
    <p>□ 寶寶日誌應每日以紙本、電子APP、LINE(記事本)等多元形式記錄，內容需有基本照顧事項(含時間、頻率及量等):1.飲食(喝奶、副食品)2.睡眠3.排便(換尿布、大小便)4.服藥(有托藥應敘明)及聯絡事項(受托幼兒活動情形及特殊事件等)。</p>
    <p>□ 托育時遇到緊急事件，請托育人員第一時間務必撥打119並配合119進行緊急處置，在安全狀況下聯絡家長、並回報中心。</p>
    <p>□ 其他：________</p>
  `,
  );

  add(
    "二十一、現場輔導紀錄",
    `
    <p>紀錄：________</p>
  `,
  );

  add(
    "二十二、針對建議輔導後托育人員態度",
    `
    <p>態度：________</p>
  `,
  );

  add(
    "二十三、托育人員反映需求/建議",
    `
    <p>需求與建議：________</p>
  `,
  );

  html += "</div>";
  return html;
}
