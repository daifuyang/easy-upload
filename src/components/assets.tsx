import React, { useEffect, useMemo, useRef, useState } from "react";
import zhCN from "antd/locale/zh_CN";
import { Button, ConfigProvider, Tabs } from "antd";
import type { GetProp, UploadProps } from "antd";
import UploadModal, { UploadModalRef } from "./uploadModal";
import Category from "./ui/category";
import List from "./ui/list";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export type RequestData<T> = {
  data: T[] | undefined;
  success?: boolean;
  total?: number;
} & Record<string, any>;

export type UploadModalProps<DataSource, U> = {
  /** @name 一个获得 dataSource 的方法 */
  listRequest?: (
    params: U & {
      pageSize?: number;
      current?: number;
      keyword?: string;
    }
  ) => Promise<Partial<RequestData<DataSource>>>;

  uploadRequest?: (params: any) => Promise<Partial<RequestData<DataSource>>>;
};

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

const Assets = <T extends Record<string, any>, U extends Record<string, any>>(
  props: UploadModalProps<T, U>
) => {
  const { listRequest, uploadRequest } = props;

  const [active, setActive] = useState<string>("images");

  const [list, setList] = useState<T[] | undefined>([]);

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

  const fetchData = useMemo(() => {
    if (!listRequest) return undefined;
    return async (pageParams?: Record<string, any>) => {
      const actionParams = { ...(pageParams || {}) };
      const response = await listRequest(actionParams as unknown as U);
      console.log("response", response);
      if (response.success) {
        setList(response.data);
      }
      return response as RequestData<T>;
    };
  }, [listRequest]);

  /** 聚焦的时候重新请求数据，这样可以保证数据都是最新的。 */
  useEffect(() => {
    // 手动模式和 request 为空都不生效
    if (!listRequest) return;

    // 聚焦时重新请求事件
    const visibilitychange = () => {
      if (document.visibilityState === "visible") {
        fetchData?.();
      }
    };

    visibilitychange();

    document.addEventListener("visibilitychange", visibilitychange);
    return () => document.removeEventListener("visibilitychange", visibilitychange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ConfigProvider locale={zhCN}>
      <UploadModal
        onFinish={async (values = [], fileList = []) => {
          if (!uploadRequest) return undefined;

          const formData = new FormData();
          fileList?.forEach((file) => {
            formData.append("files[]", file as FileType);
          });
     
          const res = await uploadRequest(formData);

          console.log('res',res)

        }}
        accept={defaultAcceptMap[active]}
        active={active}
        ref={modalRef}
      />
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
            <List list={list} active={active} />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Assets;
