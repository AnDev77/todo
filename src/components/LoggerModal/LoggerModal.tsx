import React from 'react'
import { useTypedSelector } from '../../hooks/redux'
import { FiX } from 'react-icons/fi'
import LogItem from './LogItem/LogItem'
import { warpper } from '../EditModal/EditModal.css'
import {  closeButton, header, modalWindow, body, title } from './LoggerModal.css'
type TLoggerModalProps = {
    setIsModalOpen : React.Dispatch<React.SetStateAction<boolean>>
}
const LoggerModal : React.FC<TLoggerModalProps> = ({
    setIsModalOpen
}) => {

  const logs = useTypedSelector(state=> state.logger.logArray);  
  return (
    <div className={warpper}>
        <div className={modalWindow}>
            <div className={header}>
                <div className={title}>
                 활동기록
                </div>
                <FiX className={closeButton} onClick={()=>setIsModalOpen(false)}/>
            </div>
            <div className={body}>
                {logs.map((log) => (
                    <LogItem key = {log.logId} logItem={log}/>
                ))}
            </div>
        </div>
    </div>
  )
}

export default LoggerModal
