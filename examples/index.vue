<script setup>
import { defineProps, withDefaults } from "vue";
const props = withDefaults(defineProps < IProps > (), {
  // 错误信息
  // 多行注释自动拼接
  errorInfo: () => ({
    type: "",
    msg: "",
    data: [],
  }),
  // 注释1
  abstractType: 1,
  // 注释2
  abstractMode: true,
  // 注释3
  aadvid: "",
  // 注释4
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

const emits = defineEmits < {
  // 列表
  // 多行注释
  (e: "list"): void;
  // 删除
  (e: "del", componentId: string): void;
}> ();
</script>