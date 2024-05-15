import React, { useEffect, useRef, useState } from "react";
import { Input, Tabs, Tree, TreeDataNode } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface UploadModalProps {}

export default function Assets(props: UploadModalProps) {
  const [active, setActive] = useState("images");
  const [treeActive, setTreeActive] = useState(["all"]);

  const treeData: TreeDataNode[] = [
    {
      title: "全部图片",
      key: "all",
      children: [
        {
          title: "默认分组",
          key: "default"
        },
        {
          title: "富文本编辑器",
          key: "richText"
        }
      ]
    }
  ];

  const navClick = (key, e) => {};

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
      label: "其他"
    }
  ];

  useEffect(() => {}, []);

  return (
    <>
      <div className="nextcms-upload-container">
        <Tabs defaultActiveKey="images" items={items} />
        <div className="nextcms-upload-content">
          <div className="nextcms-upload-tree">
            <div className="nextcms-upload-tree-search">
              <Input suffix={<SearchOutlined />} placeholder="请输入分组名称" />
            </div>
            <div className="nextcms-upload-tree-content">
              <Tree defaultSelectedKeys={treeActive} defaultExpandAll treeData={treeData} blockNode />
            </div>
          </div>
          <div className="nextcms-upload-list">222</div>
        </div>
      </div>
    </>
  );
}
