import commander from 'commander'
import { description, version } from '../package.json'
import main from './main'

commander
  .version(version, '-v, --version')
  .description(description)

commander
  .option('-p, --props <path>', 'props output file')
  .option('-e, --emits <path>', 'emits output file')
  .action((options) => {
    return main(options)
  })

commander.parse(process.argv)
