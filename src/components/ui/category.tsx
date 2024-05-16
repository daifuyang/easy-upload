import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React from "react";

export default function Category() {
  return (
    <div className="nextcms-upload-category">
      <div className="nextcms-upload-category-search">
        <Input suffix={<SearchOutlined />} placeholder="请输入分组名称" />
      </div>
      <div className="nextcms-upload-tree-content"></div>
    </div>
  );
}
