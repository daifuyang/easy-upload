import { Col, Row, Image, Pagination } from "antd";
import React from "react";

export default function List(props) {
  return (
    <div className="nextcms-upload-list-container">
      <div className="nextcms-upload-list-assets">
        <Row gutter={[16, 16]}>
          {
            // 生成10个空数组
            new Array(10).fill(0).map((_, index) => (
              <Col key={index} flex={"20%"}>
                <div className="nextcms-upload-list-menu-assets-item">
                  <div className="nextcms-upload-list-menu-assets-item-image">
                    <div className="img-wrap">
                      <Image
                        width={"100%"}
                        height={"100%"}
                        src="http://gips3.baidu.com/it/u=617385017,3644165978&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960"
                        alt=""
                      />
                    </div>
                    <div className="name">图片名称</div>
                  </div>
                </div>
              </Col>
            ))
          }
        </Row>
        {/* <Empty /> */}
      </div>
      <div className="nextcms-upload-list-assets-pagination">
        <Pagination
          showQuickJumper
          defaultCurrent={2}
          total={500}
          onChange={(pageNumber) => {
            console.log("Page: ", pageNumber);
          }}
        />
      </div>
    </div>
  );
}
