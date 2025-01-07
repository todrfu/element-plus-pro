<template>
  <div class="transfer-box" :style="{ width, height }">
    <!-- 左侧树框 -->
    <div class="transfer-left">
      <div class="transfer-title">
        <el-checkbox
          :indeterminate="treeIndeterminate"
          v-model="treeCheckAll"
          @change="treeAllBoxChange"
          :disabled="isRadio"
        />
        <span class="transfer-title-text">{{ treeTitle }}</span>
        <span class="transfer-title-total"
          >{{ treeLength }}/{{ treeCheckKeys.length }}</span
        >
      </div>
      <div class="transfer-main">
        <el-input
          v-if="filterable"
          clearable
          size="small"
          class="filter-input"
          :placeholder="filterPlaceholder"
          v-model="filterTree"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <!-- 左侧树 -->
        <el-tree
          show-checkbox
          ref="fromTreeRef"
          :node-key="nodeKey"
          :props="defaultProps"
          :data="treeFromData"
          :accordion="accordion"
          :default-expand-all="openAll"
          :filter-node-method="filterNodeFrom"
          :render-after-expand="renderAfterExpand"
          :expand-on-click-node="expandOnClickNode"
          :default-checked-keys="defaultCheckedKeys"
          :default-expanded-keys="treeExpandedKeys"
          @check="fromTreeChecked"
          :check-strictly="fatherChoose"
        />
        <div class="slot-footer" v-if="$slots['left-footer']">
          <slot name="left-footer"></slot>
        </div>
      </div>
    </div>
    <!-- 穿梭区 按钮框 -->
    <div class="transfer-center">
      <el-button
        size="small"
        type="primary"
        style="margin-bottom: 20px"
        @click="treeToList()"
        :disabled="transferDisabled"
      >
        <span v-if="rightButtonText">{{ rightButtonText }}</span>
        <el-icon v-else><ArrowRight /></el-icon>
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="listToTree()"
        :disabled="listCheckKey.length == 0"
      >
        <span v-if="leftButtonText">{{ leftButtonText }}</span>
        <el-icon v-else><ArrowLeft /></el-icon>
      </el-button>

    </div>
    <!-- 右侧列表区 -->
    <div class="transfer-right">
      <div class="transfer-title">
        <el-checkbox
          :indeterminate="listIndeterminate"
          v-model="listCheckAll"
          @change="listAllBoxChange"
        />
        <span class="transfer-title-text">{{ listTitle }}</span>
        <span class="transfer-title-total">
          {{ rightList.length }}/{{ listCheckKey.length }}
        </span>
      </div>
      <div class="transfer-main">
        <el-input
          v-if="filterable"
          clearable
          :placeholder="filterPlaceholder"
          v-model="filterList"
          size="small"
          class="filter-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <!-- 右侧列表 -->
        <el-checkbox-group
          v-model="listCheckKey"
          class="el-transfer-panel__list flex flex-col"
        >
          <el-checkbox
            v-for="item of rightList"
            :label="item[nodeKey]"
            :key="item[nodeKey]"
          >
            {{ item[defaultProps.label] }}
          </el-checkbox>
        </el-checkbox-group>
        <div class="slot-footer" v-if="$slots['right-footer']">
          <slot name="right-footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 基于 element-tree-transfer-pro
 * 使用文档参考：https://github.com/Herozzq/element-tree-transfer-pro
 */
import { ElTree } from "element-plus";
import { ArrowRight, ArrowLeft, Search } from '@element-plus/icons-vue'
import { ref, watch, computed, nextTick } from "vue";
import type { CheckboxValueType } from "element-plus";
import type { TransferTreeProps, TreeNode } from './types'

defineOptions({
  name: 'TransferTree',
})

const props = withDefaults(defineProps<TransferTreeProps>(), {
  width: '800px',
  height: '500px',
  titles: () => ['源数据', '目标列表'],
  dataSource: () => [],
  defaultProps: () => ({ label: 'label', children: 'children' }),
  nodeKey: 'id',
  filterable: false,
  openAll: true,
  defaultCheckedKeys: () => [],
  defaultExpandedKeys: () => [],
  filterPlaceholder: '请输入搜索内容',
  accordion: false,
  renderAfterExpand: true,
  expandOnClickNode: true,
  fatherChoose: false,
  isRadio: false,
  buttonTexts: () => [],
  listSortFifo: true
})

