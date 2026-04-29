import { VisitRecord } from '../types';

export const generateVisitReport = (record: VisitRecord): string => {
  const followUpItems: { target: string, label: string, status: string }[] = [];

  if (record.siteCheckResult === '不符合') followUpItems.push({ target: '托育查核', label: '訪視現場親見幼兒與收托資料', status: '不符合' });
  if (record.feeCheckResult === '否') followUpItems.push({ target: '托育查核', label: '托育人員收費是否與托育契約書一致', status: '否' });
  if (record.envCheckResult === '不符合') followUpItems.push({ target: '托育環境', label: '托育環評40項檢查結果', status: '不符合' });
  if (record.routineCheck === '不符合') followUpItems.push({ target: '托育品質', label: '基本作息與活動時間', status: '不符合' });
  if (record.dietQuality === '不符合') followUpItems.push({ target: '托育品質', label: '均衡飲食', status: '不符合' });
  if (record.mealSpace === '不符合') followUpItems.push({ target: '托育品質', label: '用餐空間、用品', status: '不符合' });
  if (record.mealWay === '不符合') followUpItems.push({ target: '托育品質', label: '餵食或用餐方式', status: '不符合' });
  if (record.toyClean === '不符合') followUpItems.push({ target: '托育品質', label: '教玩具、寢具清潔', status: '不符合' });
  if (record.envClean === '不符合') followUpItems.push({ target: '托育品質', label: '環境衛生整潔', status: '不符合' });
  if (record.gameInteraction === '否') followUpItems.push({ target: '托育人員與托兒間互動與社會行為', label: '能與幼兒經常進行遊戲互動', status: '否' });
  if (record.positiveResponse === '否') followUpItems.push({ target: '托育人員與托兒間互動與社會行為', label: '能敏銳、正向、溫暖親切的回應幼兒', status: '否' });
  if (record.socialDevSupport === '否') followUpItems.push({ target: '托育人員與托兒間互動與社會行為', label: '能藉由對幼兒間互動和合作的協助來促進其社會發展', status: '否' });
  if (record.visitorEval === '異常') followUpItems.push({ target: '托育人員現況', label: '訪員評估', status: '異常' });
  if (record.familyHealth === '不佳') followUpItems.push({ target: '托育人員現況', label: '同住成員身心狀況', status: '不佳' });
  if (record.familySupport === '否') followUpItems.push({ target: '托育人員現況', label: '同住成員是否支持', status: '否' });
  if (record.workImpactFamily === '是') followUpItems.push({ target: '托育人員現況', label: '托育工作是否影響家庭', status: '是' });

  record.childStatuses.forEach((c) => {
    const name = c.name || '未命名幼兒';
    if (c.hasLog === '無') followUpItems.push({ target: name, label: '寶寶日誌', status: '無' });
    if (c.health === '異常') followUpItems.push({ target: name, label: '健康狀況', status: '異常' });
    if (c.spirit === '異常') followUpItems.push({ target: name, label: '精神狀況', status: '異常' });
    if (c.appearance === '異常') followUpItems.push({ target: name, label: '身體外觀', status: '異常' });
    if (c.sleepPosture === '一歲以下幼兒非仰睡') followUpItems.push({ target: name, label: '睡姿', status: '一歲以下幼兒非仰睡' });
    if (c.devCheck === '異常') followUpItems.push({ target: name, label: '發展檢核', status: '異常' });
    if (c.interaction === '異常') followUpItems.push({ target: name, label: '互動情形', status: '異常' });
  });

  const issuesText = followUpItems.length > 0 
    ? followUpItems.map(item => `- [${item.target}] ${item.label}: ${item.status}`).join('\n')
    : "";

  const s = (val: any) => val || '________';
  const nl2br = (val: any) => val ? String(val).replace(/\n/g, '<br/>') : '________';
  
  const otherS = (val: string, otherVal: string) => {
    if (val === '其他') return otherVal || '________';
    return val || '________';
  };

  const multiOtherS = (vals: string[], otherVal: string) => {
    return vals.map(v => v === '其他' ? otherVal : v).filter(Boolean).join('、') || '________';
  };

  const finalNextFollowUp = record.nextFollowUpFocus 
    ? (issuesText ? `${record.nextFollowUpFocus}\n\n${issuesText}` : record.nextFollowUpFocus)
    : (issuesText || '________');

  const childrenList = !record.hasChildren 
    ? null
    : record.hasChildren === '無托兒' 
      ? '<p>無托兒</p>'
      : record.children.map((c, i) => `
    <p><strong>幼兒 ${i + 1}：</strong> ${s(c.name)} (${s(c.status)}) / ID: ${s(c.idNumber)} / 生日: ${s(c.birthday)} / 起始日: ${s(c.startDate)}</p>
  `).join('');

  const jointInfo = record.isJoint === '是' ? `
    <p><strong>聯合收托資訊：</strong></p>
    <p>「${s(record.jointProvider1Name)}」和「${s(record.jointProvider2Name)}」聯合收托，「${s(record.jointProvider1Name)}」名下幼兒為「${s(record.jointProvider1Children)}」，「${s(record.jointProvider2Name)}」名下幼兒為「${s(record.jointProvider2Children)}」</p>
  ` : '';

  const childStatusReports = !record.childEnrollmentStatus
    ? null
    : record.childEnrollmentStatus === '無托兒'
      ? '<p>無托兒</p>'
      : record.childStatuses.map((c, i) => {
        if (c.attendanceStatus === '當天幼兒未送托') {
          return `
            <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
              <p><strong>幼兒 ${i + 1}：</strong> ${s(c.name)} / 年齡: ${s(c.age)}</p>
              <p><strong>當天幼兒未送托：</strong> 是 (原因：${s(c.notPresentReason)})</p>
            </div>
          `;
        }
        
        const cleaningInfo = [
          c.diaperFreq ? `換尿布頻率: ${c.diaperFreq}` : '',
          c.bathCleaning ? `洗澡、清洗屁屁（多位托兒如何安排）: ${c.bathCleaning}` : '',
          c.toiletTraining ? `如廁練習: ${c.toiletTraining}` : '',
          c.cleaningOther ? `${c.cleaningOther}` : ''
        ].filter(Boolean).join(' / ');

        const sleepInfoParts = [
          c.sleepStatus.length > 0 ? `${c.sleepStatus.map(v => v === '其他' ? c.sleepStatusOther : v).join('、')}` : '',
          c.sleepPosture ? `睡姿: ${otherS(c.sleepPosture, c.sleepPostureOther)}${c.sleepPosture === '一歲以下幼兒非仰睡（應輔導）' ? ` (輔導：${s(c.sleepNonBackGuidance)})` : ''}` : '',
          c.sleepTime ? `時間: ${c.sleepTime}` : '',
          c.sleepArea ? `區域: ${c.sleepArea}` : '',
          c.sleepSoothing ? `睡眠與情緒安撫: ${c.sleepSoothing}` : ''
        ].filter(Boolean);

        const dietInfoParts = [
          c.dietTypes.length > 0 ? `餐食型態: ${c.dietTypes.map(v => v === '其他' ? c.dietTypesOther : v).join('、')}` : '',
          c.dietContent ? `內容: ${c.dietContent}` : '',
          c.dietStatus.length > 0 ? `${c.dietStatus.map(v => v === '其他' ? c.dietStatusOther : v).join('、')}` : '',
          c.dietDesc ? `描述: ${c.dietDesc}` : ''
        ].filter(Boolean);

        const devCheckParts = [
          c.devCheck ? `${otherS(c.devCheck, c.devCheckOther)}` : '',
          c.devStage ? `階段: ${c.devStage}` : '',
          c.devReport ? `發展異常通報: ${s(c.devReport)}${c.devReport === '已通報' ? ` (${c.devReportTime})` : ` (${c.devReportReason})`}` : '',
          c.devPrevDate ? `先前日期: ${c.devPrevDate}` : ''
        ].filter(Boolean);

        const lines = [
          `<p><strong>幼兒 ${i + 1}：</strong> ${s(c.name)} (${c.isNew === '是' ? '新收托' : '舊生'}) / 年齡: ${s(c.age)} / 型態: ${otherS(c.careType, c.careTypeOther)}</p>`,
          c.hasLog ? `<p><strong>寶寶日誌：</strong> ${c.hasLog === '有' ? `有 (${c.logTypes.map(v => v === '其他' ? c.logOther : v).join('、')})` : `無 (輔導：${s(c.logGuidance)})`}</p>` : '',
          (c.health || c.healthDesc) ? `<p><strong>健康：</strong> ${c.health}${c.health === '異常' ? ` (${c.healthIssues.map(v => v === '其他' ? c.healthOther : v).join('、')})` : ''}${ (c.health || (c.health === '異常' && c.healthIssues.length > 0)) && c.healthDesc ? '／' : ''}${c.healthDesc}</p>` : '',
          (c.spirit || c.spiritDesc) ? `<p><strong>精神：</strong> ${c.spirit}${c.spirit === '異常' ? ` (${c.spiritIssues.map(v => v === '其他' ? c.spiritOther : v).join('、')})` : ''}${ (c.spirit || (c.spirit === '異常' && c.spiritIssues.length > 0)) && c.spiritDesc ? '／' : ''}${c.spiritDesc}</p>` : '',
          (c.appearance || c.appearanceDesc) ? `<p><strong>身體外觀</strong> ${c.appearance}${c.appearance === '異常' ? ` (${c.appearanceIssues.map(v => v === '其他' ? c.appearanceOther : v).join('、')})` : ''}${ (c.appearance || (c.appearance === '異常' && c.appearanceIssues.length > 0)) && c.appearanceDesc ? '／' : ''}${c.appearanceDesc}</p>` : '',
          sleepInfoParts.length > 0 ? `<p><strong>睡眠：</strong> ${sleepInfoParts.join(' / ')}</p>` : '',
          cleaningInfo ? `<p><strong>清潔：</strong> ${cleaningInfo}</p>` : '',
          devCheckParts.length > 0 ? `<p><strong>發展檢核：</strong> ${devCheckParts.join(' / ')}</p>` : '',
          c.devDesc ? `<p><strong>發展描述：</strong> ${nl2br(c.devDesc)}</p>` : '',
          dietInfoParts.length > 0 ? `<p><strong>飲食：</strong> ${dietInfoParts.join(' / ')}</p>` : '',
          c.interaction ? `<p><strong>幼兒與托育人員互動情形：</strong> ${otherS(c.interaction, c.interactionOther)} ${c.interactionDesc ? `/ 說明: ${s(c.interactionDesc)}` : ''}</p>` : '',
          c.otherDesc ? `<p><strong>其他描述：</strong> ${nl2br(c.otherDesc)}</p>` : '',
          c.isNew === '是' ? `
            ${c.adaptStatus ? `<p><strong>新收托適應情況：</strong> ${s(c.adaptStatus)}</p>` : ''}
            ${c.parentComm ? `<p><strong>新收托保親溝通：</strong> ${s(c.parentComm)}</p>` : ''}
            ${c.peerImpact ? `<p><strong>新托兒加入對其他幼兒影響：</strong> ${s(c.peerImpact)}</p>` : ''}
          ` : ''
        ].filter(Boolean).join('');

        return `<div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">${lines}</div>`;
      }).join('');

  const renderSection = (title: string, content: string | null | undefined, isHtml: boolean = false) => {
    if (!content || content === '________' || (Array.isArray(content) && content.length === 0)) return '';
    return `
      <div style="margin-bottom: 25px;">
        <h3 style="background: #fceef4; color: #e34b87; padding: 8px 12px; border-left: 4px solid #e34b87; margin-bottom: 10px;">◎ ${title}</h3>
        ${isHtml ? content : `<p>${nl2br(content)}</p>`}
      </div>
    `;
  };

  const providerInfo = [
    record.providerName ? `姓名：${record.providerName}` : '',
    record.providerNo ? `編號：${record.providerNo}` : '',
    record.providerId ? `身分證字號：${record.providerId}` : ''
  ].filter(Boolean).join(' / ');

  const visitInfo = [
    record.visitMethod ? `方式：${record.visitMethod === '其他' ? record.visitMethodOther : record.visitMethod}` : '',
    record.visitDate ? `日期：${record.visitDate}` : '',
    record.visitTime ? `時間：${record.visitTime}` : '',
    record.visitorName ? `訪視員：${record.visitorName}` : ''
  ].filter(Boolean).join(' / ');

  const visitTypeInfo = [
    record.serviceType ? `服務類型：${record.serviceType}` : '',
    record.visitCategories.length > 0 ? `類別：${record.visitCategories.map(cat => cat === '初次訪視' && record.initialVisitCount ? `${cat}(第${record.initialVisitCount}次初訪)` : cat).join('、')}` : '',
    record.visitCategories.includes('新收托訪視') && record.newChildName ? `新收托幼兒：${record.newChildName}` : '',
    record.visitCategories.includes('加強訪視') && record.reinforceReason ? `加強原因：${record.reinforceReason}` : '',
    record.annualVisitCount ? `年度應訪：${record.annualVisitCount} 次` : '',
    record.currentVisitCount ? `本次為第 ${record.currentVisitCount} 次` : '',
    record.visitCountDesc || ''
  ].filter(Boolean).join(' / ');

  const checkInfo = [
    record.unitName ? `單位：${record.unitName}` : '',
    record.subsidyChildCount ? `補助人數：${record.subsidyChildCount}人` : '',
    record.subsidyChildNames ? `姓名：${record.subsidyChildNames}` : '',
    record.hasNoSubsidyChild ? `是否有未申請補助幼兒：${record.hasNoSubsidyChild}${record.hasNoSubsidyChild === '是' ? ` (原因：${record.noSubsidyInfo})` : ''}` : '',
    record.actualChildCount ? `實際收托：${record.actualChildCount} 人` : '',
    record.siteCheckResult ? `訪視現場親見幼兒與收托資料：${record.siteCheckResult}${record.siteCheckResult === '不符合' ? ` (原因：${record.siteCheckReason})` : ''}` : '',
    record.feeCheckResult ? `托育人員收費是否與托育契約一致：${record.feeCheckResult}${record.feeCheckResult === '否' ? ` (原因：${record.feeCheckReason})` : ''}` : '',
    record.feeDetails ? `幼兒托育時間及費用：<br/>${nl2br(record.feeDetails)}` : ''
  ].filter(Boolean).join('<br/>');

  const envInfo = [
    record.envCheckResult ? `托育環境安全檢核：${record.envCheckResult}${record.envCheckResult === '不符合' ? ` (原因：${record.envCheckReason})` : ''}` : '',
    record.envCheckItems && record.envCheckItems.length > 0 ? `不符合指標：<br/>${record.envCheckItems.join('<br/>')}` : '',
    record.envFacilities.length > 0 ? `設施設備：${multiOtherS(record.envFacilities, record.envFacilitiesOther)}` : '',
    record.envComfort.length > 0 ? `舒適度：${multiOtherS(record.envComfort, record.envComfortOther)}` : '',
    record.noSmokingResult ? `禁菸標誌：${record.noSmokingResult}${record.noSmokingResult === '不符合' ? ` (說明：${record.noSmokingDesc})` : ''}` : ''
  ].filter(Boolean).join('<br/>');

  const qualityInfo = [
    (record.routineCheck || record.routineOther) ? `基本作息與活動時間：${record.routineCheck}${record.routineCheck && record.routineOther ? '／' : ''}${record.routineOther}` : '',
    record.routineDesc ? `輔導措施說明：${record.routineDesc}` : '',
    record.activities.length > 0 ? `教玩具活動：${multiOtherS(record.activities, record.activitiesOther)}` : '',
    record.mealPrep.length > 0 ? `備餐方式及時間：${multiOtherS(record.mealPrep, record.mealPrepOther)}` : '',
    (record.dietQuality || record.dietQualityOther) ? `依兒童年齡提供多樣化飲食：${record.dietQuality}${record.dietQuality && record.dietQualityOther ? '／' : ''}${record.dietQualityOther}` : '',
    (record.mealSpace || record.mealSpaceOther) ? `用餐空間、用品合宜且足夠：${record.mealSpace}${record.mealSpace && record.mealSpaceOther ? '／' : ''}${record.mealSpaceOther}` : '',
    (record.mealWay || record.mealWayOther) ? `適齡的餵食或用餐方式：${record.mealWay}${record.mealWay && record.mealWayOther ? '／' : ''}${record.mealWayOther}` : '',
    record.mealCleanProcess ? `用餐後環境清潔流程：${record.mealCleanProcess}` : '',
    record.childCleanAfterMeal ? `用餐完幼兒清潔（擦臉、刷牙）：${record.childCleanAfterMeal}` : '',
    record.toyClean ? `教玩具清潔：${otherS(record.toyClean, record.toyCleanOther)}${record.toyClean === '不符合' ? ` (說明：${record.toyCleanDesc})` : ''}` : '',
    record.envClean ? `環境衛生：${otherS(record.envClean, record.envCleanOther)}${record.envClean === '不符合' ? ` (說明：${record.envCleanDesc})` : ''}` : '',
    record.qualityCheckResult ? `照顧品質評估指標檢核：${record.qualityCheckResult}` : '',
    record.qualityCheckItems && record.qualityCheckItems.length > 0 ? `不符合指標：<br/>${record.qualityCheckItems.join('<br/>')}` : '',
    record.qualityCheckReason ? `不符合原因說明：<br/>${nl2br(record.qualityCheckReason)}` : '',
    record.fourChildCheckResult ? `居家托育人員收托4名兒童訪視檢核表：${record.fourChildCheckResult}` : '',
    record.fourChildCheckItems && record.fourChildCheckItems.length > 0 ? `不符合指標：<br/>${record.fourChildCheckItems.map(item => `• ${item}`).join('<br/>')}` : '',
    record.fourChildCheckReason ? `不符合原因說明：<br/>${nl2br(record.fourChildCheckReason)}` : '',
    record.qualityDesc ? `托育品質說明：<br/>${nl2br(record.qualityDesc)}` : ''
  ].filter(Boolean).join('<br/>');

  const interactionInfo = [
    record.gameInteraction ? `能與幼兒經常進行遊戲互動：${record.gameInteraction}${record.gameInteraction === '否' ? ` (說明：${record.gameInteractionDesc})` : ''}` : '',
    record.positiveResponse ? `能敏銳、正向、溫暖親切的回應幼兒：${record.positiveResponse}${record.positiveResponse === '否' ? ` (說明：${record.positiveResponseDesc})` : ''}` : '',
    record.socialDevSupport ? `能藉由對幼兒間互動和合作的協助來促進其社會發展：${record.socialDevSupport}${record.socialDevSupport === '否' ? ` (說明：${record.socialDevSupportDesc})` : ''}` : '',
    record.otherInteractionObs ? `其他觀察：<br/>${nl2br(record.otherInteractionObs)}` : ''
  ].filter(Boolean).join('<br/>');

  const relationshipInfo = [
    record.dailyHandover ? `交接方式：${record.dailyHandover}` : '',
    record.parentCooperation ? `合作狀況：${record.parentCooperation}` : ''
  ].filter(Boolean).join('<br/>');

  const providerStatusInfo = [
    record.providerHealthSelf ? `健康自述：${record.providerHealthSelf}` : '',
    record.visitorEval ? `訪員評估：${otherS(record.visitorEval, record.visitorEvalOther)}${record.visitorEval === '異常' ? ` (原因：${record.visitorEvalReasons.map(v => v === '其他' ? record.visitorEvalOther : v).join('、')})` : ''}` : '',
    (record.familyHealth || record.familyHealthDesc) ? `同住成員身心：${record.familyHealth}${record.familyHealth && record.familyHealthDesc ? '／' : ''}${record.familyHealthDesc}` : '',
    (record.familySupport || record.familySupportDesc) ? `家人支持：${record.familySupport}${record.familySupport && record.familySupportDesc ? '／' : ''}${record.familySupportDesc}` : '',
    (record.workImpactFamily || record.workImpactFamilyDesc) ? `影響家庭：${record.workImpactFamily}${record.workImpactFamily && record.workImpactFamilyDesc ? '／' : ''}${record.workImpactFamilyDesc}` : ''
  ].filter(Boolean).join('<br/>');

  const emergencyInfo = [
    record.hasEmergencyDrill ? `是否有進行演練：${record.hasEmergencyDrill}` : '',
    record.emergencyDrillDesc ? `演練狀況：<br/>${nl2br(record.emergencyDrillDesc)}` : ''
  ].filter(Boolean).join('<br/>');

  const pendingInfo = [
    record.hasPendingFollowUp ? `是否有待追蹤事項：${record.hasPendingFollowUp}` : '',
    record.hasPendingFollowUp === '有' ? `狀況說明：<br/>${nl2br(record.pendingFollowUp)}` : ''
  ].filter(Boolean).join('<br/>');

  const formatPropaganda = (vals: string[], otherVal: string) => {
    if (vals.length === 0) return null;
    return vals.map(v => {
      const content = v === '其他' ? otherVal : v;
      return content ? `• ${nl2br(content)}` : '';
    }).filter(Boolean).join('<br/>');
  };

  return `
    <div style="font-family: 'Microsoft JhengHei', sans-serif; line-height: 1.6; color: #333;">
      <h1 style="text-align: center; color: #e34b87; margin-bottom: 30px;">居家托育服務中心訪視紀錄表</h1>
      
      ${renderSection('托育人員資料', providerInfo, true)}
      ${renderSection('訪視資料', visitInfo, true)}
      ${renderSection('托育狀況', childrenList, true)}
      ${renderSection('訪視類型', visitTypeInfo + (jointInfo ? `<br/>${jointInfo}` : ''), true)}
      ${renderSection('前次輔導建議事項追蹤與回應', record.prevFollowUp)}
      ${renderSection('本次訪視重點', record.currentVisitFocus)}
      ${renderSection('托育查核', checkInfo, true)}
      ${renderSection('媒合需求', record.matchNeeds)}
      ${renderSection('訪視狀況簡述', record.visitStatusDesc)}
      ${renderSection('收托幼兒狀況', childStatusReports, true)}
      ${renderSection('托育環境', envInfo, true)}
      ${renderSection('托育品質', qualityInfo, true)}
      ${renderSection('托育人員與托兒間互動與社會行為', interactionInfo, true)}
      ${renderSection('保親關係', relationshipInfo, true)}
      ${renderSection('托育人員現況', providerStatusInfo, true)}
      ${renderSection('緊急事件演練與抽問', emergencyInfo, true)}
      ${renderSection('待追蹤、改善事項', pendingInfo, true)}
      ${renderSection('建議輔導事項', record.suggestedGuidance)}
      ${renderSection('托育安全宣導事項', formatPropaganda(record.safetyPropaganda, record.safetyPropagandaOther), true)}
      ${renderSection('宣導事項', formatPropaganda(record.generalPropaganda, record.generalPropagandaOther), true)}
      ${renderSection('現場輔導紀錄', record.fieldGuidanceRecord)}
      ${renderSection('針對建議輔導後托育人員態度', record.providerAttitude)}
      ${renderSection('托育人員反映需求/建議', record.serviceNeeds)}
      ${renderSection('下次輔導重點', finalNextFollowUp)}
      ${renderSection('是否違反考核項目', record.isViolation ? `${record.isViolation}${record.isViolation === '是' && record.reviewResultDesc ? `<br/>說明：${nl2br(record.reviewResultDesc)}` : ''}` : '', true)}
    </div>
  `;
};
