/**
 * @description header menu
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import { ISelectMenu, IDomEditor, IOption } from '@wangeditor/core'
import { HEADER_SVG } from '../../_helpers/icon-svg'

class HeaderMenu implements ISelectMenu {
  title = '标题'
  iconSvg = HEADER_SVG
  tag = 'select'
  width = 60

  getOptions(editor: IDomEditor): IOption[] {
    // 基本的 options 列表
    const options = [
      // value 和 elemNode.type 对应
      {
        value: 'header1',
        text: 'H1',
        styleForRenderMenuList: { 'font-size': '32px', 'font-weight': 'bold' },
      },
      {
        value: 'header2',
        text: 'H2',
        styleForRenderMenuList: { 'font-size': '24px', 'font-weight': 'bold' },
      },
      {
        value: 'header3',
        text: 'H3',
        styleForRenderMenuList: { 'font-size': '18px', 'font-weight': 'bold' },
      },
      { value: 'paragraph', text: '正文' },
    ]

    // 获取 value ，设置 selected
    const curValue = this.getValue(editor).toString()
    options.forEach((opt: IOption) => {
      if (opt.value === curValue) {
        opt.selected = true
      } else {
        delete opt.selected
      }
    })

    return options
  }

  isActive(editor: IDomEditor): boolean {
    // select menu 会显示 selected value ，用不到 active
    return false
  }

  /**
   * 获取 node.type
   * @param editor editor
   */
  getValue(editor: IDomEditor): string | boolean {
    const [match] = Editor.nodes(editor, {
      match: n => {
        // @ts-ignore
        const { type = '' } = n
        return type.startsWith('header') // 匹配 node.type 是 header 开头的 node
      },
      universal: true,
    })

    // 未匹配到 header
    if (match == null) return 'paragraph'

    // 匹配到 header
    const [n] = match
    // @ts-ignore
    return n.type
  }
  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const [nodeEntry] = Editor.nodes(editor, {
      // @ts-ignore
      match: n => {
        // @ts-ignore
        const { type = '' } = n

        // 只可用于 p 和 header
        if (type === 'paragraph') return true
        if (type.startsWith('header')) return true

        return false
      },
      universal: true,
      mode: 'highest', // 匹配最高层级
    })

    // 匹配到 p header ，不禁用
    if (nodeEntry) {
      return false
    }
    // 未匹配到 p header ，则禁用
    return true
  }

  /**
   * 执行命令
   * @param editor editor
   * @param value node.type
   */
  exec(editor: IDomEditor, value: string | boolean) {
    if (!value) return

    // 执行命令
    Transforms.setNodes(editor, {
      // @ts-ignore
      type: value,
    })
  }
}

export default HeaderMenu