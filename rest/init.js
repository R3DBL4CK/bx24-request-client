const fs = require('fs').promises;
let readline = require('readline');

const questionList = [{
    question: 'BX24 login: ',
    key: 'login',
},
{
    question: 'BX24 password: ',
    key: 'password',
},
{
    question: 'BX24 portal name (e.g: portal.bitrix24.ru): ',
    key: 'portal',
},
{
    question: 'BX24 client_id: ',
    key: 'client_id',
},
{
    question: 'BX24 client_secret: ',
    key: 'client_secret',
},
];

async function rlQuestionPromisified(quest, rl) {
    return await new Promise((resolve) => {
        rl.question(quest.question, answer => resolve(answer));
    })
}

async function writeFileRecursive(filename, content, charset) {
    await filename.split('/').slice(0, -1).reduce(async (last, folder) => {
        let folderPath = last ? (last + '/' + folder) : folder;
        try {
            await fs.access(folderPath);
        } catch (error) {
            await fs.mkdir(folderPath);
        }
    })
    return fs.writeFile(filename, content, charset);
}

(async function () {
    try {
        let login = {};

        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        for (let quest of questionList)
            login[quest.key] = await rlQuestionPromisified(quest, rl);

        rl.close();
        console.log(login);

        await writeFileRecursive('./config/login.json', JSON.stringify(login), 'utf8');
        
        console.log('Login file was successfully created');
    } catch (error) {
        console.log(error);
    }

})()