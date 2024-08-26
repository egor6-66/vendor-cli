import chalk from 'chalk';

export default {
    success: (message: string, exit?: boolean) => {
        console.log(chalk.bold.green(` 🎉 ${message} 🎉  ️`));
        if (exit) process.exit();
    },
    warning: (message: string) => {
        console.log(chalk.bold.yellow(` 🚨 ${message} 🚨  ️`));
    },
    error: (message: string, exit = true) => {
        console.log(chalk.bold.red(` ❗ ${message} ❗  ️`));
        if (exit) process.exit();
    },
};
