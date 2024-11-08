import React from 'react'
import { GrSubtract } from 'react-icons/gr'
import { IList, ITask } from '../../types';
import Task from '../Task/Task';
import { useTypedDispatch } from '../../hooks/redux';
import { deleteList, setModalActive } from '../../store/slices/boardSlice';
import { addLog } from '../../store/slices/loggerSlice';
import { v4 } from 'uuid';
import { setModalData } from '../../store/slices/modalSlice';
import { deleteButton, header, listWrapper, name } from './List.css';
import ActionButton from '../ActionButton/ActionButton';
import { Droppable } from 'react-beautiful-dnd';

type TListProps = {
  boardId : string;
  list : IList;
}

const List : React.FC<TListProps>= ({
  list,
  boardId
}) => {
  const dispatch = useTypedDispatch();
  const handleListDelete = (listId: string)=>{
    dispatch(deleteList({boardId, listId}))
    dispatch(

        addLog({
          logId : v4(),
          logMessage : `리스트 삭제하기 : ${list.listName}`,
          logAuthor : "user",
          logTimeStamp : String(Date.now())
        })
    )
  }

  const handleClickChange = (boardId: string, listId: string, task: ITask) => {
    dispatch(setModalData({boardId, listId, task}));
    dispatch(setModalActive(true));
  }

  return (
    <Droppable droppableId={list.listId}>
      {provided =>(
        <div className={listWrapper}
          {...provided.droppableProps}
          ref={provided.innerRef}
          
        >
          <div className={header}>
            <div className={name}>{list.listName}</div>
              <GrSubtract 
              className={deleteButton}
              onClick={()=>handleListDelete(list.listId)}/>
            </div>
            {list.tasks.map((task, index)=>(
            <div 
              onClick={()=>handleClickChange(boardId, list.listId, task)}
              key = {task.taskId}>
                <Task
                  taskName={task.taskName}
                  taskDescription={task.taskDescription}
                  boardId = {boardId}
                  id = {task.taskId}
                  index={index}
                />

            </div>

            ))
            }
        {provided.placeholder}
        <ActionButton 
            boardId={boardId}
            listId={list.listId}
            list = {false}
            />
        </div>
        )}
      
    </Droppable>
    
  )
}

export default List
