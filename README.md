# validate
node js request validate module

### install
> npm i request-validate

### rule
- required: 必填字段
- numeric： 必须为数字
- array： 必须是数组
- min： 数字：最小值，字符：最小长度
- max： 
- in：必须在范围内  eg:   in:a,b,c
    
### example
```
const Validate = require('request-validate')

...

  let inputData = ....

  let rules = {
    'uid': 'required|min:1',
    'filter': 'in:1,2,3',
    'category': 'array'
  }

  // 选填，自定义异常信息
  let message = {
    'uid.required': 'uid 是必须的',
    'uid.numeric': 'uid 必须是数字',
    'filter.in': 'filter 必须在(1,2,3)范围内',
    'category.array': 'category 必须为数组'
  }

  Validate(inputData, rules, message)

```
