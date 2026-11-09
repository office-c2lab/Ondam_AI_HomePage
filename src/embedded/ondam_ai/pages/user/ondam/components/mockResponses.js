export function createMockAnswer(prompt) {
  const subject = prompt.replace(/[?!.]+$/g, '').trim();

  if (/미승인|보안|위험|민감정보/.test(prompt)) {
    return `**${subject}** 점검 결과를 요약했습니다.\n\n1. 승인되지 않은 외부 AI 사용 여부를 식별합니다.\n2. 민감정보 입력과 정책 위반 가능성을 분류합니다.\n3. 위험도에 따라 차단, 알림, 추가 검토 항목으로 구분합니다.\n\nONDAM AI에서는 내부 서비스와 외부 생성형 AI의 활동을 하나의 정책 흐름으로 관리할 수 있습니다.`;
  }

  if (/운영|현황|서비스|요약|리포트/.test(prompt)) {
    return `요청하신 **${subject}**를 통합 관점에서 정리했습니다.\n\n• Discover에서 연결된 AI와 사용 현황을 파악합니다.\n• Control Internal과 External에서 내부·외부 정책을 함께 적용합니다.\n• Manage에서 비용, 권한, 감사 이력을 지속적으로 관리합니다.\n\n흩어진 AI 운영 정보를 하나의 화면과 정책 체계로 연결할 수 있습니다.`;
  }

  if (/비용|사용량|부서/.test(prompt)) {
    return `**${subject}** 분석 결과입니다.\n\n부서별 사용량, 연결된 모델, 호출 비용을 비교해 과다 사용 구간과 중복 도입 항목을 확인할 수 있습니다. 정책과 예산 기준을 함께 적용하면 운영 효율과 통제 수준을 동시에 높일 수 있습니다.`;
  }

  return `**${subject}**에 대해 ONDAM AI 관점에서 정리해 볼게요.\n\n현재 연결된 AI 서비스, 적용 정책, 사용자 권한, 운영 이력을 함께 살펴보면 필요한 조치를 빠르게 판단할 수 있습니다. 원하시면 Discover, Control, Manage 중 하나의 관점으로 더 구체화해 드릴게요.`;
}
