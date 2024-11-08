import React, { ChangeEvent, useState } from 'react'
import { FiCheck } from 'react-icons/fi';
import { icon } from './SideForm.css';
import { useTypedDispatch } from '../../../hooks/redux';
import { addBoard } from '../../../store/slices/boardSlice';
import { v4 as uuidv4 } from 'uuid';
import { addLog } from '../../../store/slices/loggerSlice';
type TSideFormProps = {
    inputRef : React.RefObject<HTMLInputElement>
    setIsFormOpen : React.Dispatch<React.SetStateAction<boolean>>
}
const SideForm  : React.FC<TSideFormProps> = ({
    setIsFormOpen,
    inputRef
}) => {

    const dispatch = useTypedDispatch();
    const [inputText, setInputText] = useState('');  
    const handleChange = (e : ChangeEvent<HTMLInputElement>) =>{
        setInputText(e.target.value);
    }
    const handleBlur = () => {
        setIsFormOpen(false);
    }
    const handleClick = () => {
        if(inputText){
            dispatch(
                addBoard({
                    
                    board : {
                        boardId : uuidv4(),
                        boardName : inputText,
                        lists : []    

                }
            })
            );

            dispatch(
                addLog({
                    logId : uuidv4(),
                    logMessage : `게시판 등록 ${inputText}`,
                    logAuthor : 'User',
                    logTimeStamp : String(Date.now()), 
                })
            )
        }
    }
    
    
    return (
        <div>
         <input
            ref = {inputRef}
            type = 'text'
            placeholder='새로운 게시판 등록하기'
            value ={inputText}
            onChange={handleChange}
            onBlur={handleBlur}
        >
        </input>
        <FiCheck className ={icon} onMouseDown={handleClick}></FiCheck> 
        </div>
  )
}

export default SideForm


