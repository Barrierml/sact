//将普通的html返回一个ast语法树
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:s-[\w-]+:|@|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!\--/
const conditionalComment = /^<!\[/


function listToMap(list) {
    let res = {};
    for (let i of list) {
        res[i.name] = i.value;
    }
    return res;
}

//Parser主处理函数 返回一个ast树
export default function Parse(html) {
    const stack = []
    let index = 0
    let last, lastTag, root
    while (html) {
        last = html

        let textEnd = html.indexOf('<')
        if (textEnd === 0) {

            //删除注释
            if (comment.test(html)) {
                const commentEnd = html.indexOf('-->')
                if (commentEnd >= 0) {
                    advance(commentEnd + 3)
                    continue
                }
            }

            //html声明
            const doctypeMatch = html.match(doctype)
            if (doctypeMatch) {
                console.log("处理html声明")
                advance(doctypeMatch[0].length)
                continue
            }

            // 标签结束:
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                const curIndex = index
                advance(endTagMatch[0].length)
                handleCloseTag(endTagMatch[1], curIndex, index)
                continue
            }

            // 标签开始:
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                handleStartTag(startTagMatch)
            }

        }
        //去除前面的空白或者文本
        let text, rest, next
        if (textEnd >= 0) {
            rest = html.slice(textEnd)
            while (
                !endTag.test(rest) &&
                !startTagOpen.test(rest) &&
                !comment.test(rest) &&
                !conditionalComment.test(rest)
            ) {
                //每去除掉一个< 就检查一遍剩下的文字是否符合条件
                next = rest.indexOf('<', 1)
                if (next < 0) break
                textEnd += next
                rest = html.slice(textEnd)
            }
            text = html.substring(0, textEnd)
        }

        if (textEnd < 0) {
            text = html
        }

        //将文本元素直接加入头部
        if (text) {
            advance(text.length)
            if (text.replace(/\s+/g, "")) {
                if(root){
                    stack[stack.length - 1].children.push(text);
                }
                else{
                    root = text;
                }
            }
        }
    }

    return root

    function advance(i) {
        index += i
        html = html.substring(i)
    }

    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
                start: index
            }
            advance(start[0].length)
            let end, attr
            while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
                attr.start = index
                advance(attr[0].length)
                attr.end = index
                match.attrs.push(attr)
            }
            if (end) {
                match.unarySlash = end[1]
                advance(end[0].length)
                match.end = index
                return match
            }
        }
    }

    //处理结束标签
    function handleCloseTag(tag, c, i) {
        let pos, lowerCasedTagName
        if (tag) {
            lowerCasedTagName = tag.toLowerCase()
            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos].tagName === lowerCasedTagName) {
                    break
                }
            }
        } else {
            console.log("标签：《" + tag + "》,没有找到闭合的标签！")
            return;
        }

        //关闭所有在这两者之间的标签，加入孩子池中
        if (pos >= 0) {
            for (let i = stack.length - 1; i > pos; i--) {
                stack[pos].children.push(stack[i])
                stack[i].parent = stack[pos]
            }
        }
        if (pos) {
            stack[pos].parent = stack[pos - 1]
            stack[pos - 1].children.push(stack[pos])
        }
        //清空栈，并设置最后的父标签
        lastTag = pos ? stack[pos - 1] : stack[pos]
        stack.length = pos
    }
    //处理开始标签
    function handleStartTag(match) {
        let name = match.tagName
        let unary = match.unarySlash

        let [attrs,attrsMap] = parseAttrs(match.attrs)

        let currentAst = {
            tagName: name,
            attrs: attrs,
            attrsMap:attrsMap,
            children: [],
        }

        if(!root){root = currentAst}
        if (!unary) { //非闭合标签入栈
            stack.push(currentAst)
        }
        else { //闭合直接加入父元素
            currentAst.parent = lastTag
            if(root && root !== currentAst){
                stack[stack.length - 1].children.push(currentAst)
            }
        }

        //处理属性
        function parseAttrs(Attrs) {
            const l = Attrs.length
            const attrs = new Array(l)
            for (let i = 0; i < l; i++) {
                const args = match.attrs[i]
                const value = args[3] || args[4] || args[5] || ''
                attrs[i] = {
                    name: args[1],
                    value: value,
                }
            }
            return [attrs,listToMap(attrs)]
        }
    }
}