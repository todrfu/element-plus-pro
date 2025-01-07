export interface TreeNode {
  [key: string]: any
  disabled?: boolean
  children?: TreeNode[]
}

export interface TransferTreeProps {
  width?: string
  height?: string
  titles?: string[]
  dataSource: TreeNode[]
  defaultProps?: {
    label: string
    children: string
  }
  nodeKey?: string
  filterable?: boolean
  openAll?: boolean
  defaultCheckedKeys?: string[]
  defaultExpandedKeys?: string[]
  filterPlaceholder?: string
  accordion?: boolean
  renderAfterExpand?: boolean
  expandOnClickNode?: boolean
  fatherChoose?: boolean
  isRadio?: boolean
  buttonTexts?: string[]
  listSortFifo?: boolean
} 