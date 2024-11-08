import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBoard, IList, ITask } from "../../types";


type TBoardState = {
    modalActive : boolean;
    boardArray : IBoard[]
}
type TAddboardAction = {
    board : IBoard;
}

type TDeleteListAction = {
    boardId : string;
    listId : string;
}
type TAddListAction = {
    boardId : string;
    list : IList;
}

type TAddTaskAction = {
    boardId : string;
    listId : string;
    task : ITask;
}

type TDeleteTaskAction = {
    boardId : string;
    listId : string;
    taskId : string;
}

type TDeleteBoardAction= {
    boardId : string;
}

type TSortAction = {
    boardIndex:number;
    droppableIdStart : string;
    droppableEnd : string;
    droppableIndexStart : number;
    droppableIndexEnd : number;
    draggableId : string;
}
 
const initialState : TBoardState = {
    modalActive : false,
    boardArray : [
        {
            boardId : 'board-0',
            boardName : "첫번째 게시물",
            lists : [
                {
                    listId : "list-0",
                    listName : "list 1",
                    tasks :[
                        {
                            taskId : "task-0",
                            taskName : "task 1",
                            taskDescription : '첫번째 일',
                            taskOwner : "an"},
                        {
                            taskId : "task-1",
                            taskName : "task 2",
                            taskDescription : '두번째 일',
                            taskOwner : "gw"
                        }
                    ]
                }
            ]
        }
    ]
} 
const boardSlice = createSlice({
    name : 'boards',
    initialState,
    reducers : {
        addBoard : (state, {payload} : PayloadAction<TAddboardAction>)=>{
            state.boardArray.push(payload.board);
        },
        addList : (state, {payload} : PayloadAction<TAddListAction>)=>{
            state.boardArray.map(board=>
                board.boardId === payload.boardId
                ? {... board, lists: board.lists.push(payload.list)}
                : board
            )
            

        },
        addTask : (state, {payload} : PayloadAction<TAddTaskAction>)=> {
            state.boardArray.map(board=>
                board.boardId === payload.boardId
                ? {
                    ...board, 
                    lists : board.lists.map(list=>
                        list.listId === payload.listId
                        ?{
                            ...list,
                            tasks : list.tasks.push(payload.task)
                        }
                        :list
                    )
                }
                : board

            )
        },

        updateTask : (state, {payload} :  PayloadAction<TAddTaskAction>) => {
            const board = state.boardArray.find( (board)=> board.boardId === payload.boardId)!;
            const list = board.lists.find((list)=> list.listId === payload.listId)!;
            const taskIdx = list.tasks.findIndex((task) => task.taskId === payload.task.taskId)!;
            list.tasks[taskIdx] = payload.task;

        },

        deleteBoard : (state, {payload} : PayloadAction<TDeleteBoardAction>)=>{
            state.boardArray = state.boardArray.filter(board => board.boardId !== payload.boardId);

        },
        deleteTask : (state, {payload} : PayloadAction<TDeleteTaskAction>)=>{

            const board  = state.boardArray.find(board => payload.boardId === board.boardId)!;
            const list = board.lists.find(list=> list.listId === payload.listId)!;
            list.tasks = list.tasks.filter(task=> task.taskId !== payload.taskId);         
        
        }
        
        ,

        deleteList : (state, {payload} : PayloadAction<TDeleteListAction>)=>{
            state.boardArray = state.boardArray.map(
                board =>
                    board.boardId === payload.boardId
                ?{
                    ...board,
                    lists: board.lists.filter(
                        list=> list.listId !== payload.listId
                    )
                }
                :
                board
            )
        },
        setModalActive : (state, {payload} : PayloadAction<boolean>)=>{
            state.modalActive = payload;
        },
        sort : (state, {payload} : PayloadAction<TSortAction>)=>{
            if(payload.droppableIdStart === payload.droppableEnd){
                const list = state.boardArray[payload.boardIndex].lists.find(list=>
                    list.listId === payload.droppableIdStart
                )!
                const card = list.tasks.splice(payload.droppableIndexStart, 1); 
                console.log(card);
                list.tasks.splice(payload.droppableIndexEnd, 0, ...card!);               
            
            }else{
                const listStart = state.boardArray[payload.boardIndex].lists.find(list=>
                    list.listId === payload.droppableIdStart
                )!
                const listEnd = state.boardArray[payload.boardIndex].lists.find(list=> list.listId === payload.droppableEnd)!;
                const card = listStart.tasks.splice(payload.droppableIndexStart, 1); 
                console.log(card);
                listEnd.tasks.splice(payload.droppableIndexEnd, 0, ...card!); 
            }

        }

    }
})


export const {sort,deleteBoard,setModalActive, updateTask, deleteTask, addBoard, addList, addTask, deleteList} = boardSlice.actions;
export const boardReducer = boardSlice.reducer;