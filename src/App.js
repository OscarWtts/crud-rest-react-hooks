import React, { useState, useEffect, useRef } from 'react';
import Dialogo from './components/Dialogo.js';

import { FiscaliaService } from './service/FiscaliaService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Menubar } from 'primereact/menubar';
import { Growl } from 'primereact/growl';

import './App.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const App = () => {

  //Seteamos las variables de estado. (HOOOKS)
  const [fiscalias, setFiscalias] = useState([]);                 // Contendrá el arreglo de fiscalias
  const [fiscalia, setFiscalia] = useState({});                   // Contendrá solo una fiscalia
  const [visible, setVisible] = useState(false);                // Utilizado para mostrar cuadro de diálogo
  const [selectedFiscalia, setSelectedFiscalia] = useState({});   // Contendrá solo a la fiscalia que sea seleccionada de la lista. 

  const fiscaliaService = new FiscaliaService();

  useEffect(() => {
    fiscaliaService.getAll().then(data => setFiscalias(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  // Botones a mostrar en el menú bar.
  const items = [
    {
      label: 'Nuevo',
      icon: 'pi pi-fw pi-plus',
      command: () => { setVisible(true) }
    },
    {
      label: 'Editar',
      icon: 'pi pi-fw pi-pencil',
      command: () => { showEditDialog() }
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-fw pi-trash',
      command: () => { deleteRegister() }
    }
  ];

  let growl = useRef(null);

  return (
    <div style={{ width: '80%', margin: '0 auto', marginTop: '20px' }}>
      <Growl ref={growl} />
      <Menubar model={items}></Menubar>
      <br />
      <Panel header="Fiscalias de Guatemala" >
        <DataTable
          value={fiscalias}
          paginator={true}
          rows={4}
          selectionMode="single"
          selection={selectedFiscalia}
          onSelectionChange={e => setSelectedFiscalia(e.value)}
        >
          <Column field="id" header="ID"></Column>
          <Column field="nombre" header="Nombre"></Column>
          <Column field="departamento" header="Departamento"></Column>
          <Column field="municipio" header="Municipio"></Column>
          <Column field="direccion" header="Dirección"></Column>
          <Column field="telefono" header="Telefono"></Column>
        </DataTable>
      </Panel>

      <Dialogo
        visible={visible}
        setVisible={setVisible}
        fiscalia={fiscalia}
        setFiscalia={setFiscalia}
        save={save}
        growl={growl}
      />
    </div>

  );

  function save() {
    fiscaliaService.save(fiscalia).then(data => {
      setFiscalia({
        nombre: '',
        departamento: '',
        municipio: '',
        direccion: '',
        telefono: ''
      });
      setVisible(false);
      growl.current.show({ severity: 'success', summary: 'Atención', detail: 'Se guardó el registro correctamente.' });
      fiscaliaService.getAll().then(data => setFiscalias(data));
    })

  }

  function deleteRegister() {
    if (window.confirm("Está seguro que desea eliminar el registro?")) {
      fiscaliaService.delete(selectedFiscalia.id).then(() => {
        growl.current.show({ severity: 'success', summary: 'Atención', detail: 'Se eliminó el registro correctamente.' });
        fiscaliaService.getAll().then(data => setFiscalias(data));
      });
    }
  }

  function showEditDialog() {
    setVisible(true);
    setFiscalia({
      id: selectedFiscalia.id,
      nombre: selectedFiscalia.nombre,
      departamento: selectedFiscalia.departamento,
      municipio: selectedFiscalia.municipio,
      direccion: selectedFiscalia.direccion,
      telefono: selectedFiscalia.telefono
    });
  }
}

export default App;
