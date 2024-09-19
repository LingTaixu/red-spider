### 关于git提交报错解决方案
> by.chenss 2023年08月28日

1. **填写提交信息**: 在进行 Git 提交时，确保提交信息按照规范填写。提交信息一般包括类型（type）和主题（subject）。

2. **检查配置**: 检查你的 TypeScript 项目是否正确配置了 commitlint，包括校验规则和提交信息格式。可能需要查看项目根目录下的 `.commitlintrc` 或其他配置文件。

3. **查看帮助文档**: 如果你不清楚如何配置 TypeScript 项目的 commitlint 或者如何填写合适的提交信息，可以查阅 commitlint 的文档，特别是关于 TypeScript 项目的配置部分。

例如 feat: add new xxxx （ xxx可以用中文 但是feat后面的冒号必须用英文


    前端接口
    noah 合约
    getPool 获取池子数量 call
        incomePool 正在收益的池子总数 做fromWei
        incomeCount 正在收益的订单数
        total 历史累计总数 做fromWei
        totalCount 历史累计订单数
        fundPool 资金池 做fromWei

    getRewards 获取用户得到的奖励总数 call 
        linkReward 直推奖励数量 做fromWei
        societyReward 社区奖励数  做fromWei
    
    LevelBalanceOf 奖励余额数量 call 
        入 address -> 授权地址
        出 amount -> 地址余额 fromWei 大于0 就可以领取 调用 claimReward 
    
    getClaimStatus 获取订单状态 call 
        入参 orderId 订单Id
        出参 status 订单状态 3 代码需要再添加一单 6代表可领取 其他状态不可以操作 
            time   倒计时 单位秒 还有多久可以領取訂單
            
    getPayToken 获取支付代币token call 
        出参 payToken ERC20 代币合约 用这个合约做fromWei
        这个代币在支付时需要授权

    getNodeAmount 获取用户订单数据 call
        入参 address 授权地址
        出参 
        count 用户先入场订单数量
        amount 用户利舟貌数

    getAdmissionParam 获取入场参数 call
        memberCount 用户最大拥有多少在收益订单
        lotAmount 每手金额
        maxLot  最大多少手
        minDay 用户选择最小天数
        maxDay 用户选择最大天数 
    
    entrance  入场   send
        quantity 份数
        parent 上级地址 冷斌出接口获取
        destroyToken 销毁代币token ERC20 冷斌出接口做列表 授权
        day 收益多少天
        第一步调用payToken 合约 授权noah合约 
        第二步调用 destroyToken 合约 授权noah合约
        第三步调用当前方法
        
    claimReward 领取奖励 send
    
    claim 領取訂單 send 
        入参 orderId 订单Id


    config 合约

    getDestroyAmount  获取销毁代币支付数量 call
        入参
            amount payToken支付的数量
            destroyToken 销毁代码Token
        出参
            destroyAmount 销毁的数量 用 销毁代码Token fromWei 显示在页面

    getInsurancePool 获取保险池 call
        出参
        address token, 代币合约
        uint256 amount, 数量
        string  symbol, 币种
        uint256 decimals 小数位数


    容量已满

    订单管理
        调用模板管理接口

    灯塔列表 /noah/reward/log/list
    灯塔余额 LevelBalanceOf