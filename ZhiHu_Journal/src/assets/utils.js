// 检测是否为纯粹的对象
export const isPlainObject = function isPlainObject(obj) {
    let proto, Ctor;
    if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
    proto = Object.getPrototypeOf(obj);
    if (!proto) return true;
    Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
    return typeof Ctor === "function" && Ctor === Object;
};

// 处理最大宽度
export const handleMaxWidth = function handleMaxWidth() {
    let HTML = document.documentElement,
        app = document.querySelector('#app'),
        size = parseFloat(HTML.style.fontSize);
    if (size > 75) {
        HTML.style.fontSize = '75px';
        app.style.width = '750px';
        return;
    }
    app.style.width = '100%';
    app.style.minHeight = HTML.clientHeight + 'px';
};

// 日期格式化
export const formatTime = function formatTime(time, template) {
    if (typeof time !== "string") { // 如果传进来的时间为空,则获取本地当前时间
        time = new Date().toLocaleString('zh-CN', { hour12: false });
    }
    if (typeof template !== "string") {
        template = "{0}年{1}月{2}日 {3}:{4}:{5}";
    }
    // 解析出年月日等信息
    let arr = [];
    if (/^\d{8}$/.test(time)) {
        let [, $1, $2, $3] = /^(\d{4})(\d{2})(\d{2})$/.exec(time);
        arr.push($1, $2, $3);
    } else {
        arr = time.match(/\d+/g);
    }
    // 把获取的数据替换模板
    return template.replace(/\{(\d+)\}/g, (_, $1) => {
        let item = arr[$1] || "00";
        if (item.length < 2) item = "0" + item;
        return item;
    });
};