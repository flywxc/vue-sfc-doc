import generator from '@babel/generator'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import t, { ObjectExpression, Identifier, ArrayExpression, TSTypeLiteral, TSTypeAnnotation, TSLiteralType, StringLiteral } from '@babel/types'
import compiler from '@vue/compiler-sfc'
import fs from 'fs'
import minimist from 'minimist'
import { getType, writeJsonFile, parseComments } from './utils'


interface IOptions {
  props: string
  emits: string
}
export default (options: IOptions) => {
  const argvs = minimist(process.argv)

  const component = fs.readFileSync(argvs._[2], 'utf8')

  const config = {
    props: options.props,
    emits: options.emits
  }

  const scriptStr = compiler.parse(component)?.descriptor?.scriptSetup?.content || ''

  const ast = parser.parse(scriptStr,
    {
      sourceType: 'module',
      plugins: [
        'typescript'
      ]
    }
  )

  // writeJsonFile('./ast.json', ast)

  const propsData: Record<string, string>[] = []; const emitsData: Record<string, string>[] = []

  traverse(ast, {
    Identifier(path) {
      if (path.parent.type === 'ImportSpecifier') return
      if (path.parent.type === 'CallExpression') {
        if (path.node.name === 'withDefaults') {
          const propsNodes = (path.parent.arguments[1] as ObjectExpression)?.properties
          if (propsNodes?.length) {
            propsNodes.forEach(node => {
              if (node.type === 'ObjectProperty') {
                const propInfo = {
                  prop: '',
                  type: '',
                  desc: '',
                  default: ''
                }
                if (t.isArrowFunctionExpression(node.value)) {
                  propInfo.default = generator(node.value.body).code
                } else {
                  propInfo.default = generator(node.value).code
                }
                propInfo.type = getType(eval(`(${propInfo.default})`))
                propInfo.prop = (node.key as Identifier).name
                propInfo.desc = parseComments(node)
                propsData.push(propInfo)
              }
            })
          }
        } else if (path.node.name === 'defineEmits') {
          const emitsNode = (path.parent.arguments[0] as ArrayExpression)?.elements
          if (emitsNode?.length) {
            emitsNode.forEach(node => {
              const emitInfo = {
                emit: '',
                desc: ''
              }
              if (t.isStringLiteral(node)) {
                emitInfo.emit = node.value
                emitInfo.desc = parseComments(node)
              }
              emitsData.push(emitInfo)
            })
          } else if (path.parent.typeParameters && (path.parent.typeParameters.params?.[0] as TSTypeLiteral)?.members) {
            (path.parent.typeParameters.params[0] as TSTypeLiteral).members.forEach(member => {
              if (member.type === 'TSCallSignatureDeclaration') {
                emitsData.push({
                  emit: (((member.parameters[0].typeAnnotation as TSTypeAnnotation).typeAnnotation as TSLiteralType).literal as StringLiteral).value,
                  desc: parseComments(member)
                })
              }
            })
          }
        }
      }
    }
  })

  const { props, emits } = config

  if (props) {
    writeJsonFile(props, propsData)
  }
  if (emits) {
    writeJsonFile(emits, emitsData)
  }

  if (!props) console.log(propsData)
  if (!emits) console.log(emitsData)
}
