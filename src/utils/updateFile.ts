function insertTextNextToWord(initText: string, target: string, text: string, position: 'before' | 'after') {
    let idx = initText.indexOf(target);

    if (position === 'after') {
        idx -= target.length;
    }

    return initText.slice(0, idx) + text + initText.slice(idx);
}

export { insertTextNextToWord };
