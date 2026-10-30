"use client";

import { useState, useEffect } from "react";

export default function AboutPage() {
  const colors = ["#fff3cd", "#f8d7da", "#000000"];
  const [bgColor, setBgColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#f0e6d8");

  useEffect(() => {
    const random = Math.floor(Math.random() * 3);
    setBgColor(colors[random]);
    setTextColor(random === 2 ? "#f0e6d8" : "#2d1b2e");
  }, []);

  return (
    <main style={{ background: bgColor, minHeight: "100vh", padding: "80px 20px", color: textColor, transition: "background 0.5s" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <a href="/" style={{ color: textColor, textDecoration: "none", fontSize: "1.1rem", opacity: 0.8 }}>← 返回首页</a>
        <h1 style={{ color: textColor, fontSize: "3.5rem", fontFamily: "'Dancing Script', cursive", margin: "40px 0 30px", fontWeight: "bold" }}>
          About Me
        </h1>
        <div style={{ fontSize: "1.3rem", lineHeight: "2.2", color: textColor, fontWeight: "500" }}>
          <p style={{ marginBottom: "20px" }}>郭一萱，香港城市大学创意媒体硕士在读，新闻学本科背景。</p>
          <p style={{ marginBottom: "20px" }}>专注内容运营与新媒体创作，曾在搜狐视频负责国风社区生态运营与汉服赛事宣发，在小叶子音乐操盘海外社媒矩阵，也在河北青年报做过深度新闻采编。</p>
          <p>喜欢用视觉和视频讲好一个故事，在运营与创作之间找平衡。</p>
        </div>
      </div>
    </main>
  );
}
