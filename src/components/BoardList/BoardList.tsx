import React, { useRef, useState } from 'react'
import { useTypedDispatch, useTypedSelector } from '../../hooks/redux';
import SideForm from './SideForm/SideForm';
import { FiLogIn, FiPlusCircle } from 'react-icons/fi';
import { addButton, addSection, boardItem, boardItemActive, container, title } from './BoardList.css';
import clsx from 'clsx';
import { GoSignOut } from 'react-icons/go';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { app } from '../../firebase';
import { setUser } from '../../store/slices/userSlice';
import { useAuth } from '../../hooks/useAuth';

type TBoardListProps = {
    activeBoardId : string;
    setActiveBoardId : React.Dispatch<React.SetStateAction<string>>
}

const BoardList : React.FC<TBoardListProps> = ({activeBoardId, setActiveBoardId}) => {
  
    const {boardArray} = useTypedSelector(state=>state.board);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        setIsFormOpen(!isFormOpen);
        setTimeout(()=>{
            inputRef.current?.focus();
        }, 0)
        
    }
    const dispatch = useTypedDispatch();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider;
    const {isAuth} = useAuth();
    console.log(isAuth);
    const handleLogin  = ()=>{
        signInWithPopup(auth, provider)
        .then(userCredential=> {
            console.log(userCredential);
            dispatch(setUser({
                email : userCredential.user.email,
                id : userCredential.user.uid
            }))
        })
        .catch(error=>{
            console.log(error);
        })
    } 
    const handleOut = ()=>{
        signOut(auth)
            .then(()=>{
                dispatch(setUser({
                    email:'',
                    id:''
                }))
            })
            .catch((error)=>{
                console.log(error);
            })
    }

    return (
    <div className={container}>
     
     <div className={title}>
        게시판:
     </div>
     {boardArray.map((board, index)=>(
        <div>
            <div key = {board.boardId}
                onClick={()=> setActiveBoardId(boardArray[index].boardId)}
                
                className={
                    clsx(
                    {
                       [boardItemActive]: 
                            boardArray.findIndex(b => b.boardId === activeBoardId) === index,
                    },
                    {
                        [boardItem]: 
                            boardArray.findIndex(b=> b.boardId === activeBoardId) !== index

                    }
            
                    )
                }
            > 
                <div>
                    {board.boardName}
                </div>
            </div>
        </div> 
     ))}
     
    <div className={addSection}>
     {
        isFormOpen 
        ?
        <SideForm inputRef = {inputRef}
        setIsFormOpen={setIsFormOpen}></SideForm>
        
        :
        <FiPlusCircle className = {addButton} onClick={handleClick}></FiPlusCircle>
        
     }
     {isAuth
        ?<GoSignOut
            onClick={handleOut}
            className={addButton}/>
        
        :<FiLogIn 
            onClick={handleLogin}
            className={addButton}/>
     }
        
        
    </div>
    </div>
  )
}

export default BoardList
