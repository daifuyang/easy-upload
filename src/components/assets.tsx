import React, { useEffect, useMemo, useRef, useState } from "react";
import zhCN from "antd/locale/zh_CN";
import { Button, ConfigProvider, Tabs, message } from "antd";
import type { GetProp, UploadProps, ColProps, PaginationProps } from "antd";
import UploadModal, { UploadModalRef } from "./uploadModal";
import Category from "./ui/category";
import List from "./ui/list";
import { Gutter } from "antd/es/grid/row";

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
  categoryRequest?: (params: any) => Promise<Partial<RequestData<DataSource>>>;
  deleteRequest?: (params: any) => Promise<Partial<RequestData<DataSource>>>;
  uploadProps?: any;
  categoryProps?: any;

  /** 栅格布局宽度，24 栅格，支持指定宽度或百分，需要支持响应式 colSpan={{ xs: 12, sm: 6 }} */
  colSpan?: ColProps;

  /** 栅格间距 */
  gutter?: Gutter | [Gutter, Gutter];
  pagination?: false | PaginationProps;
};

const tabsTitleMap: any = {
  image: "图片",
  audio: "音频",
  video: "视频",
  file: "文件"
};

const defaultAcceptMap: any = {
  image: "jpg,jpeg,png,gif,bmp",
  audio: "m4a,mp3",
  video: "mp4,avi,wmv,mov,flv,rmvb,3gp,m4v,mkv,webm",
  file: "pptx,ppt,docx,doc,xls,xlsx,pdf,csv,xlsm,txt"
};

const Assets = <T extends Record<string, any>, U extends Record<string, any>>(
  props: UploadModalProps<T, U>
) => {
  const {
    listRequest,
    uploadRequest,
    categoryRequest,
    deleteRequest,
    uploadProps = {},
    categoryProps = {},
    gutter,
    colSpan,
    pagination: paginationConfig = false
  } = props;
  const [active, setActive] = useState<string>("image");
  const [list, setList] = useState<T[]>([]);
  const [category, setCategory] = useState<T[]>([]);
  // const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);

  const [pagination, setPagination] = useState<PaginationProps>();

  const modalRef = useRef<UploadModalRef>(null);
  const items = [
    {
      key: "image",
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
      const _pagination = {
        current: pageParams?.current || 1,
        pageSize: pageParams?.pageSize || 10
      };

      const actionParams = {
        ...pageParams,
        ..._pagination,
        type: active
      };
      setListLoading(true);
      const response = await listRequest(actionParams as unknown as U);
      if (response.success) {
        setList(response.data || []);
        if (response.total) {
          setPagination({ ..._pagination, total: response.total });
        }
      }
      setListLoading(false);
      return response as RequestData<T>;
    };
  }, [listRequest, pagination, active]);

  const fetchCategory = useMemo(() => {
    if (!categoryRequest) return undefined;
    return async (pageParams?: Record<string, any>) => {
      const actionParams = {
        ...(pageParams || {
          pageSize: 0
        })
      };
      setCategoryLoading(true);
      const response = await categoryRequest(actionParams as unknown as U);
      if (response.success) {
        setCategory(response.data || []);
      }
      setCategoryLoading(false);
      return response as RequestData<T>;
    };
  }, [categoryRequest]);

  const deleteAsset = useMemo(() => {
    if (!deleteRequest) return undefined;
    return async (id: number) => {
      const response = await deleteRequest(id);
      if (response.success) {
        message.success("删除成功");
        fetchData?.(pagination);
      }
      return response as RequestData<T>;
    };
  }, [deleteRequest, pagination]);

  // 用户传入的，手动覆盖
  useEffect(() => {
    const _pagination: PaginationProps = {
      current: 1,
      pageSize: 10,
      total: 0
    };
    if (paginationConfig) {
      if (paginationConfig.current) {
        _pagination.current = paginationConfig.current;
      }
      if (paginationConfig.pageSize) {
        _pagination.pageSize = paginationConfig.pageSize;
      }
      if (paginationConfig.total) {
        _pagination.total = paginationConfig.total;
      }
    }
    fetchData?.(_pagination);
    setPagination(_pagination);
  }, [paginationConfig, active]);

  useEffect(() => {
    fetchCategory?.();
  }, []);

  /** 聚焦的时候重新请求数据，这样可以保证数据都是最新的。 */
  useEffect(() => {
    // 手动模式和 request 为空都不生效
    if (!listRequest) return;

    // 聚焦时重新请求事件
    const visibilitychange = () => {
      if (document.visibilityState === "visible") {
        fetchData?.(pagination);
        fetchCategory?.();
      }
    };

    document.addEventListener("visibilitychange", visibilitychange);
    return () => document.removeEventListener("visibilitychange", visibilitychange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  return (
    <ConfigProvider locale={zhCN}>
      <UploadModal
        uploadProps={uploadProps}
        category={category}
        onFinish={async (values = {}, fileList = []) => {
          if (!uploadRequest) return undefined;
          const formData = new FormData();
          fileList?.forEach((file) => {
            formData.append("files[]", file as FileType);
          });
          for (const key in values) {
            const element = values[key];
            formData.append(key, element);
          }
          const res = await uploadRequest(formData);
          if (!res.success) {
            message.error(res.msg);
            return false;
          }
          fetchData?.(pagination);
          return true;
        }}
        accept={defaultAcceptMap[active]}
        active={active}
        ref={modalRef}
      />
      <div className="nextcms-upload-container">
        <Tabs onChange={(key: string) => setActive(key)} defaultActiveKey="image" items={items} />
        <div className="nextcms-upload-content">
          <Category {...categoryProps} loading={categoryLoading} data={category} />

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

            <List
              list={list}
              active={active}
              gutter={gutter}
              colSpan={colSpan}
              onDelete={async (id: number) => {
                const res: any = await deleteAsset?.(id);
                if (!res.success) {
                  message.error(res.msg);
                }
                fetchData?.(pagination);
              }}
              onChange={(page, pageSize) => {
                fetchData?.({ current: page, pageSize });
                setPagination((prev) => ({ ...prev, current: page, pageSize }));
              }}
              pagination={pagination}
              loading={listLoading}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Assets;
