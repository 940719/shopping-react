import {
  addCategory,
  updateCategoryById,
  type CategoryItem,
} from "@/api/categorys";
import { Modal } from "antd";
import { memo } from "react";
import { Form, Input } from "antd";
import type { FormProps } from "antd";

interface Props {
  open: boolean;
  onClosedDialog: () => void;
  fetchData: () => void;
  tableItem: CategoryItem | null;
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export default memo(function CategoryItemDialog({
  open,
  onClosedDialog,
  fetchData,
  tableItem,
}: Props) {
  const [form] = Form.useForm();
  const onSave = () => {
    form.submit();
  };
  const onFinish: FormProps<CategoryItem>["onFinish"] = async (values) => {
    try {
      if (tableItem) {
        await onEditCategory(values);
      } else {
        await onAddCategory(values);
      }
      form.resetFields();
      onClosedDialog();
      fetchData();
    } catch (error) {}
  };
  const onAddCategory = async (values: CategoryItem) => {
    await addCategory(values);
  };
  const onEditCategory = async (values: CategoryItem) => {
    const params: CategoryItem = {
      ...tableItem,
      ...values,
    };
    await updateCategoryById(tableItem?.id as string, params);
  };
  if (tableItem) {
    // 编辑模式：回显数据
    form.setFieldsValue({
      name: tableItem.name,
      sort: tableItem.sort,
    });
  } else {
    // 新建模式：清空表单
    form.resetFields();
  }
  return (
    <div>
      <Modal
        title="Basic Modal"
        closable={{ "aria-label": "Custom Close Button" }}
        open={open}
        onOk={onSave}
        onCancel={onClosedDialog}
      >
        <Form
          {...layout}
          form={form}
          onFinish={onFinish}
          name="control-hooks"
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="name" label="商品名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sort" label="排序值" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});