const emit = defineEmits(["right-check-change", "left-check-change", "change"]);

const treeKeys = ref<string[]>([]); //树所有节点的key
const treeLength = ref(0); // 树所有节点数量
const treeIndeterminate = ref(false); // 源数据是否半选
const treeCheckAll = ref(false); // 源数据是否全选
const treeExpandedKeys = ref<string[]>([]); // 源数据展开节点
const treeCheckKeys = ref<string[]>([]); // 源数据选中key数组 以此属性关联穿梭按钮，总全选、半选状态
const filterTree = ref(""); // 源数据筛选
const filterList = ref(""); // 右侧数据筛选
const archiveFirst = ref<TreeNode[]>([]); // 存档右侧筛选前数据
const rightList = ref<TreeNode[]>([]); //右侧数据列表
const listCheckKey = ref<string[]>([]); //右选中数据
const listCheckAll = ref(false); // 右侧列表是否全选
const fromTreeRef = ref<InstanceType<typeof ElTree>>();
// const treeFromData = computed(() => cloneDeep(props.dataSource))
const treeFromData = ref<TreeNode[]>([]);

const treeTitle = computed(() => props.titles[0]);
const listTitle = computed(() => props.titles[1]);
const leftButtonText = computed(() => props.buttonTexts[0]);
const rightButtonText = computed(() => props.buttonTexts[1]);
const listIndeterminate = computed(
  () =>
    listCheckKey.value.length > 0 &&
    listCheckKey.value.length < rightList.value.length
);
const transferDisabled = computed(() => {
  const rightKeys = rightList.value.map((item) => item[props.nodeKey]);
  let result =
    treeCheckKeys.value.length > 0 &&
    treeCheckKeys.value.every((item) => rightKeys.includes(item));
  if (rightKeys.length === 0 && treeCheckKeys.value.length === 0) {
    result = true;
  }
  return result;
});

const setChecked = (leftKeys: string[] = []) => {
  fromTreeRef.value?.setCheckedKeys(leftKeys);
};

const findItem = (arr: TreeNode[]): void => {
  for (const item of arr) {
    if (props.defaultCheckedKeys.includes(item[props.nodeKey])) {
      rightList.value.push(item);
    }
    if (item[props.defaultProps.children]) {
      findItem(item[props.defaultProps.children]);
    }
  }
};

const findChildKey = (arr: TreeNode[], result: string[] = []): string[] => {
  for (const item of arr) {
    if (
      item[props.defaultProps.children] &&
      item[props.defaultProps.children].length == 0
    ) {
      result.push(item[props.nodeKey]);
    }
    if (item[props.defaultProps.children]) {
      findChildKey(item[props.defaultProps.children], result);
    }
  }
  return result;
};

const chooseDisable = (value: string[], arr: TreeNode[]): void => {
  for (const item of arr) {
    let choose = value.includes(item[props.nodeKey]);
    if (choose) {
      item.disabled = true;
    } else {
      if (
        !item.disabled ||
        fromTreeRef.value?.getCheckedNodes().includes(item)
      ) {
        item.disabled = false;
      }
      if (props.isRadio) {
        item.disabled = false;
      }
    }
    if (
      props.isRadio &&
      !props.fatherChoose &&
      item[props.defaultProps.children] &&
      item[props.defaultProps.children].length > 0
    ) {
      item.disabled = true;
    }
    if (item[props.defaultProps.children]) {
      chooseDisable(value, item[props.defaultProps.children]);
    }
  }
};

const setDisable = (arr: TreeNode[]): void => {
  for (const item of arr) {
    item.disabled = true;
    if (item[props.defaultProps.children]) {
      setDisable(item[props.defaultProps.children]);
    }
  }
};

