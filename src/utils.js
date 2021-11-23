import fs from 'fs'

export const getType = (arg) => {
  return Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()
}

/**
   * 拼接多行注释
   * @param {array} comments 注释
   */
export const joinComment = (comments) => {
  return comments.map(comment => {
    return comment.value.trim()
  }).join(';')
}

/**
 * 解析注释
 * @param node {object} 注释节点
 */
export const parseComments = (node) => {
  if (node.leadingComments) {
    return joinComment(node.leadingComments)
  } else if (node.trailingComments) {
    return joinComment(node.trailingComments)
  }
  return ''
}

export const writeJsonFile = (file, data, option) => {
  fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
    if (err) console.error(err)
  })
}
