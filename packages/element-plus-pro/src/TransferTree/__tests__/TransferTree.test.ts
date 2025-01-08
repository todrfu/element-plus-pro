import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import TransferTree from '../TransferTree.vue'
import type { TransferTreeProps } from '../types'

/**
 * Unit tests for TransferTree component
 * Tests cover basic rendering, interactions and all major features
 */
describe('TransferTree', () => {
  let wrapper: VueWrapper
  
  // Mock tree data structure with parent and child nodes
  const mockData = [
    {
      id: '1',
      label: 'Node 1',
      children: [
        {
          id: '1-1',
          label: 'Node 1-1'
        },
        {
          id: '1-2',
          label: 'Node 1-2'
        }
      ]
    },
    {
      id: '2',
      label: 'Node 2',
      children: []
    }
  ]
  
  // Helper function to create component instance with default and custom props
  const createWrapper = (props: Partial<TransferTreeProps> = {}) => {
    return mount(TransferTree, {
      props: {
        dataSource: [],
        defaultCheckedKeys: [],
        nodeKey: 'id',
        defaultProps: {
          label: 'label',
          children: 'children'
        },
        ...props
      },
      attachTo: document.body
    })
  }

  // Reset component instance before each test
  beforeEach(() => {
    wrapper = createWrapper()
  })

  // Basic rendering tests
  describe('Basic Features', () => {
    it('should render properly', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.transfer-box').exists()).toBe(true)
    })

    // Test customization of titles and button texts
    it('should render with custom titles', () => {
      wrapper = createWrapper({
        titles: ['Source', 'Target']
      })
      const titles = wrapper.findAll('.transfer-title-text')
      expect(titles[0].text()).toBe('Source')
      expect(titles[1].text()).toBe('Target')
    })

    it('should render with custom button texts', () => {
      wrapper = createWrapper({
        buttonTexts: ['To Right', 'To Left']
      })
      const buttons = wrapper.findAll('.transfer-center .el-button')
      expect(buttons[0].text()).toBe('To Left')
      expect(buttons[1].text()).toBe('To Right')
    })
  })

  // Test filtering functionality
  describe('Filtering', () => {
    it('should handle filterable mode', async () => {
      wrapper = createWrapper({
        dataSource: mockData,
        filterable: true
      })
      
      expect(wrapper.findAll('.filter-input').length).toBe(2)
      
      const filterInput = wrapper.find('.filter-input input')
      await filterInput.setValue('Node 1')
      
      // Verify filter results
      const visibleNodes = wrapper.findAll('.el-tree-node:not(.is-hidden)')
      expect(visibleNodes.length).toBe(3)
    })
  })

  // Test transfer operations
  describe('Transfer Operations', () => {
    it('should handle transfer to right', async () => {
      wrapper = createWrapper({
        dataSource: mockData
      })

      // Select node
      const checkbox = wrapper.find('.el-tree-node__content .el-checkbox__input')
      await checkbox.trigger('click')

      // Click transfer button
      const transferButton = wrapper.find('.transfer-center .el-button')
      await transferButton.trigger('click')

      // Verify right panel list
      const rightList = wrapper.findAll('.el-transfer-panel__list .el-checkbox')
      expect(rightList.length).toBeGreaterThan(0)
      expect(wrapper.emitted('change')).toBeTruthy()
    })

    it('should handle transfer back to left', async () => {
      wrapper = createWrapper({
        dataSource: mockData,
        defaultCheckedKeys: ['1']
      })

      // Wait for component update
      await wrapper.vm.$nextTick()

      // Click transfer button
      const transferButton = wrapper.find('.transfer-center .el-button')
      await transferButton.trigger('click')

      // Wait for component update
      await wrapper.vm.$nextTick()
    
      // Check if right panel has data
      const rightList = wrapper.findAll('.el-transfer-panel__list .el-checkbox')
      expect(rightList.length).toBe(2)

      // Select item in right panel
      const rightCheckbox = wrapper.find('.transfer-right .transfer-title .el-checkbox__input')
      expect(rightCheckbox.exists()).toBe(true)
      await rightCheckbox.trigger('click')

      // Click transfer back button
      const transferBackButton = wrapper.findAll('.transfer-center .el-button')[1]
      expect(transferBackButton.exists()).toBe(true)
      await transferBackButton.trigger('click')

      // Verify event emission
      expect(wrapper.emitted('change')).toBeTruthy()
      
      // Verify right panel is empty
      const updatedRightList = wrapper.findAll('.el-transfer-panel__list .el-checkbox')
      expect(updatedRightList.length).toBe(0)
    })
  })

  // Test special modes
  describe('Special Modes', () => {
    // Test radio mode (single selection)
    it('should handle radio mode', async () => {
      wrapper = createWrapper({
        dataSource: mockData,
        isRadio: true
      })

      // Click the select all checkbox in left panel, selected nodes should be empty
      const checkbox = wrapper.find('.transfer-title .el-checkbox__input')
      await checkbox.trigger('click')
      const checkedNodes = wrapper.findAll('.transfer-right .transfer-main .el-checkbox')
      expect(checkedNodes.length).toBe(0)

      // Click parent node, selected array should be empty
      const parentNodeCheckbox = wrapper.find('.transfer-left .el-tree-node__content .el-checkbox__input')
      await parentNodeCheckbox.trigger('click')
      expect((wrapper.vm as any).treeCheckKeys).toEqual([])

      // Click child node, selected array should have one item
      const chidldNodeCheckbox = wrapper.find('.transfer-left .el-tree-node__children .el-checkbox__input')
      await chidldNodeCheckbox.trigger('click')
      expect((wrapper.vm as any).treeCheckKeys.length).toEqual(1)

      // Click transfer button
      const transferButton = wrapper.find('.transfer-center .el-button')
      await transferButton.trigger('click')

      // Verify right panel has one item
      const _checkedNodes = wrapper.findAll('.transfer-right .transfer-main .el-checkbox')
      expect(_checkedNodes.length).toBe(1)
    })

    // Test parent node selection mode
    it('should handle father choose mode', async () => {
      wrapper = createWrapper({
        dataSource: mockData,
        fatherChoose: true
      })

      // Click parent node (with two children)
      const parentNodeCheckbox = wrapper.find('.transfer-left .el-tree-node__content .el-checkbox__input')
      await parentNodeCheckbox.trigger('click')
      expect((wrapper.vm as any).treeCheckKeys.length).toEqual(1)

      // Click transfer button
      const transferButton = wrapper.find('.transfer-center .el-button')
      await transferButton.trigger('click')

      // Verify right panel list - should only have one parent node despite having two children
      const _checkedNodes = wrapper.findAll('.transfer-right .transfer-main .el-checkbox')
      expect(_checkedNodes.length).toBe(1)
    })

    // Test default expanded keys functionality
    it('should handle default expanded keys', () => {
      wrapper = createWrapper({
        dataSource: mockData,
        defaultExpandedKeys: ['1']
      })

      const expandedNode = wrapper.find('.el-tree-node.is-expanded')
      expect(expandedNode.exists()).toBe(true)
    })

    // Test accordion mode for tree expansion
    it('should handle accordion mode', async () => {
      wrapper = createWrapper({
        dataSource: mockData,
        accordion: true
      })

      const nodes = wrapper.findAll('.transfer-left .el-tree > .el-tree-node > .el-tree-node__content')
      await nodes[0].trigger('click')
      await nodes[1].trigger('click')

      // Verify only one parent node is expanded
      const expandedNodes = wrapper.findAll('.transfer-left .el-tree > .el-tree-node.is-expanded')
      expect(expandedNodes.length).toBe(1)
    })
  })

  // Test sorting behavior
  describe('List Sorting', () => {
    describe('should handle list sort FIFO mode', () => {
      // Test FIFO (First In First Out) sorting
      it('set listSortFifo to true', async () => {
        wrapper = createWrapper({
          dataSource: mockData,
          listSortFifo: true
        })

        // Select and transfer nodes in sequence
        const firstCheckbox = wrapper.findAll('.el-tree-node__content .el-checkbox__input')

        await firstCheckbox[3].trigger('click')
        await wrapper.find('.transfer-center .el-button').trigger('click')
        await firstCheckbox[1].trigger('click')
        await wrapper.find('.transfer-center .el-button').trigger('click')

        // Verify right panel list order
        const rightList = wrapper.findAll('.el-transfer-panel__list .el-checkbox__label')
        expect(rightList[0].text()).toBe('Node 2')
        expect(rightList[1].text()).toBe('Node 1-1')
      })

      // Test non-FIFO sorting
      it('set listSortFifo to false', async () => {
        wrapper = createWrapper({
          dataSource: mockData,
          listSortFifo: false
        })

        // Select and transfer nodes in sequence
        const firstCheckbox = wrapper.findAll('.el-tree-node__content .el-checkbox__input')

        await firstCheckbox[3].trigger('click')
        await wrapper.find('.transfer-center .el-button').trigger('click')
        await firstCheckbox[1].trigger('click')
        await wrapper.find('.transfer-center .el-button').trigger('click')

        // Verify right panel list order
        const rightList = wrapper.findAll('.el-transfer-panel__list .el-checkbox__label')
        expect(rightList[0].text()).toBe('Node 1-1')
        expect(rightList[1].text()).toBe('Node 2')
      })
    })
  })

  // Test empty state handling
  describe('Edge Cases', () => {
    it('should handle empty state', () => {
      wrapper = createWrapper({
        dataSource: []
      })
    
      expect(wrapper.find('.el-tree__empty-block').exists()).toBe(true)
    })
  })
}) 