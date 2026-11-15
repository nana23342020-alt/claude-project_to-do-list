import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 상위 폴더(claude-project)에도 package-lock.json이 있어서 Next.js가
  // 그쪽을 프로젝트 루트로 잘못 잡고 모듈을 섞어 불러온다(500 오류).
  // 이 앱 폴더를 루트로 고정한다.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
