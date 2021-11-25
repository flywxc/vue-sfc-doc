import fs, { PathOrFileDescriptor } from 'fs'
import { Comment, Statement } from '@babel/types'

export const getType = (arg: unknown) => {
  return Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()
}

/**
   * 拼接多行注释
   * @param {array} comments 注释
   */
export const joinComment = (comments: readonly Comment[]) => {
  return comments.map(comment => {
    return comment.value.trim()
  }).join(';')
}

/**
 * 解析注释
 * @param node {object} 注释节点
 */
export const parseComments = (node: Statement) => {
  if (node.leadingComments) {
    return joinComment(node.leadingComments)
  } else if (node.trailingComments) {
    return joinComment(node.trailingComments)
  }
  return ''
}

export const writeJsonFile = (file: PathOrFileDescriptor, data: unknown) => {
  fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
    if (err) console.error(err)
  })
}