const setTreeMsg = (arr: TreeNode[]): void => {
  for (const item of arr) {
    treeLength.value++;
    treeKeys.value.push(item[props.nodeKey]);
    if (item[props.defaultProps.children]) {
      setTreeMsg(item[props.defaultProps.children]);
      if (
        props.isRadio &&
        !props.fatherChoose &&
        item[props.defaultProps.children] &&
        item[props.defaultProps.children].length > 0
      ) {
        item.disabled = true;
      }
    }
  }
};

const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T;
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
  ) as T;
};

watch(
  () => props.dataSource,
  (val) => {
    if (val && val.length > 0) {
      setTreeMsg(deepClone(val) as TreeNode[]);
      treeFromData.value = deepClone(val) as TreeNode[];
    }
  },
  {
    immediate: true,
  }
);

watch(treeCheckKeys, (val) => {
  if (val.length > 0) {
    treeIndeterminate.value = true;
    if (val.length == treeLength.value) {
      treeIndeterminate.value = false;
      treeCheckAll.value = true;
    } else {
      treeIndeterminate.value = true;
      treeCheckAll.value = false;
    }
  } else {
    treeIndeterminate.value = false;
    treeCheckAll.value = false;
  }
});

watch(listCheckKey, (val, oldVal) => {
  const movedKeys = [...val, ...oldVal].filter(
    (v) => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1
  );
  updateListAllChecked();
  emit("right-check-change", val, movedKeys);
});

watch(filterTree, (val) => {
  fromTreeRef.value?.filter(val);
});

watch(filterList, (newval, oldval) => {
  if (oldval == "") {
    archiveFirst.value = rightList.value;
  }
  if (newval == "") {
    rightList.value = archiveFirst.value;
    rightList.value = rightList.value.filter(
      (item) => treeCheckKeys.value.includes(item[props.nodeKey]) && item
    );
  }
  let reg = RegExp(newval);
  rightList.value = rightList.value.filter((item) =>
    reg.test(item[props.defaultProps.label])
  );
});

watch(
  () => props.defaultCheckedKeys,
  (val: string[]) => {
    treeCheckKeys.value = val;
    findItem(treeFromData.value);
    if (props.isRadio && rightList.value.length > 0) {
      setDisable(treeFromData.value);
    } else {
      chooseDisable(treeCheckKeys.value, treeFromData.value);
    }
    treeFromData.value = [...treeFromData.value];
  }
);

watch(
  () => props.defaultExpandedKeys,
  (val) => {
    let _form = new Set(treeExpandedKeys.value.concat(val as any));
    treeExpandedKeys.value = [..._form];
  },
  { immediate: true }
);

const fromTreeChecked = (nodeObj: { id: string }) => {
  treeCheckKeys.value = fromTreeRef.value?.getCheckedKeys(
    !props.fatherChoose
  ) as string[];
  if (props.isRadio) {
    setChecked([nodeObj.id]);
    treeCheckKeys.value = [nodeObj.id];
  }
  let currentKeys: string[] = [];
  if (props.fatherChoose) {
    currentKeys = [nodeObj[props.nodeKey as keyof typeof nodeObj]];
  } else {
    currentKeys = findChildKey([nodeObj]);
  }
  nextTick(() => {
    emit("left-check-change", treeCheckKeys.value, currentKeys);
  });
};

const treeAllBoxChange = (val: CheckboxValueType) => {
  if (treeFromData.value.length == 0) {
    return;
  }
  let listKey = rightList.value.map((item) => item[props.nodeKey]);
  if (val) {
    setChecked(treeKeys.value);
    treeCheckKeys.value = treeKeys.value;
  } else {
    setChecked(listKey);
    treeCheckKeys.value = listKey;
  }
  emit("left-check-change", treeCheckKeys.value);
};

const filterNodeFrom = (value: string, data: Record<string, any>) => {
  if (!value) return true;
  return data[props.defaultProps.label].indexOf(value) !== -1;
};

