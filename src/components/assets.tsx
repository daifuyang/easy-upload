import React, { useRef, useState } from "react";
import { Button, Tabs } from "antd";
import UploadModal, { UploadModalRef } from "./uploadModal";
import Category from "./ui/category";
import List from "./ui/list";

interface UploadModalProps {}

const tabsTitleMap: any = {
  images: "图片",
  audio: "音频",
  video: "视频",
  file: "文件"
};

const defaultAcceptMap: any = {
  images: "jpg,jpeg,png,gif,bmp",
  audio: "m4a,mp3",
  video: "mp4,avi,wmv,mov,flv,rmvb,3gp,m4v,mkv,webm",
  file: "pptx,ppt,docx,doc,xls,xlsx,pdf,csv,xlsm,txt"
};

export default function Assets(props: UploadModalProps) {
  const [active, setActive] = useState<string>("images");
  const modalRef = useRef<UploadModalRef>(null);

  const items = [
    {
      key: "images",
      label: "图片"
    },
    {
      key: "audio",
      label: "音频"
    },
    {
      key: "video",
      label: "视频"
    },
    {
      key: "file",
      label: "文件"
    }
  ];

  return (
    <>
      <UploadModal accept={defaultAcceptMap[active]} active={active} ref={modalRef} />
      <div className="nextcms-upload-container">
        <Tabs onChange={(key: string) => setActive(key)} defaultActiveKey="images" items={items} />
        <div className="nextcms-upload-content">
           <Category />
          <div className="nextcms-upload-list">
            <div className="nextcms-upload-list-header">
              <div className="nextcms-upload-list-header-top">
                <Button
                  onClick={() => {
                    modalRef.current?.open({
                      title: `上传${tabsTitleMap[active]}`
                    });
                  }}
                  type="primary"
                >
                  上传{tabsTitleMap[active]}
                </Button>
              </div>
              <div className="nextcms-upload-list-menu">
                <div className="nextcms-upload-list-menu-count">素材总量：0</div>
              </div>
            </div>
            <List />
          </div>
        </div>
      </div>
    </>
  );
}
