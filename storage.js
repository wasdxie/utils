/**
 * 打印出所有的localStorage及sessionStorage 用来把数据从一个浏览器转移到另一个浏览器或者把数据从一个域名转移到另一个域名
 * 用法打开要拷贝页面的控制台执行下面的函数，把结果拷贝到另外一个页面的控制台执行下，就能把数据从storage一个域名迁移到另外一个域名了
*/
function getAllStorage(storageValue = "localStorage") {
	const excludeKey = [
		"length",
		"key",
		"getItem",
		"setItem",
		"removeItem",
		"clear",
	]
	const result = {}
	for (let key in localStorage) {
		if (!excludeKey.includes(key)) {
			result[key] = localStorage.getItem(key)
		}
	}
	let str = "let result={"
	for (let key in result) {
		str = str + `'${key}':'${result[key]}',`
	}
	str = str + "};"
	str = str + "\r\n"
	str =
		str +
		`for(let key in result){
    ${storageValue}.setItem(key,result[key])\r\n
}`
	console.log(str)
}

getAllStorage()
getAllStorage("sessionStorage")
