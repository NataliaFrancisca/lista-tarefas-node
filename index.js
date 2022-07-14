// MODULOS EXTERNOS
const chalk = require('chalk');
const inquirer = require('inquirer');

// MODULO INTERNO
const fs = require('fs');

// INICIALIZAR O APP
const operation = () => {

    if(!fs.existsSync('tasks')){
        fs.mkdirSync('tasks')
        fs.writeFileSync(`tasks/tasks.json`, `[]`, ((err) => console.log(err)));
    }

    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Adicionar Tarefa',
            'Deletar Tarefa',
            'Concluir Tarefa',
            'Exibir Tarefas',
            'Sair'
        ]
    }]).then((answer) => {
        const action = answer['action'];

        const handleActions = {
            'Adicionar Tarefa' : showInterfaceAddTask,
            'Deletar Tarefa' : showInterfaceDeleteTask,
            'Concluir Tarefa' : showInterfaceCheckTask,
            'Exibir Tarefas' : showTasks,
            'Sair' : getOut
        }

        handleActions[action]();

    }).catch((error) => console.log(error));
}

operation();

// ADICIONAR A TAREFA
const showInterfaceAddTask = () => {
    console.log(chalk.inverse.bold("Olá, aqui você pode anotar suas tarefas!!!"));
    add_task();
}

const add_task = () => {
    console.log(chalk.yellow.bold("Para voltar para o menu de navegação, digitar a letra: ") + chalk.bgYellow.bold("S"))

    inquirer.prompt([{
        name: 'task',
        message: "Digite a tarefa que você quer anotar: ",
        
    }]).then((answer) => {
        const task = answer['task'];
        let prevData = get_tasks();
        const newTask = { id: createID(), checked: false, text: task }

        if(!task){
            console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente!"));
            return add_task();
        }

        if(task.toUpperCase() == 'S'){
            return operation();
        }

        prevData = [...prevData, newTask];
        update_file(prevData);
 
        console.log(chalk.green("Sua tarefa foi adicionada :)"));
       
        setTimeout(() => {
            console.clear();
            add_task();
        }, 1000)

    }).catch(err => console.log(err));
}

// DELETAR UMA TAREFA
const showInterfaceDeleteTask = () => {
    const tasks = get_tasks();

    if(tasks.length == 0){
        console.log(chalk.bgRed.black("Não existe nenhuma tarefa para ser deletada!"));
        return operation();
    }

    inquirer.prompt([
        {
            type: 'list',
            name: "task",
            message: "Qual tarefa você deseja deletar?",
            choices: [...tasks.map(task => `[${task.id}] - ${task.text}`), `sair`]
        }
    ]).then((answer) => {
        const task = answer['task'];

        if(!task){
            console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente!"));
            return operation();
        }

        if(task == `sair`){
            return operation();
        }

        delete_task(task);
        console.log(chalk.bgGreen.bold("Tarefa deletada com sucesso!!"));
        clear_screen();

    }).catch((error) => console.log(error))
}

const delete_task = (task) => {
    const prevData = get_tasks();
    const updatedData = prevData.filter(taskFilter => taskFilter.id !== onNumberID(task));
    update_file(updatedData);
}

// CHECK THE TASK
const showInterfaceCheckTask = () => {
    const tasks = get_tasks();

    if(tasks.length == 0){
        console.log(chalk.bgRed.black("Não existe nenhuma tarefa para ser concluida!"));
        return operation();
    }

    inquirer.prompt([
        {
            type: 'list',
            name: "task",
            message: "Qual tarefa você quer concluir? ",
            choices: [...tasks.map(task => `[${task.id}] - ${task.text}`), `sair`]
        }
    ]).then((answer) => {
        const task = answer['task'];

        if(task == `sair`){
            return operation()
        }
    
        check_task(task);
        console.log(chalk.bgGreen.bold("Tarefa concluida com sucesso!!"));
        clear_screen();

    }).catch((error) => console.log(error))
}

const check_task = (task) => {
    const tasks = get_tasks();

    tasks.map(taskMap => {
        if(taskMap.id == onNumberID(task)){
            taskMap.checked = true;
            return taskMap;
        }
        return taskMap;
    })

    update_file(tasks);
}

// SHOW THE TASKS WITH CHECKED STYLE
const showTasks = () => {
    const tasks = get_tasks();

    if(tasks.length == 0){
        console.log(chalk.bgRed.black("Não existe nenhuma tarefa para ser exibida!"));
        return operation();
    }

    console.log(chalk.bgMagentaBright.green.bold("Suas tarefas: "))
    tasks.map(task => task.checked ? console.log(chalk.green.bold.strikethrough(task.text)) : console.log(task.text))
    setTimeout(() => {
        operation();
    },1000)
}

// SAIR DO APP
const getOut = () => {
    console.log(chalk.bgMagentaBright.green.bold('Obrigado por usar nosso APP de tarefas'))
    process.exit();
}

const onNumberID = (task) => {
    const getStringID = task.split(" ")[0];
    const ID = parseInt(getStringID.replace(/[^0-9]/g, ""));
    return ID;
}

const createID = () => {
    const total = get_tasks();

    const id_notes = total.map(note => note.id);
    const maxID = Math.max(...id_notes);

    return total.length == 0 ? 1 : maxID + 1;
}

const update_file = (data) => {
    fs.writeFileSync(`tasks/tasks.json`, 
        JSON.stringify(data), 
    function(err){
        console.log(err)
    })
}

const clear_screen = () => {
    setTimeout(() => {
        console.clear();
        operation();
    }, 1000)
}

const get_tasks = () => {
    const fileJSON = fs.readFileSync(`tasks/tasks.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(fileJSON);
}

