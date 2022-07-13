// MODULOS EXTERNOS
const chalk = require('chalk');
const inquirer = require('inquirer');

// MODULO INTERNO
const fs = require('fs');


// INICIALIZAR O APP

const operation = () => {

    if(!fs.existsSync('tasks')){
        fs.mkdirSync('tasks')

        fs.writeFileSync(
            `tasks/file.json`,
            `{"notes": []}`,
            function (err) {
                console.log(err)
            },
        )
    }

    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Adicionar Tarefa',
            'Deletar Tarefa',
            'Concluir Tarefa',
            'Editar Tarefa',
            'Exibir Tarefas',
            'Sair'
        ]
    }]).then((answer) => {
        const action = answer['action'];

        if(action == 'Adicionar Tarefa'){
            addTask();
        }else if(action == 'Deletar Tarefa'){
            deleteTask();
        }else if(action == 'Concluir Tarefa'){
            onCheck();
        }else if(action == 'Editar Tarefa'){
            editTask();
        }else if(action == 'Exibir Tarefas'){
            showTasks();
        }else if(action == "Sair"){
            console.log(chalk.bgBlue.black('Obrigado por usar BANCO OLIVAR RODRIGO'))
            process.exit();
        }
        
    }).catch((error) => console.log(error));
}

operation();


// ADICIONAR A TAREFA
const addTask = () => {
    console.log(chalk.inverse.bold("Olá, aqui você pode anotar suas tarefas!!!"));
    onAddTask();
}

const onAddTask = () => {
    console.log(chalk.yellow.bold("Para voltar para o menu de navegação, digitar a letra: ") + chalk.bgYellow.bold("S"))

    inquirer.prompt([
        {
            name: 'task',
            message: "Digite a tarefa que você quer anotar: ",
        }
    ]).then((answer) => {
        const task = answer['task'];
        const tasks = getTasks();

        if(!task){
            console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente!"));
            return onAddTask();
        }

        if(task.toUpperCase() == 'S'){
            return operation();
        }

        const newTask = {
            id: createID(),
            checked: false,
            text: task
        }

        tasks.notes = [...tasks.notes, newTask];
        updateFile(tasks);
 
        console.log(chalk.green("Sua tarefa foi adicionada :)"));
       
        setTimeout(() => {
            console.clear();
            onAddTask();
        }, 1000)

    }).catch(err => console.log(err));
}

// DELETAR UMA TAREFA
const deleteTask = () => {
    const tasks = getTasks();
    const arrayTasks = tasks.notes.map(task => `[${task.id}] - ${task.text}`);

    if(arrayTasks.length == 0){
        console.log(chalk.bgRed.black("Não existe nenhuma tarefa para ser deletada!"));
        return operation();
    }

    inquirer.prompt([
        {
            type: 'list',
            name: "task",
            message: "Qual tarefa você deseja deletar?",
            choices: arrayTasks
        }
    ]).then((answer) => {
        const task = answer['task'];
        tasks.notes = tasks.notes.filter(taskFilter => taskFilter.id !== onNumberID(task));

        if(!task){
            console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente!"));
            return operation();
        }

        updateFile(tasks);

        console.log(chalk.bgGreen.bold("Tarefa deletada com sucesso!!"));

        setTimeout(() => {
            console.clear();
            operation();
        }, 1000)
    }).catch((error) => console.log(error))
}

const onCheck = () => {
    const tasks = getTasks();
    const arrayTasks = tasks.notes.map(task => `[${task.id}] - ${task.text}`);

    if(arrayTasks.length == 0){
        console.log(chalk.bgRed.black("Não existe nenhuma tarefa para ser concluida!"));
        return operation();
    }

    inquirer.prompt([
        {
            type: 'list',
            name: "task",
            message: "Qual tarefa você quer concluir? ",
            choices: arrayTasks
        }
    ]).then((answer) => {
        const task = answer['task'];
        tasks.notes = tasks.notes.map(taskMap => {
            if(taskMap.id == onNumberID(task)){
                taskMap.checked = true;
                return taskMap;
            }

            return taskMap;
        })

        updateFile(tasks);

        console.log(chalk.bgGreen.bold("Tarefa concluida com sucesso!!"));

        setTimeout(() => {
            console.clear();
            operation();
        }, 1000)
    }).catch((error) => console.log(error))
}


const showTasks = () => {
    const tasks = getTasks();

    if(tasks.notes.length == 0){
        console.log(chalk.bgRed.black("Não existe nenhuma tarefa para ser exibida!"));
        return operation();
    }

    tasks.notes.map(task => task.checked ? console.log(chalk.green.bold.strikethrough(task.text)) : console.log(task.text))

    setTimeout(() => {
        operation();
    },1000)
  
}


const onNumberID = (task) => {
    const getStringID = task.split(" ")[0];
    const ID = parseInt(getStringID.replace(/[^0-9]/g, ""));
    return ID;
}

const updateFile = (data) => {
    fs.writeFileSync(`tasks/file.json`, 
        JSON.stringify(data), 
    function(err){
        console.log(err)
    })
}

const createID = () => {
    const total = getTasks();

    const id_notes = total.notes.map(note => note.id);
    const maxID = Math.max(...id_notes);

    return total.notes.length == 0 ? 1 : maxID + 1;
}

const getTasks = () => {
    const fileJSON = fs.readFileSync(`tasks/file.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(fileJSON);
}



// ADICIONAR NOVA TAREFA
// DELETAR TAREFA
// CONCLUIR TAREFA
// EDITAR TAREFA
// EXIBIR MINHAS TAREFAS
