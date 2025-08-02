const ENV = (process.env.ENV || 'prod').toLowerCase();

let locatorsModule: any;

switch (ENV) {
    case 'prod':
        locatorsModule = require('./login.locators.prod');
        break;
    default:
        locatorsModule = require('./login.locators.ci');
}

export const loginLocators = locatorsModule.loginLocators;