const treeToList = () => {
  let arrayCheckedNodes =
    fromTreeRef.value?.getCheckedNodes(!props.fatherChoose) || [];
  let rightKeys = JSON.parse(
    JSON.stringify(rightList.value.map((item) => item[props.nodeKey]))
  );
  const movedKeys = [...new Set(treeCheckKeys.value)].filter(
    (item) => !new Set(rightKeys).has(item)
  );
  let arrayDeWeighting: any[] = [];
  arrayDeWeighting = arrayCheckedNodes.filter((item) => {
    if (
      !rightList.value.some((ite) => ite[props.nodeKey] == item[props.nodeKey])
    ) {
      return item;
    }
  });

  if (props.listSortFifo) {
    rightList.value = [...rightList.value, ...arrayDeWeighting];
  } else {
    rightList.value = [...arrayCheckedNodes];
  }
  if (props.isRadio) {
    setDisable(treeFromData.value);
  } else {
    let chooseId = rightList.value.map((item) => item[props.nodeKey]);
    chooseDisable(chooseId, treeFromData.value);
    treeCheckKeys.value = treeCheckKeys.value.filter((item) =>
      chooseId.includes(item)
    );
  }
  emit("change", treeCheckKeys.value, "right", movedKeys);
};

const listAllBoxChange = (val: CheckboxValueType) => {
  if (val) {
    listCheckKey.value = rightList.value.map((item) => item[props.nodeKey]);
  } else {
    listCheckKey.value = [];
  }
};

const updateListAllChecked = () => {
  const keys = rightList.value.map((item) => item[props.nodeKey]);
  listCheckAll.value =
    keys.length > 0 && keys.every((item) => listCheckKey.value.includes(item));
};

const listToTree = () => {
  const movedKeys = [...new Set(treeCheckKeys.value)].filter((item) =>
    new Set(listCheckKey.value).has(item)
  );
  treeCheckKeys.value = [...new Set(treeCheckKeys.value)].filter(
    (item) => !new Set(listCheckKey.value).has(item)
  );
  rightList.value = listCheckAll.value
    ? []
    : rightList.value.filter(
        (item) => !listCheckKey.value.includes(item[props.nodeKey]) && item
      );
  chooseDisable(treeCheckKeys.value, treeFromData.value);
  if (rightList.value.length == 0) {
    treeIndeterminate.value = false;
    treeCheckAll.value = false;
  }
  listCheckKey.value = [];
  setChecked(treeCheckKeys.value);
  emit("change", treeCheckKeys.value, "left", movedKeys);
};
</script>

<style lang="scss" scoped>
$elNamespace: "el";

.transfer-box {
  width: 100% !important;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 2px;
  ::v-deep(
      .#{$elNamespace}-transfer-panel__item .#{$elNamespace}-checkbox__label
    ) {
    overflow: inherit;
  }
}

.#{$elNamespace}-tree {
  min-width: 100%;
  display: inline-block !important;
}

.transfer-main {
  padding: 10px;
  height: calc(100% - 41px);
  box-sizing: border-box;
  overflow: auto;
}

.transfer-left,
.transfer-right {
  border: 1px solid #ebeef5;
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  vertical-align: middle;
}

.transfer-center {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  ::v-deep(.#{$elNamespace}-button) {
    margin: 0;
  }
}

.transfer-title {
  grid-template-columns: 25px auto 50px;
  border-bottom: 1px solid #ebeef5;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
  color: #333;
  font-size: 16px;
  background-color: #f5f7fa;
  margin-top: 0;
  display: flex;
  align-items: center;
  &-text {
    margin-left: 10px;
  }
  &-total {
    text-align: right;
    color: #909399;
    font-size: 12px;
    margin-left: 8px;
  }
}

.#{$elNamespace}-transfer-panel__item {
  padding-left: 6px;
}

.filter-input .#{$elNamespace}-input__inner {
  margin-bottom: 10px;
  height: 32px;
  width: 100%;
  font-size: 12px;
  display: inline-block;
  box-sizing: border-box;
  border-radius: 16px;
}

.#{$elNamespace}-input__icon {
  height: 32px;
}

.#{$elNamespace}-icon--left {
  margin-right: 0;
}

.#{$elNamespace}-icon--right {
  margin-left: 0;
}

.slot-footer {
  height: 40px;
  background: #fff;
  margin: 0;
  padding: 0;
  border-top: 1px solid #ebeef5;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}
</style>
