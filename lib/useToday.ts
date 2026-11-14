"use client";

import { useSyncExternalStore } from "react";
import { todayString } from "@/lib/utils";

// 1분마다 날짜를 다시 확인해, 페이지를 켜 둔 채 자정이 지나도 "오늘"이 갱신되게 한다.
function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60_000);
  return () => clearInterval(timer);
}

// 오늘 날짜(YYYY-MM-DD, 브라우저 로컬 시간). 서버 렌더링 중에는 null.
// 서버와 브라우저의 시간대가 달라도 hydration 불일치가 나지 않도록
// 서버에서는 날짜를 계산하지 않는다.
export function useToday(): string | null {
  return useSyncExternalStore(subscribe, todayString, () => null);
}
