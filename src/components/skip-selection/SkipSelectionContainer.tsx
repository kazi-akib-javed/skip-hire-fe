import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import ProgressSteps from '../progress/ProgressSteps';
import FixedBackButton from '../layout/FixedBackButton';
import Toast from '../common/toast/Toast';
import SkipSelection from './SkipSelection';

const SkipSelectionContainer: React.FC = () => {
  const handleBackButtonClick = () => {
    console.log('Back button clicked!');
    alert('Back button clicked - implement navigation here!');
  };

  return (
    <Provider store={store}>
      <div>
        <ProgressSteps currentStep="Select Skip" />
        <FixedBackButton onClick={handleBackButtonClick} />
        <SkipSelection />
        <Toast />
      </div>
    </Provider>
  );
};

export default SkipSelectionContainer; 