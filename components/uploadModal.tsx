import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

interface UploadModalProps {}

const navs = [
  {
    key: "images",
    title: "图片"
  },
  {
    key: "audio",
    title: "音频"
  },
  {
    key: "video",
    title: "视频"
  },
  {
    key: "file",
    title: "其他"
  }
];

export default function UploadModal(props: UploadModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navListRef = useRef<HTMLDivElement>(null);

  const [navActive, setNavActive] = useState("images");
  const [navItemStyle, setNavItemStyle] = useState({});

  const navClick = (key, e) => {
    if (containerRef.current) {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const navItemRect = e.target?.getBoundingClientRect();
      const left = navItemRect.x - containerRect?.x || 0;
      setNavItemStyle({
        width: navItemRect.width,
        left
      });
      setNavActive(key);
    }
  };

  useEffect(() => {
    if (navListRef.current?.firstChild) {
      const rect = navListRef.current?.firstChild.getBoundingClientRect();
      if (rect) {
        setNavItemStyle({
          width: rect.width,
          left: 0
        });
      }
    }
  }, []);

  return (
    <>
      <div ref={containerRef} className="nextcms-upload-container">
        <div className="nextcms-upload-tabs">
          <div className="nextcms-tabs-nav">
            <div className="nextcms-tabs-nav-wrap">
              <div ref={navListRef} className="nextcms-tabs-nav-list">
                {navs?.map((item, i) => (
                  <div
                    key={item.key}
                    onClick={(e) => {
                      navClick(item.key, e);
                    }}
                    style={{
                      margin: i > 0 ? "0 0 0 32px" : ""
                    }}
                    className={classNames({
                      "nextcms-tabs-tab": true,
                      "nextcms-tabs-tab-active": navActive === item.key
                    })}
                  >
                    <div className="nextcms-tabs-tab-btn">{item.title}</div>
                  </div>
                ))}
                <div style={navItemStyle} className="nextcms-tabs-ink-bar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
