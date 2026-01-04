
import React from 'react';
import { useSEOLogic } from './logic';
import { CityListPanel } from './city-list';
import { CityEditorPanel } from './city-editor';

export const AdminSEO = () => {
  const { state, setters, actions } = useSEOLogic();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[800px]">
      
      {/* LEFT: LIST KOTA */}
      <div className="lg:col-span-8 h-full">
        <CityListPanel 
            cities={state.filteredCities}
            loading={state.loading}
            searchTerm={state.searchTerm}
            setSearchTerm={setters.setSearchTerm}
            onEdit={actions.handleEdit}
            onDelete={actions.handleDelete}
        />
      </div>

      {/* RIGHT: FORM INPUT */}
      <div className="lg:col-span-4">
         <CityEditorPanel 
            form={state.form}
            setForm={setters.setForm}
            onSubmit={actions.handleSubmit}
            onReset={actions.resetForm}
            loading={state.loading}
         />
      </div>

    </div>
  );
};
