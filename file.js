const fs = require('fs')

function getfiles(path){    //读取目录下所有目录文件  返回数组
    return fs.readdirSync(path,{encoding:'utf8', withFileTypes:true})
}

function isFile(filepath){  //判断是否是文件 Boolean
    let stat = fs.statSync(filepath)
    return stat.isFile()
}

function isDir(filepath){  //判断是否是文件夹 Boolean
    let stat = fs.statSync(filepath)
    return stat.isDirectory()
}


//递归遍历所有文件夹和文件
// param1:路径  param2:将结果存储到该数组中
let time = 0
function getAllfiles(path, arr){ 	// 结果将存储到arr数组中
    // console.log('该函数已递归', ++time, '次')
    let filesArr = getfiles(path);     // 获取目录下所有文件
    filesArr.forEach(item=>{
        item = item.name
    	// 需要过滤掉的文件  item是文件名或文件夹名
        if (
            item == '$RECYCLE.BIN' || 
            item.includes('asar') || 
            item == 'System Volume Information' ||  
            item == 'is' || 
            item == 'http-timer' || 
            item == 'abbrev' || 
            item == 'node_modules' || 
            item == 'study' || 
            item == '.DS_Store'
            ) {
            return
        }
        if(isDir(path + item)){ //如果是文件夹
            getAllfiles(path + item + '/', arr)
            let dir = {name:item, type:'dir',fullPath:path + item}
            arr.push(dir)
        }else if(isFile(path + item)){  // 如果是文件
            arr.push({name:item, type:'file',fullPath:path + item})
        }else{
            return
        }
    })
}



exports.getAllfiles = getAllfiles