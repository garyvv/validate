module.exports = function (input, rules, message = {}) {
    let msgKey

    for (let field in rules) {

        rules[field].split('|').forEach(rule => {
            // 普通的message key名称
            msgKey = field + '.' + rule

            if (rule === 'required') {
                if (!!input[field] === false) {
                    let msg = !!message[msgKey] === true ? message[msgKey] : field + ' 不能为空'
                    throw new Error(msg)
                }
                return true
            }

            // 非必填项，有值再进行判断
            if (!!input[field] === false) return true

            // 特殊条件
            if (rule.indexOf(':') > 0) {
                let checkRule = rule.split(':')
                msgKey = field + '.' + checkRule[0]
                switch (checkRule[0]) {
                    case 'in':
                        let ruleData = checkRule[1].split(',')
                        // 数组
                        if (ruleData instanceof Array === true) {
                            field = field.toString()
                            if (ruleData.indexOf(input[field]) === -1) {
                                let msg = !!message[msgKey] === true ? message[msgKey] : field + ' 非法'
                                throw new Error(msg)
                            }
                        } else {
                            let msg = '规则设置错误'
                            throw new Error(msg)
                        }
                        break
                    case 'min':
                        let min = parseInt(checkRule[1])
                        if (isNaN(input[field]) === true) {
                            // 字符串
                            if (input[field].length < min) {
                                let msg = !!message[msgKey] === true ? message[msgKey] : field + ' 不能小于' + min + '个字符'
                                throw new Error(msg)
                            }
                        } else {
                            // 数字
                            if (input[field] < min) {
                                let msg = !!message[msgKey] === true ? message[msgKey] : field + ' 不能小于' + min
                                throw new Error(msg)
                            }
                        }
                        break
                    case 'max':
                        let max = parseInt(checkRule[1])
                        if (isNaN(input[field]) === true) {
                            // 字符串
                            if (input[field].length > max) {
                                let msg = !!message[msgKey] === true ? message[msgKey] : field + ' 不能大于' + max + '个字符'
                                throw new Error(msg)
                            }
                        } else {
                            // 数字
                            if (input[field] > max) {
                                let msg = !!message[msgKey] === true ? message[msgKey] : field + ' 不能大于' + max
                                throw new Error(msg)
                            }
                        }
                        break
                    default:
                        console.log('error “：” rule: ' + rule)
                        let msg = '参数验证详细规则错误'
                        throw new Error(msg)
                        break
                }
                return true
            }

            // 简单条件
            switch (rule) {
                case 'numeric':
                    if (isNaN(input[field]) === true) {
                        let msg = !!message[msgKey] === true ? message[msgKey] : field + ' 必须为数字'
                        throw new Error(msg)
                    }
                    break
                case 'array':
                    if (Object.prototype.toString.call(input[field]) !== '[object Array]') {
                        let msg = !!message[msgKey] === true ? message[msgKey] : field + ' 必须为数组'
                        throw new Error(msg)
                    }
                    break
                default:
                    console.log('error rule: ' + rule)
                    let msg = '参数验证规则错误'
                    throw new Error(msg)
                    break
            }
            return true
        })

    }

}