import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Form, Modal, Row, Select, Upload, Image, TreeSelect } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { getBase64 } from "../utils/util";
import { preview } from "./ui/preview";

const { Dragger } = Upload;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface UploadModalProps {
  active: string;
  accept?: string;
  onFinish?: (values: any, fileList: UploadFile[]) => Promise<any>;
  category?: any[];
  uploadProps?: any;
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
  const { active, accept, category, uploadProps = {}, onFinish } = props;
  const {fieldNames} = uploadProps

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("上传");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onCancel = () => {
    setFileList([]);
    setTitle("");
    setOpen(false);
  };

  const onClose = () => {
    if (fileList?.length > 0) {
      Modal.confirm({
        title: "警告",
        content: "您还未保存上传的文件，退出将不会保存，是否确认退出？",
        centered: true,
        onOk: onCancel
      });
    } else {
      onCancel();
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

    switch (active) {
      case "image":
        return (
          fileList?.length > 0 && (
            <div className="upload-list">
              <Row gutter={[24, 24]}>
                {fileList?.map((file, index) => {
                  return (
                    <Col key={file.uid} span={6}>
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
              {fileList?.map((file: any, index) => {
                return (
                  <div className="nextcms-upload-modal-list-assets-item-file-wrap">
                    <div
                      style={{ marginRight: 12 }}
                      className="nextcms-upload-modal-list-assets-item-file"
                    >
                      {file.name}
                    </div>
                    {["audio", "video"].includes(active) && (
                      <PlayCircleOutlined
                        onClick={() => {
                          preview({
                            active,
                            preview: file.preview
                          });
                        }}
                        style={{ marginRight: 12 }}
                      />
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
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        onClose();
      }}
    >
      <Form
        form={form}
        onFinish={(values: any) => {
          let params = {
            type: active
          };
          if (onFinish) {
            onFinish(params, fileList).then((res) => {
              if (res) {
                onCancel();
              }
            });
          }
        }}
      >
        <Form.Item name="categoryId" label="上传到">
          <TreeSelect
            style={{
              width: 300
            }}
            defaultValue={1}
            treeData={category}
            fieldNames={fieldNames}
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
