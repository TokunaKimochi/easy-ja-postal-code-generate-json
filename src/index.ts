#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import { parse } from 'csv/sync'
import iconv from 'iconv-lite'
import AdmZip from 'adm-zip'
import { Command } from 'commander'

// types
import { ZipIndex, ZipData } from './type'

const program = new Command()
const __dirname = process.cwd()

const checkNoData = (row: string): string => {
  return row === '以下に掲載がない場合' ? '' : row
}

const generateFile = (path: string, key: string, data: string): void => {
  fs.writeFile(path, data)
    .then(() => console.log(`${key}: json generated!`))
    .catch((err) => console.error(err))
}

const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return year + '年' + month + '月' + day + '日' + hours + '時' + minutes + '分' + seconds + '秒'
}

;(async () => {
  program
    .name('generate-json')
    .option('-u, --zipUrl <char>', 'URL of zip data', 'https://www.post.japanpost.jp/zipcode/dl/oogaki/zip/ken_all.zip')
    .option('-d,--destDir <char>', 'json destination directory', 'json/zip')
    .option('-t,--time', 'generatedTime json')
    .parse()

  const options = program.opts()
  const zipUrl = options.zipUrl
  const destDir = path.resolve(__dirname, options.destDir)
  const time: boolean = options.time
  const jsonDetailFilePath = (index: string) => `${destDir}/${index}.json`
  const zipIndex: ZipIndex = []
  const zipAllData: {
    [key: string]: ZipData[]
  } = {}

  // ディレクトリが無い場合は作成
  const mkdirResult = await fs
    .mkdir(destDir, { recursive: true })
    .then((result) => {
      if (result) console.log('dest dir : ' + result)
      return true
    })
    .catch((err) => console.error(err))

  if (!mkdirResult) return

  // zipファイルをwebからダウンロードしてきてBufferオブジェクトを取得
  const resultBuffer = await fetch(zipUrl)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => Buffer.from(arrayBuffer))
    .catch((err) => console.error(err))

  if (!resultBuffer) return

  // zipファイルからbufferデータを取得
  const zip = new AdmZip(resultBuffer)
  const zipData = zip.getEntries()[0].getData()

  // Bufferからcsv & shift-jisをutf-8に変換
  const utf8Csv = iconv.decode(zipData, 'Shift_JIS')

  if (!utf8Csv) return

  // csvからjsonを作成
  const parseJson: string[][] = parse(utf8Csv)

  // 必要なデータで作り直す
  parseJson.forEach((row) => {
    const zipHead = row[2].slice(0, 3)
    const data: ZipData = {
      zip: row[2],
      prefectures: checkNoData(row[6]),
      city: checkNoData(row[7]),
      other: checkNoData(row[8]),
    }
    // zipコード上３桁ごとのグループを作成
    if (!zipAllData[zipHead]) {
      zipAllData[zipHead] = []
    }
    zipIndex.push(zipHead)
    zipAllData[zipHead].push(data)
  })

  // 各地方のjsonファイルを出力
  for (const zipKey in zipAllData) {
    generateFile(jsonDetailFilePath(zipKey), zipKey, JSON.stringify(zipAllData[zipKey]))
  }
  // index用のjsonファイルも出力
  generateFile(jsonDetailFilePath('index'), 'index', JSON.stringify(Array.from(new Set(zipIndex.sort()))))
  if (time) {
    // 出力した日時のjsonファイルを出力
    generateFile(jsonDetailFilePath('_time'), 'time', JSON.stringify({ generatedTime: formatTime(new Date()) }))
  }
})()
