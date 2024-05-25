import type { PaginationProps } from "antd";
import { Col, Row, Image, Pagination, ColProps } from "antd";
import { Gutter } from "antd/es/grid/row";
import React from "react";

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
  list: BaseNode[];
  active: string;
  fieldNames?: FieldNames;
  colSpan?: ColProps;
  pagination?: false | PaginationProps;

  /** 栅格间距 */
  gutter?: Gutter | [Gutter, Gutter];
  onChange?: (page: number, pageSize: number) => void;
}

export default function List(props: ListProps) {
  const {
    list,
    active,
    fieldNames = { name: "name", path: "prevPath" },
    gutter = [16, 16],
    colSpan = {
      flex: "20%"
    },
    pagination = false,
    onChange
  } = props;
  const { name, path } = fieldNames;
  return (
    <div className="nextcms-upload-list-container">
      <div className="nextcms-upload-list-assets">
        <Row gutter={gutter}>
          {list?.map((item, index) => (
            <Col key={index} {...colSpan}>
              <div className="nextcms-upload-list-assets-item">
                <div className="nextcms-upload-list-assets-item-image">
                  <div className="img-wrap">
                    <Image width={"100%"} height={"100%"} src={item[path]} alt="" />
                  </div>
                  <div className="name">{item[name]}</div>
                </div>
              </div>
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
