import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BarraSuperior from './componentes/layout/BarraSuperior';
import BarraLateral from './componentes/layout/BarraLateral';
import Exibir from './componentes/pages/Exibir';
import Adicionar from './componentes/pages/Adicionar';
import Home from './componentes/pages/Home';
import './App.css';


function App() {
    const [pacientes, setPacientes] = useState([]);

    const handleAddPaciente = (novoPaciente) => {
        setPacientes((prevPacientes) => [...prevPacientes, novoPaciente]);
    };

    const handleDeletePaciente = (cpf) => {
        setPacientes((prevPacientes) => prevPacientes.filter(paciente => paciente.cpf !== cpf));
    };

    const handleEditPaciente = (cpf, dadosAtualizados) => {
        setPacientes((prevPacientes) => 
            prevPacientes.map(paciente => 
                paciente.cpf === cpf ? { ...paciente, ...dadosAtualizados } : paciente
            )
        );
    };

    return (
        <Router>
            <div className="page-background">
                <BarraSuperior />
                <div className="content-container">
                    <BarraLateral />
                    <div className="pages planodefundo">
                        <Routes>
                            <Route exact path='/' element={<Home />} />
                            <Route 
                                path='/Exibir' 
                                element={<Exibir pacientes={pacientes} onDelete={handleDeletePaciente} onEdit={handleEditPaciente} />} 
                            />
                            <Route 
                                path='/Adicionar' 
                                element={<Adicionar onAddPaciente={handleAddPaciente} />} 
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;