import { useState } from 'react';
import { appContainer, deletBoardButton, loggerButton } from './App.css.ts'
import { button } from './App.css.ts'
import { board } from './App.css.ts'
import BoardList from './components/BoardList/BoardList.tsx';
import ListsContainer from './components/ListsContainer/ListsContainer.tsx';
import { useTypedDispatch, useTypedSelector } from './hooks/redux.ts';
import EditModal from './components/EditModal/EditModal.tsx';
import LoggerModal from './components/LoggerModal/LoggerModal.tsx';
import { deleteBoard, sort } from './store/slices/boardSlice.ts';
import { addLog } from './store/slices/loggerSlice.ts';
import { v4 } from 'uuid';
import { DragDropContext} from 'react-beautiful-dnd';
function App() {
  const [activeBoardId, setActiveBoardId] = useState('board-0');
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const boards  = useTypedSelector(state => state.board.boardArray);
  const modalActive = useTypedSelector(state => state.board.modalActive);
  const getActiveBoard = boards.filter(board=>activeBoardId === board.boardId)[0];
  const lists = getActiveBoard.lists ;
  const dispatch = useTypedDispatch();
  
  const handleDragEnd = (result : any)=>{
    console.log(result);
    const {destination, source, draggableId} = result;
    const sourceList = lists.filter(
      list=> list.listId === source.droppableId
    )[0];
    dispatch(sort({
      boardIndex : boards.findIndex(board=>board.boardId===activeBoardId),
      droppableIdStart : source.droppableId, 
      droppableEnd : destination.droppableId,
      droppableIndexStart : source.index,
      droppableIndexEnd : destination.index,
      draggableId : draggableId
    }))
    dispatch(addLog({
      logId : v4(),
      logMessage : 
                   `${sourceList.tasks.filter(task=> task.taskId === draggableId )[0].taskName}을    
                    리스트 ${sourceList.listName}} 
                    에서 리스트${lists.filter(list=>list.listId === destination.droppableId)[0].listName} 으로 이동`,
      logAuthor : "user",
      logTimeStamp : String(Date.now())
    }))
  } 
  
  const handleDeleteBoard = ()=>{
    if(boards.length > 1) {
      dispatch(deleteBoard({
        boardId : getActiveBoard.boardId
      }))

      dispatch(addLog({
        logId : v4(),
        logMessage : `게시물 지우기 ${getActiveBoard.boardName}`,
        logAuthor : "user",
        logTimeStamp : String(Date.now())

      }))
      const indexToSet = () => {
        const delIndex = boards.findIndex(board=>
          board.boardId === activeBoardId
        )
        return delIndex === 0 ? delIndex + 1 : delIndex - 1;

      }
      setActiveBoardId(boards[indexToSet()].boardId);
    }else{
      alert('최소 게시판 개수는 한개입니다.')
    }
  }
  return (
   <div>
    <div className = {appContainer}>
      {isLoggerOpen ? <LoggerModal setIsModalOpen={setIsLoggerOpen}/> : null}
      {modalActive ? <EditModal/>: null}
      <BoardList
          activeBoardId = {activeBoardId}
          setActiveBoardId = {setActiveBoardId}
        />
      <div className = {board}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <ListsContainer lists = {lists} boardId ={getActiveBoard.boardId}></ListsContainer>
        </DragDropContext>

      </div>

      <div className= {button}>
        <button

          className={deletBoardButton}
          onClick={handleDeleteBoard}>
          이 게시판 삭제하기
        </button>
        <button
          className={loggerButton} 
          onClick={()=> setIsLoggerOpen(!isLoggerOpen)}>
          {isLoggerOpen ? "활동 목록 숨기기" : "활동 목록 보이기"}
        </button>
      </div>

    </div>
    
    

   </div>


  )
}

export default App
