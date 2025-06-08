import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { hideToast } from '../../../store/toastSlice';
import './Toast.css';

const TOAST_DISPLAY_TIME = 2700;
const TOAST_HIDE_ANIMATION_TIME = 300;

const Toast: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { message, isVisible } = useSelector((state: RootState) => state.toast);
  const [isHiding, setIsHiding] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (isVisible) {
      timeoutRef.current = setTimeout(() => {
        setIsHiding(true);
        timeoutRef.current = setTimeout(() => {
          dispatch(hideToast());
          setIsHiding(false);
        }, TOAST_HIDE_ANIMATION_TIME);
      }, TOAST_DISPLAY_TIME);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isVisible, message, dispatch]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      key={message}
      className={`toast ${isHiding ? 'hiding' : ''}`}
    >
      {message}
    </div>
  );
};

export default Toast; 