import React from "react";
import { Modal } from "antd";

export function preview(props: any) {
  const { active, preview } = props;
  const previewContent = (preview: string) => {
    switch (active) {
      case "audio":
        return <audio style={{ width: "100%" }} src={preview} controls />;
      case "video":
        return <video style={{ width: "100%" }} src={preview} controls />;
    }
  };

  return Modal.info({
    title: "预览",
    icon: <></>,
    width: 750,
    centered: true,

    content: <div>{previewContent(preview)}</div>,
    closable: true,
    footer: false
  });
}
