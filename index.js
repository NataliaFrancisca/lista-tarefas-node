// MODULOS EXTERNOS
const chalk = require('chalk');
const inquirer = require('inquirer');

// MODULO INTERNO
const fs = require('fs');


// INICIALIZAR O APP

const operation = () => {

    if(!fs.existsSync('tasks')){
        fs.mkdirSync('tasks')
        fs.writeFileSync(`tasks/file.json`, `{"notes": []}`, ((err) => console.log(err)));
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
            'Concluir Tarefa' : onCheck,
            'Exibir Tarefas' : showTasks,
            'Sair' : sair
        }

        handleActions[action]();

    }).catch((error) => console.log(error));
}

operation();


const sair = () => {
    console.log(chalk.bgBlue.black('Obrigado por usar BANCO OLIVAR RODRIGO'))
    process.exit();
}

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
        const prevData = getTasks();
        const newTask = { id: createID(), checked: false, text: task }

        if(!task){
            console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente!"));
            return add_task();
        }

        if(task.toUpperCase() == 'S'){
            return operation();
        }

        prevData.notes = [...prevData.notes, newTask];
        updateFile(prevData);
 
        console.log(chalk.green("Sua tarefa foi adicionada :)"));
       
        clear_screen();

    }).catch(err => console.log(err));
}

// DELETAR UMA TAREFA
const showInterfaceDeleteTask = () => {
    const tasks = getTasks();

    if(tasks.length == 0){
        console.log(chalk.bgRed.black("Não existe nenhuma tarefa para ser deletada!"));
        return operation();
    }

    inquirer.prompt([
        {
            type: 'list',
            name: "task",
            message: "Qual tarefa você deseja deletar?",
            choices: tasks.map(task => `[${task.id}] - ${task.text}`)
        }
    ]).then((answer) => {
        const task = answer['task'];

        if(!task){
            console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente!"));
            return operation();
        }

        delete_task(task);
      
        console.log(chalk.bgGreen.bold("Tarefa deletada com sucesso!!"));

        clear_screen();
    }).catch((error) => console.log(error))
}

const delete_task = (task) => {
    const prevData = getTasks();

    const updatedData = prevData.filter(taskFilter => taskFilter.id !== onNumberID(task));
    updateFile(updatedData);
}








const clear_screen = () => {
    setTimeout(() => {
        console.clear();
        operation();
    }, 1000)
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
