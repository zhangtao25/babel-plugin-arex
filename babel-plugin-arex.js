module.exports = function trafficLoggerPlugin({types: t}) {
    return {
        visitor: {
            CallExpression(path) {
                // 如果是调用 app.get 或 app.post 方法
                if (
                    t.isMemberExpression(path.node.callee) &&
                    t.isIdentifier(path.node.callee.object, {name: 'app'}) &&
                    (t.isIdentifier(path.node.callee.property, {name: 'get'}) ||
                        t.isIdentifier(path.node.callee.property, {name: 'post'}))
                ) {
                    const route = path.node.arguments[0].value;
                    const callback = path.node.arguments[1];
                    // 检查回调函数是否是一个函数
                    if (t.isFunction(callback)) {
                        // 如果回调函数是一个箭头函数，需要检查 body 是否是块级作用域
                        if (t.isArrowFunctionExpression(callback) && !t.isBlockStatement(callback.body)) {
                            // 如果不是块级作用域，则创建一个块级作用域，并将回调函数的 body 更新为块级作用域
                            callback.body = t.blockStatement([t.returnStatement(callback.body)]);
                        }
                        // 在回调函数的开头插入一个 console.log 调用，记录请求方法、路径和请求体
                        callback.body.body.unshift(
                            t.expressionStatement(
                                t.callExpression(t.identifier('console.log'), [
                                    t.identifier('req'),
                                ]),
                            ),
                        );
                    }
                }
            },
        },
    };
};
