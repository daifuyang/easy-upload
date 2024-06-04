import React, { useState } from "react";
import {
  CustomerServiceOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  EllipsisOutlined
} from "@ant-design/icons";
import type { PaginationProps } from "antd";
import { Col, Row, Image, Pagination, ColProps, Skeleton, Dropdown, Modal } from "antd";
import type { MenuProps } from "antd";
import { Gutter } from "antd/es/grid/row";
import { preview } from "./preview";

interface BaseNode {
  prevPath?: string;
  name?: string;
  [key: string]: any; // 允许其他属性
}

// 自定义字段名称接口
interface FieldNames {
  name: string;
  path: string;
}

interface ListProps {
  loading: boolean;
  list: BaseNode[];
  active: string;
  fieldNames?: FieldNames;
  colSpan?: ColProps;
  pagination?: false | PaginationProps;

  /** 栅格间距 */
  gutter?: Gutter | [Gutter, Gutter];
  onChange?: (page: number, pageSize: number) => void;
  onDelete?: (id: number) => void;
}

export default function List(props: ListProps) {
  const {
    loading,
    list,
    active,
    fieldNames = { name: "name", path: "prevPath" },
    gutter = [16, 16],
    colSpan = {
      flex: "20%"
    },
    pagination = false,
    onChange,
    onDelete
  } = props;
  const { name, path } = fieldNames;
  const [actionOpen, setActionOpen] = useState<any>({});

  if (loading) {
    return <Skeleton />;
  }

  const getList = (item: any) => {
    const items: MenuProps["items"] = [
      {
        key: "download",
        label: "下载"
      },
      {
        key: "edit",
        label: "编辑"
      },
      {
        key: "delete",
        danger: true,
        label: "删除"
      }
    ];

    const deleteAction = (
      <div
        className={`nextcms-upload-list-assets-item-action${
          actionOpen[item.id] ? " nextcms-upload-list-assets-item-action-active" : ""
        }`}
      >
        <Dropdown
          overlayStyle={{
            width: 60
          }}
          getPopupContainer={(node) => {
            if (node) {
              return node.parentNode;
            }
            return document.body;
          }}
          placement="bottomRight"
          open={actionOpen[item.id] || false}
          onOpenChange={(open) => {
            setActionOpen((prev: any) => ({ ...prev, [item.id]: open }));
          }}
          menu={{
            items,
            onClick: (e) => {
              switch (e.key) {
                case "download":
                  window.open(item[path], "_blank");
                  break;
                case "edit":
                  break;
                case "delete":
                  Modal.confirm({
                    title: "删除",
                    content: "确定要删除吗？",
                    okText: "确定",
                    cancelText: "取消",
                    onOk: () => {
                      onDelete?.(item.id);
                    },
                    onCancel: () => {}
                  });
                  break;
              }
            }
          }}
          trigger={["click"]}
        >
          <div className="nextcms-upload-list-assets-item-action-icon">
            <EllipsisOutlined />
          </div>
        </Dropdown>
      </div>
    );

    if (active === "image") {
      return (
        <div
          key={item.id}
          className="nextcms-upload-list-assets-item-asset nextcms-upload-list-assets-item-image"
        >
          {deleteAction}
          <div className="img-wrap">
            <Image width={"100%"} height={"100%"} src={item[path]} alt="" />
          </div>
          <div className="name">{item[name]}</div>
        </div>
      );
    } else if (active === "audio") {
      return (
        <div
          key={item.id}
          className="nextcms-upload-list-assets-item-asset nextcms-upload-list-assets-item-audio"
        >
          {deleteAction}
          <div
            onClick={() => {
              preview({
                active,
                preview: item.prevPath
              });
            }}
            className="icon-wrap"
          >
            <CustomerServiceOutlined />
          </div>
          <div className="name">{item[name]}</div>
        </div>
      );
    } else if (active === "video") {
      return (
        <div
          key={item.id}
          className="nextcms-upload-list-assets-item-asset nextcms-upload-list-assets-item-video"
        >
          {deleteAction}
          <div
            onClick={() => {
              preview({
                active,
                preview: item.prevPath
              });
            }}
            className="icon-wrap"
          >
            <VideoCameraOutlined />
          </div>
          <div className="name">{item[name]}</div>
        </div>
      );
    } else if (active === "file") {
      return (
        <div
          key={item.id}
          className="nextcms-upload-list-assets-item-asset nextcms-upload-list-assets-item-file"
        >
          {deleteAction}
          <div className="icon-wrap">
            <FileTextOutlined />
          </div>
          <div className="name">{item[name]}</div>
        </div>
      );
    }
  };

  return (
    <div className="nextcms-upload-list-container">
      <div className="nextcms-upload-list-assets">
        <Row gutter={gutter}>
          {list?.map((item, index) => (
            <Col key={index} {...colSpan}>
              <div className="nextcms-upload-list-assets-item">{getList(item)}</div>
            </Col>
          ))}
        </Row>
        {/* <Empty /> */}
      </div>
      <div className="nextcms-upload-list-assets-pagination">
        <Pagination onChange={onChange} {...pagination} />
      </div>
    </div>
  );
}
