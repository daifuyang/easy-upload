import { Button, Modal } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import Category from "./ui/category";
import List from "./ui/list";

interface openParams {
  title?: string;
}

interface ChooseModalProps {}

export interface ChooseModalRef {
  open: (data: openParams) => void;
  close: () => void;
}

const ChooseModal = forwardRef<ChooseModalRef, ChooseModalProps>((props, ref) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("上传");

  const onClose = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    open(data) {
      console.log("data", data);
      if (data?.title) {
        setTitle(data.title);
      }
      setOpen(true);
    },
    close() {
      onClose();
    }
  }));

  return (
    <Modal title={title} open={open} width={1036} onCancel={onClose}>
      <div style={{ height: 500 }} className="nextcms-upload-container">
        <div className="nextcms-upload-content">
          <Category />
          <div className="nextcms-upload-list">
            <div className="nextcms-upload-list-header">
              <div className="nextcms-upload-list-header-top">
                <Button>上传</Button>
              </div>
            </div>
            <List />
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default ChooseModal;
