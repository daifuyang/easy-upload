import { SearchOutlined } from "@ant-design/icons";
import { Input, Tree } from "antd";
import type { TreeProps } from 'antd';
import React from "react";

interface CategoryProps {
  
}

const treeData: any[] = [
  {
    title: "资源分类测试",
    key: "root",
    children: [
      {
        title: "图像",
        key: "image",
        children: [
          {
            title: "背景图片",
            key: "background_image",
            children: []
          },
          {
            title: "图标",
            key: "icons",
            children: []
          },
          {
            title: "产品图片",
            key: "product_images",
            children: []
          }
        ]
      },
      {
        title: "文本",
        key: "text",
        children: [
          {
            title: "标语",
            key: "slogans",
            children: []
          },
          {
            title: "产品描述",
            key: "product_descriptions",
            children: []
          }
        ]
      },
      {
        title: "音频",
        key: "audio",
        children: [
          {
            title: "音乐",
            key: "music",
            children: []
          },
          {
            title: "音效",
            key: "sound_effects",
            children: []
          }
        ]
      }
    ]
  }
];

export default function Category(props: CategoryProps) {
  

  const onDragEnter: TreeProps['onDragEnter'] = (info) => {
    console.log(info);
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop: TreeProps['onDrop'] = (info) => {
    console.log(info);
  }

  return (
    <div className="nextcms-upload-category">
      <div className="nextcms-upload-category-search">
        <Input
          onChange={(e) => {
            const { value } = e.target;
            if (value) {
              onCategorySearch(value);
            }
          }}
          suffix={<SearchOutlined />}
          placeholder="请输入分组名称"
        />
      </div>
      <div className="nextcms-upload-category-content">
        <Tree defaultExpandAll treeData={treeData}  className="draggable-tree" draggable blockNode onDragEnter={onDragEnter}
      onDrop={onDrop} />
      </div>
    </div>
  );
}
