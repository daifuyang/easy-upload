import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Form, Modal, Row, Select, Upload, Image } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { getBase64 } from "../utils/util";

const { Dragger } = Upload;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface UploadModalProps {
  active: string;
  accept?: string;
  onCancel?: () => void;
  onOk?: () => void;
}

interface openParams {
  title?: string;
}

export interface UploadModalRef {
  open: (data: openParams) => void;
  close: () => void;
}

const UploadModal = forwardRef<UploadModalRef, UploadModalProps>((props, ref) => {
  const { active, accept } = props;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("上传");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onClose = () => {
    const next = () => {
      setFileList([]);
      setTitle("");
      setOpen(false);
    };

    if (fileList?.length > 0) {
      Modal.confirm({
        title: "警告",
        content: "您还未保存上传的文件，退出将不会保存，是否确认退出？",
        centered: true,
        onOk: next
      });
    } else {
      next();
    }
  };

  useImperativeHandle(ref, () => ({
    open(data) {
      if (data?.title) {
        setTitle(data.title);
      }
      setOpen(true);
    },
    close() {
      onClose();
    }
  }));

  const assetsPreview = () => {
    const deleteFile = (index: number) => {
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    };

    const previewContent = (file: UploadFile) => {
      switch (active) {
        case "audio":
          return <audio style={{ width: "100%" }} src={file.preview} controls />;
        case "video":
          return <video style={{ width: "100%" }} src={file.preview} controls />;
      }
    };

    switch (active) {
      case "images":
        return (
          fileList?.length > 0 && (
            <div className="upload-list">
              <Row gutter={[24, 24]}>
                {fileList?.map((file, index) => {
                  return (
                    <Col key={file.uid} flex="20%">
                      <div className="nextcms-upload-list-assets-item">
                        <div className="nextcms-upload-list-assets-item-image">
                          <div className="img-wrap">
                            <Image width={"100%"} height={"100%"} src={file.preview} alt="" />
                          </div>
                          <div className="name">{file.name}</div>
                        </div>
                        <div
                          onClick={() => {
                            deleteFile(index);
                          }}
                          className="nextcms-upload-list-assets-item-close"
                        >
                          <CloseCircleOutlined />
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )
        );
      default:
        return (
          fileList?.length > 0 && (
            <div className="upload-list">
              {fileList?.map((file, index) => {
                return (
                  <div
                    onClick={() => {
                      Modal.info({
                        title: "预览",
                        icon: <></>,
                        width: 750,
                        centered: true,

                        content: <div>{previewContent(file)}</div>,
                        closable: true,
                        footer: false
                      });
                    }}
                    className="nextcms-upload-list-assets-item-file-wrap"
                  >
                    <div
                      style={{ marginRight: 12 }}
                      className="nextcms-upload-list-assets-item-file"
                    >
                      {file.name}
                    </div>
                    {["audio", "video"].includes(active) && (
                      <PlayCircleOutlined style={{ marginRight: 12 }} />
                    )}
                    <DeleteOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(index);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )
        );
    }
  };

  const acceptArr = accept?.split(",");
  const acceptNew = acceptArr?.map((item) => `.${item}`)?.join(",");

  return (
    <Modal
      centered
      width={700}
      title={`${title}`}
      open={open}
      cancelText="取消"
      okText="上传"
      onCancel={() => {
        onClose();
      }}
    >
      <Form>
        <Form.Item label="上传到">
          <Select
            style={{
              width: 300
            }}
            options={[
              {
                label: "测试",
                value: "test"
              }
            ]}
          />
        </Form.Item>
      </Form>
      <Dragger
        multiple
        accept={acceptNew}
        showUploadList={false}
        fileList={fileList}
        beforeUpload={async (file: UploadFile) => {
          if (!file.url && !file.preview) {
            file.preview = await getBase64(file as FileType);
          }
          setFileList((prev) => [...prev, file]);
          return false;
        }}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">将文件拖拽至此处，或点击选择文件</p>
        <p className="ant-upload-hint">{`支持上传${accept}格式`}</p>
      </Dragger>

      {assetsPreview()}
    </Modal>
  );
});

export default UploadModal;
