import type { Metadata } from "next";
import { Gowun_Batang, IBM_Plex_Sans_KR } from "next/font/google";
import "./globals.css";

// 한글 글꼴은 파일이 커서 미리 불러오지 않는다(preload: false).
// 브라우저가 필요한 글자 묶음만 그때그때 받는다.
const plexKr = IBM_Plex_Sans_KR({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-plex-kr",
});

const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-gowun-batang",
});

export const metadata: Metadata = {
  title: "미니 할일",
  description: "할일을 관리하는 미니 앱",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${plexKr.variable} ${gowunBatang.variable}`}>
      <body>
        <main className="flex min-h-screen w-full justify-center sm:py-10">
          <div className="relative flex w-full max-w-md flex-col bg-paper sm:min-h-[44rem] sm:rounded-sm sm:shadow-[0_1px_2px_rgb(23_44_112/0.08),0_12px_32px_-12px_rgb(23_44_112/0.18)]">
            {/* 노트 왼쪽의 빨간 여백선 */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-11 w-px bg-margin"
            />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
