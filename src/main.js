import generator from '@babel/generator'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import t from '@babel/types'
import compiler from '@vue/compiler-sfc'
import fs from 'fs'
import minimist from 'minimist'
import { getType, writeJsonFile, parseComments } from './utils'

export default (options) => {
  const argvs = minimist(process.argv)

  const component = fs.readFileSync(argvs._[2], 'utf8')

  const config = {
    props: options.props,
    emits: options.emits
  }

  const scriptStr = compiler.parse(component).descriptor.scriptSetup.content

  const ast = parser.parse(scriptStr,
    {
      sourceType: 'module',
      plugins: [
        'typescript'
      ]
    }
  )

  const propsData = []; const emitsData = []
  traverse(ast, {
    Identifier (path) {
      if (path.node.name === 'withDefaults') {
        try {
          const propsNodes = path.parent.arguments[1]?.properties
          if (propsNodes?.length) {
            propsNodes.forEach(node => {
              const propInfo = {
                prop: '',
                type: '',
                description: '',
                default: ''
              }
              if (t.isArrowFunctionExpression(node.value)) {
                propInfo.default = generator(node.value.body).code
              } else {
                propInfo.default = generator(node.value).code
              }
              // eslint-disable-next-line no-eval
              propInfo.type = getType(eval(`(${propInfo.default})`))
              propInfo.prop = node.key.name
              propInfo.description = parseComments(node)
              propsData.push(propInfo)
            })
          }
        } catch (error) {
          throw new Error('parsing props error', error)
        }
      } else if (path.node.name === 'defineEmits') {
        try {
          const emitsNode = path.parent.arguments[0]?.elements
          if (emitsNode?.length) {
            emitsNode.forEach(node => {
              const emitInfo = {
                prop: '',
                description: ''
              }
              if (t.isStringLiteral(node)) {
                emitInfo.prop = node.value
              }
              emitInfo.description = parseComments(node)
              emitsData.push(emitInfo)
            })
          } else if (path.parent.typeParameters) {
            if (path.parent.typeParameters.params?.[0]?.members) {
              path.parent.typeParameters.params[0].members.forEach(member => {
                emitsData.push({
                  prop: member.parameters[0].typeAnnotation.typeAnnotation.literal.value,
                  description: parseComments(member)
                })
              })
            }
          }
        } catch (error) {
          throw new Error('parsing emit error', error)
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
