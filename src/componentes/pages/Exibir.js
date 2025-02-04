import './Exibir.css';
import React, { useState } from 'react';

function Exibir({ pacientes, onDelete, onEdit }) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleToggleExpand = (index) => {
        setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const handleDeleteClick = (cpf) => {
        if (window.confirm("Tem certeza que deseja apagar este paciente?")) {
            onDelete(cpf);
        }
    };

    const handleEditClick = (paciente) => {
        const novoNome = prompt("Digite o novo nome do paciente:", paciente.nome);
        if (novoNome) {
            const dadosAtualizados = { ...paciente, nome: novoNome };
            onEdit(paciente.cpf, dadosAtualizados);
        }
    };

    if (!pacientes || pacientes.length === 0) {
        return (
            <div className="Pacientes">
                <p className='Titulo'>Pacientes:</p>
                <div className='form-group'>
                    <p>Nenhum paciente adicionado!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="Pacientes">
            <p className='Titulo'>Pacientes: </p>
            {pacientes.map((paciente, index) => (
                <div
                    key={index}
                    className={`informacoes-paciente ${expandedIndex === index ? 'expanded' : ''}`}
                    onClick={() => handleToggleExpand(index)}
                >
                    <div className="form-group">
                        <label>Nome Completo:</label> {paciente.nome}
                    </div>
                    <div className="form-group">
                        <label>Data da consulta:</label> {paciente.dataConsulta}
                    </div>
                    <div className="form-group">
                        <label>Relato:</label> {paciente.relato}
                    </div>

                    {expandedIndex === index && (
                        <>
                            <div className="form-group">
                                <label>CPF:</label> {paciente.cpf}
                            </div>
                            <div className="form-group">
                                <label>Data de nascimento:</label> {paciente.dataNascimento}
                            </div>
                            <div className="form-group">
                                <label>Medicações em uso:</label> {paciente.medicacoes}
                            </div>
                            <div className="form-group">
                                <label>Diagnóstico:</label> {paciente.diagnostico}
                            </div>
                            <div className="form-group">
                                <label>Exames Solicitados:</label> {paciente.examesSolicitados}
                            </div>
                            <div className="form-group">
                                <label>Anotações de Retorno:</label> {paciente.anotacoesRetorno}
                            </div>
                            <button type="button" className="apagar-button" onClick={() => handleDeleteClick(paciente.cpf)}>Apagar</button>
                            <button type="button" className="editar-button" onClick={() => handleEditClick(paciente)}>Editar</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Exibir;
