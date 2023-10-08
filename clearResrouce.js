let shell = require('shelljs')
let fileAction = require('./file')
let fs = require('fs')
let language = require('./lan/local_zh')

clearRes('/Users/xiedejun/code2022/aoplatform-home-next/.vitepress', '/Users/xiedejun/code2022/aoplatform-home-next/src/public/images/')

/**
 * 清除未被使用的图片资源
 * sourceSrc => /Users/xiedejun/code2021/eulixspace-web/src/ 源代码目录
 * needClearSrc => /Users/xiedejun/code2021/eulixspace-web/src/assets/ 需要被清理的目录
 */
function clearRes(sourceSrc, needClearSrc) {
  let targetFileArr = [] // 需要被请求的目录的文件列表

  // step-1 列出所有的资源文件列表
  fileAction.getAllfiles(needClearSrc, targetFileArr)


  // step-2 找出所有的未被使用的资源文件,并删除
  clearUnNeedRes(sourceSrc, targetFileArr)
}

// findUnuselangenKey('/Users/xiedejun/code2023/space-web/src/')

//
function findUnuselangenKey(sourceSrc) {
  let fileArr = [] // 源代码所有的文件列表

  // step-1 初始化所有的源代码文件列表
  fileAction.getAllfiles(sourceSrc, fileArr)
  fileArr = initSourceFileContent(fileArr)
  const alllanKey = connectKey(language.lantxt, '', [])
  const unuseKeyArr = []
  alllanKey.forEach((key) => {
    let findFlag = false
    for (let i = 0; i < fileArr.length; i++) {
      if (fileArr[i].fullPath.includes('src/assets')) {
        continue
      }
      const content = fileArr[i].content
      if (content.includes(`'${key}'`) || content.includes(`"${key}"`) || content.includes(`\`${key}\``)) {
        findFlag = true
        break
      }
    }
    if (!findFlag) {
      unuseKeyArr.push(key)
    }
  })
  fs.writeFile('./a.txt', unuseKeyArr.join('\n'), (error) => {
    if (!error) {
      console.log('写成功')
    }
  })
}

function initSourceFileContent(sourceFileArr) {
  let tmp = []
  sourceFileArr.forEach((item) => {
    if (item.type == 'file') {
      const content = fs.readFileSync(item.fullPath, 'utf-8')
      item.content = content
      tmp.push(item)
    }
  })
  return tmp
}

function connectKey(obj, fullKey, keysArr) {
  if (typeof obj == 'object') {
    Object.keys(obj).forEach((key) => {
      let value = obj[key]
      if (typeof value == 'string') {
        keysArr.push(fullKey ? `${fullKey}.${key}` : key)
      } else {
        connectKey(value, fullKey ? `${fullKey}.${key}` : key, keysArr)
      }
    })
  }
  return keysArr
}

function clearUnNeedRes(sourceSrc, clearFileArr) {
  clearFileArr.forEach((targetItem) => {
    // sourceSrc
    //find /Users/xiedejun/code2022/aoplatform-home-next/.vitepress/ -type f -name "*" | xargs grep "icon-up-disabled.png"
    shell.exec(`find ${sourceSrc} -type f -name "*" | xargs grep "${targetItem.name}"`, { silent: true }, (code, stdout, stderr) => {
      if(code == 1){
        deleteUnneedResource([targetItem])
      }
    })
  })
}

function deleteUnneedResource(filesArr) {
  filesArr.forEach((item) => {
    fs.unlink(item.fullPath, (error) => {
      if (!error) {
        console.log(`删除${item.fullPath} 成功\n`)
      }
    })
  })
}
