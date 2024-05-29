import { error } from 'node:console'
import { open, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * 读取文件第一行
 * @param {*} dirname 
 * @returns 
 */
export const readTitle = async (dirname) => {

    const file = await open(join(__dirname, dirname));

    let text = '';

    for await (const line of file.readLines({})) {
        text += line
        break;
    }

    return text.replace("#", '').trim()
}




/**
 * 升成侧边栏
 * @param {string} base 
 */
export const genSide = async (baseDir) => {

    const files = await readdir(join(__dirname, baseDir))

    const arr = []

    for (const file of files) {
        arr.push({
            text: await readTitle(join(baseDir, file)),
            link: file.split('.')[0]
        })
    }

    return arr
}
