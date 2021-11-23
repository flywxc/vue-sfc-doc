<script setup>
const props = withDefaults(defineProps<IProps>(), {
  // 错误信息
  // 多行注释自动拼接
  errorInfo: () => ({
    type: "",
    msg: "",
    data: [],
  }),
  // 类型
  abstractType: 1,
  // 模式
  abstractMode: true,
  // 广告组ID
  aadvid: "",
  // 数据值
  value: () => []
});

const emit = defineEmits([
  // 素材类型
  "imageModes",
  // 数据改变
  "change",
  // 选择
  "select",
  // 展示工具
  "show-tool",
]);

const emits = defineEmits<{
  // 列表
  // 三四十
  (e: "list"): void;
  // 删除
  (e: "del", componentId: string): void;
}>();
</script>