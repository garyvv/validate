module.exports = function (input, rules, message = {}) {
    this.messageKey

    for (let field in rules) {

        rules[field].split('|').forEach(rule => {
            // 普通的message key名称
            msgKey = field + '.' + rule

            if (rule === 'required') {
                if (!!input[field] === false) {
                    this.message = !!message[msgKey] === true ? message[msgKey] : field + ' 不能为空'
                    throw new Error(500)
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
                            if (ruleData.indexOf(input[field]) === -1) {
                                this.message = !!message[msgKey] === true ? message[msgKey] : field + ' 非法'
                                throw new Error(500)
                            }
                        } else {
                            this.message = '规则设置错误'
                            throw new Error(500)
                        }
                        break
                    case 'min':
                        let min = parseInt(checkRule[1])
                        if (isNaN(input[field]) === true) {
                            // 字符串
                            if (input[field].length < min) {
                                this.message = !!message[msgKey] === true ? message[msgKey] : field + ' 不能少于' + min + '个字符'
                                throw new Error(500)
                            }
                        } else {
                            // 数字
                            if (input[field] < min) {
                                this.message = !!message[msgKey] === true ? message[msgKey] : field + ' 不能少于' + min
                                throw new Error(500)
                            }
                        }
                        break
                    case 'max':
                        let max = parseInt(checkRule[1])
                        if (isNaN(input[field]) === true) {
                            // 字符串
                            if (input[field].length > max) {
                                this.message = !!message[msgKey] === true ? message[msgKey] : field + ' 不能大于' + min + '个字符'
                                throw new Error(500)
                            }
                        } else {
                            // 数字
                            if (input[field] < max) {
                                this.message = !!message[msgKey] === true ? message[msgKey] : field + ' 不能大于' + min
                                throw new Error(500)
                            }
                        }
                        break
                    default:
                        console.log('error “：” rule: ' + rule)
                        this.message = '参数验证详细规则错误'
                        throw new Error(500)
                        break
                }
                return true
            }

            // 简单条件
            switch (rule) {
                case 'numeric':
                    if (isNaN(input[field]) === true) {
                        this.message = !!message[msgKey] === true ? message[msgKey] : field + ' 必须为数字'
                        throw new Error(500)
                    }
                    break
                case 'array':
                    if (Object.prototype.toString.call(input[field]) !== '[object Array]') {
                        this.message = !!message[msgKey] === true ? message[msgKey] : field + ' 必须为数组'
                        throw new Error(500)
                    }
                    break
                default:
                    console.log('error rule: ' + rule)
                    this.message = '参数验证规则错误'
                    throw new Error(500)
                    break
            }
            return true
        })

    }

}