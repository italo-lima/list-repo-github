import React, {useState, useEffect} from "react"
import api from "../../services/api"
import {Link} from "react-router-dom"

import Container from "../../components/Container"

import {Loading, Owner, IssueList} from "./styles"

export default function Repository({match}){

    const [repository, setRepository] = useState({})
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const repoName = decodeURIComponent(match.params.repository)

        async function getRepo(){
            //executa as 2 em sequência, só saí dá função quando as 2 acabarem
            const [repository, issues] = await Promise.all([
                api.get(`/repos/${repoName}`),
                api.get(`/repos/${repoName}/issues`, {
                    //filtro para buscar,similar a ..../?state=open/?per_page=5
                    params: {
                        state: "open",
                        per_page: 5
                    }
                })
            ])
            console.log(repository)
            console.log(issues)
            setRepository(repository.data)
            setIssues(issues.data)
            setLoading(false)
        }

        getRepo()
    }, []) 


    return (
        <>
        {loading && <Loading>Carregando </Loading>}

        {!loading && 
        <>
            <Container>
                <Owner>
                    <Link to="/">Voltar aos Repositórios</Link>
                    <img src={repository.owner.avatar_url} url={repository.owner.login} />
                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>
                <IssueList>
                    {issues.map(issue => (
                        <li key={String(issue.id)}>
                            <img src={issue.user.avatar_url} alt={issue.user.login} />
                            <div>
                                <strong>
                                    <a href={issue.html_url}>{issue.title}</a>
                                    {issue.labels.map(label => (
                                        <span key={String(label.id)} >{label.name}</span>
                                    ))}
                                </strong>
                                <p>{issue.user.login}</p>
                            </div>
                        </li>
                    ))}
                </IssueList>
            </Container>
        </>
        }
        </>
    )
}