'use strict';
let _ = require('underscore');


module.exports = app => {
    class authUserController extends app.Controller {

        * edit (ctx) {
            const query = ctx.params;
            const userInfo = ctx.user;

            if (userInfo.id !== Number(query.id)) {
                ctx.body = {
                    code: '403',
                    msg: ctx.helper.errorCode['403'],
                    result: {
                        userId: userInfo,
                        uri: '',
                    },
                };
                ctx.status = 403;
                return false;
            }


            const result = yield ctx.service.auth.user.edit(query.id);

            if (!result) {
                ctx.body = {
                    code: '404',
                    msg: ctx.helper.errorCode['404'],
                    result: {
                        id: query.id
                    }
                };
                ctx.status = 404;

                return false;
            }

            ctx.body = {
                code: '0',
                msg: 'OK',
                result: _.pick(result, ...['id', 'user_account', 'user_name', 'user_sex', 'user_mobile', 'user_email', 'remark'])
            }
        }

        * update (ctx) {
            const id = ctx.params.id;
            const query = ctx.request.body;

            const createRule = {
                user_account: {
                    type: 'string',
                    required: true
                },
                user_name: {
                    type: 'string',
                    required: true
                },
                user_mobile: {
                    type: 'string',
                    required: false,
                    allowEmpty: true
                },
                user_email: {
                    type: 'email',
                    required: false,
                    allowEmpty: true
                }
            };

            try {
                ctx.validate(createRule);
            } catch (err) {

                this.ctx.body = {
                    code: '400',
                    msg: ctx.helper.errorCode['400'],
                    result: err.errors
                };
                this.ctx.status = 400;

                return;
            }

            const result = yield ctx.service.auth.user.update(id, _.pick(query, ...Object.keys(createRule)));

            if (!result.affectedRows) {
                ctx.body = {
                    code: '404',
                    msg: ctx.helper.errorCode['404'],
                    result: {
                        id,
                    }
                };
                ctx.status = 404;

                return false;
            }

            ctx.body = {
                code: '0',
                msg: 'OK',
                result: {}
            }
        }

        * setPassword (ctx) {
            const id = ctx.params.id;
            const query = ctx.request.body;

            const createRule = {
                user_password: {
                    type: 'string',
                    required: true,
                },
            };

            try {
                ctx.validate(createRule);
            } catch (err) {

                this.ctx.body = {
                    code: '400',
                    msg: ctx.helper.errorCode['400'],
                    result: err.errors
                };
                this.ctx.status = 400;

                return;
            }

            const result = yield ctx.service.auth.user.update(id, _.pick(query, ...Object.keys(createRule)));

            if (!result.affectedRows) {
                ctx.body = {
                    code: '404',
                    msg: ctx.helper.errorCode['404'],
                    result: {
                        id,
                    }
                };
                ctx.status = 404;

                return false;
            }

            ctx.body = {
                code: '0',
                msg: 'OK',
                result: {}
            }
        }
    }
    return authUserController;
};