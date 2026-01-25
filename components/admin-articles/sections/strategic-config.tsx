
import React from 'react';
import { EditorPanel } from '../editor-panel';

export const StrategicConfig = ({ manager, availablePillars }: any) => {
    const { form, setForm, aiLogic, aiState, actions } = manager;
    
    return (
        <EditorPanel 
            form={form}
            setForm={setForm}
            loading={aiLogic.loading}
            aiState={{ ...aiState, keywords: aiLogic.keywords }}
            actions={actions}
            availablePillars={availablePillars}
        />
    );
};
