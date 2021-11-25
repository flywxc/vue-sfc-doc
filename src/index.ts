import { Command } from 'commander'
import { description, version } from '../package.json'
import main from './main'

const program = new Command()

program
  .version(version, '-v, --version')
  .description(description)

program
  .option('-p, --props <path>', 'props output file')
  .option('-e, --emits <path>', 'emits output file')
  .action((options) => {
    return main(options)
  })

program.parse(process.argv)
