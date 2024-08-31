type MessageType = 'success' | 'info' | 'error';

const message = (type: MessageType, message: string, exit?: boolean) => {
    const colors = {
        success: '\x1b[32m',
        info: '\x1b[34m',
        error: '\x1b[31m',
    };

    const isError = type === 'error';

    console.log(colors[type], isError ? `😠 ${message} 😠` : message, '\x1b[0m');
    if (exit || isError) process.exit(0);
};

export default message;
