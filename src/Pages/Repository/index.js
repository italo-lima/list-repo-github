import React, {useState, useEffect} from "react"
import api from "../../services/api"
import {Link} from "react-router-dom"

import Container from "../../components/Container"

import {Loading, Owner, IssueList, PageActions, IssueFilter} from "./styles"

export default function Repository({match}){

    const [repository, setRepository] = useState({})
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState([
        { state: 'all', label: 'Todas', active: true },
        { state: 'open', label: 'Abertas', active: false },
        { state: 'closed', label: 'Fechadas', active: false }
    ])
    const [filterIndex, setFilterIndex] = useState(0)
    const [page, setPage] = useState(1)

    async function getRepo(){
        const repoName = decodeURIComponent(match.params.repository)
        //executa as 2 em sequência, só saí dá função quando as 2 acabarem
        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName}/issues`, {
                //filtro para buscar,similar a ..../?state=open&per_page=5
                params: {
                    state: filters.find(v => v.active).state,
                    per_page: 5
                }
            })
        ])
        
        setRepository(repository.data)
        setIssues(issues.data)
        setLoading(false)
    }

    async function loadIssues(){
        const repoName = decodeURIComponent(match.params.repository);

       const response = await api.get(`/repos/${repoName}/issues`, {
        params: {
            state: filters[filterIndex].state,
            per_page: 5,
            page,
        },
        });
        setIssues(response.data)
    };

    function handleFilterClick(filterIndex){
        setFilterIndex(filterIndex);
    };
  
    const handlePage = action => e => {
        e.preventDefault()
        setPage(
            action === 'next' ? page + 1 : page - 1
        )
    }

    useEffect(() => {
        getRepo()
    }, []) 

    useEffect(() => {
        loadIssues()
    }, [filterIndex, page]) 

    return (
        <>
        {loading && <Loading>Carregando </Loading>}

        {!loading && 
            <Container>
                <Owner>
                    <Link to="/">Voltar aos Repositórios</Link>
                    <img src={repository.owner.avatar_url} url={repository.owner.login} />
                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>
                <IssueList>
                    <IssueFilter active={filterIndex}>
                        {filters.map((filter, index) => (
                        <button
                            type="button"
                            key={filter.label}
                            onClick={() => handleFilterClick(index)}
                        >
                            {filter.label}
                        </button>
                        ))}
                    </IssueFilter>
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
                 
                <PageActions>
                    <button
                        type="button"
                        disabled={page < 2}
                        onClick={handlePage('back')}
                    >
                        Anterior
                    </button>
                    <span>Página {page}</span>
                    <button type="button" onClick={handlePage('next')}>
                        Próximo
                    </button>
                </PageActions> 
            </Container>
        }
        </>
    )
}