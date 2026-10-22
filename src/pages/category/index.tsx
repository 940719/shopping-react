import { useEffect, useState, useMemo, useCallback } from "react";
import { Button, Space, Table } from "antd";
import type { TableProps } from "antd";
import type { CategoryItem, CategoryParams } from "@/api/categorys";
import { getCategories } from "@/api/categorys";
import styles from "@/styles/tableLayout.module.less";
import CategoryItemDialog from "./components/CategroyItemDialog";
import type { PaginationProps } from "antd";
import { Pagination } from "antd";
const defaultPage: CategoryParams = {
  pageNum: 1,
  pageSize: 10,
};
const defaultTotal: number = 0;
export default function Category() {
  //  表格数据
  const [tableData, setTableData] = useState<CategoryItem[]>([]);
  // 当前选中表格行数据
  const [currentCategory, setCurrentCategory] = useState<CategoryItem | null>(
    null,
  );
  // 弹窗状态
  const [openDialog, setOpenDialog] = useState(false);

  // useCallback 稳定函数引用
  const editCategory = useCallback((record: CategoryItem) => {
    console.log("Edit category clicked for record:", record);
    setCurrentCategory(record);
    setOpenDialog(true);
  }, []);

  const newCategory = useCallback(() => {
    console.log("New category button clicked");
    setCurrentCategory(null);
    setOpenDialog(true);
  }, []);

  const onClosedDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  // useMemo缓存列配置，依赖只有 editCategory
  const columns = useMemo<TableProps<CategoryItem>["columns"]>(
    () => [
      {
        title: "类型名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "排序",
        dataIndex: "sort",
        key: "sort",
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTime",
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Space size="medium">
            <a onClick={() => editCategory(record)}> 修改 </a>
            <a> 删除</a>
          </Space>
        ),
      },
    ],
    [editCategory],
  );

  useEffect(() => {
    fetchData(pageConfig);
  }, []);

  const [pageConfig, setPageConfig] = useState<CategoryParams>(defaultPage);
  const [tableTotal, setTableTotal] = useState(defaultTotal);
  const fetchData = async (newPageConfig: CategoryParams = defaultPage) => {
    try {
      console.log(newPageConfig);
      const data = await getCategories(newPageConfig);
      setTableData(data.list || []);
      setTableTotal(data.total);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const onChange: PaginationProps["onChange"] = (pageNum, pageSize) => {
    const newPageConfig: CategoryParams = {
      pageNum,
      pageSize,
    };
    setPageConfig(newPageConfig);
    fetchData(newPageConfig);
  };
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelSearch}></div>
        <Button
          onClick={newCategory}
          type="primary"
          htmlType="submit"
          className={styles.loginBtn}
        >
          新建
        </Button>
      </div>
      <div className={styles.tableWrapper}>
        <Table<CategoryItem>
          rowKey="id"
          pagination={false}
          columns={columns}
          scroll={{ y: "100%" }} // 100%继承父容器高度
          dataSource={tableData}
        />
      </div>
      <Pagination
        className={styles.tablePage}
        showSizeChanger
        defaultCurrent={pageConfig.pageNum}
        total={tableTotal}
        showTotal={(total) => total}
        onChange={onChange}
      />
      {openDialog && (
        <CategoryItemDialog
          tableItem={currentCategory}
          onClosedDialog={onClosedDialog}
          fetchData={fetchData}
          open={openDialog}
        />
      )}
    </div>
  );
}
