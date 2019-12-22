import React, { useState, useEffect } from "react"
import api from "../../services/api"

import Container from "../../components/Container"

import {Link} from "react-router-dom"

import {FaGithubAlt, FaPlus, FaSpinner} from "react-icons/fa"

import {Form, SubmitButton, List} from "./styles"

export default function Main() {

   const [newRepo, setNewRepo] = useState('')
   const [repositories, setRepositories] = useState([])
   const [loading, setloading] = useState(false)

    const handleSubmit = async e => {
        setloading(true)
        e.preventDefault();
        
        const resp =await api.get(`/repos/${newRepo}`)
        
        const data = {
            name: resp.data.full_name
        }
        
        setRepositories([...repositories, data])
        setNewRepo('')
        setloading(false)
    }   

    useEffect(() => {
        const repositories = localStorage.getItem('repositories')

        if(repositories){
            setRepositories(JSON.parse(repositories))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('repositories', JSON.stringify(repositories))
    }, [repositories])

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>

                <Form onSubmit={handleSubmit}>
                    <input 
                    type="text" 
                    placeholder="Adicionar repositório"
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    />
                    
                    <SubmitButton loading={loading}>
                        {loading ? 
                        <FaSpinner color="#fff" size={14} />
                            :
                        <FaPlus color="#fff" size={14} /> }
                    </SubmitButton>
                </Form>

                <List>
                    {repositories.map(repositorie => (
                        <li key={repositorie.name}>
                            <span>{repositorie.name}</span>
                            <Link to={`/repository/${encodeURIComponent(repositorie.name)}`}>Detalhes</Link>
                        </li>
                    ))}  
                </List>
            </Container>
            );
    }